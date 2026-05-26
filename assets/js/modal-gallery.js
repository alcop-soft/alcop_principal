(function () {
  "use strict";

  let sliderSwiper = null;

  const getModalRoot = () => {
    let root = document.getElementById("showroom-modal-root");
    if (!root) {
      root = document.createElement("div");
      root.id = "showroom-modal-root";
      document.body.appendChild(root);
    }
    return root;
  };

  const destroyMedia = () => {
    if (sliderSwiper) {
      sliderSwiper.destroy(true, true);
      sliderSwiper = null;
    }
  };

  const buildAssetPath = (path, assetBase) => {
    if (!path) return "";
    if (/^https?:\/\//i.test(path)) return path;
    if (
      path.startsWith("Productos/") ||
      path.startsWith("productos/") ||
      path.startsWith("img/")
    ) {
      return `${assetBase}assets/${path}`;
    }
    if (path.startsWith("products/")) {
      return `${assetBase}assets/productos/${path.slice("products/".length)}`;
    }
    return `${assetBase}assets/img/${path}`;
  };

  const buildModalMarkup = (product, assetBase, whatsappNumber, fallbackImage) => {
    const images = Array.isArray(product.images) && product.images.length ? product.images : [fallbackImage];
    const fallbackSrc = buildAssetPath(fallbackImage, assetBase);
    const slides = images
      .map((img, index) => {
        const src = buildAssetPath(img, assetBase);
        return `
          <div class="swiper-slide">
            <div class="product-post-image">
              <img src="${src}" alt="${product.name} imagen ${index + 1}" loading="lazy" decoding="async" data-fallback-src="${fallbackSrc}">
            </div>
          </div>
        `;
      })
      .join("");

    const message = encodeURIComponent(`Hola, me interesa el producto: ${product.name}`);
    const whatsappLink = `https://wa.me/${whatsappNumber}?text=${message}`;

    return `
      <div class="modal showroom-modal" id="showroomModal" tabindex="-1" aria-hidden="true">
        <div class="modal-dialog modal-lg modal-dialog-centered">
          <div class="modal-content">
            <div class="modal-header">
              <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Cerrar"></button>
            </div>
            <div class="modal-body">
              <div class="product-post">
                <div class="product-post-gallery">
                  <div class="swiper product-post-slider">
                    <div class="swiper-wrapper">
                      ${slides}
                    </div>
                    <div class="swiper-button-next"></div>
                    <div class="swiper-button-prev"></div>
                    <div class="swiper-pagination"></div>
                  </div>
                </div>
                <div class="product-post-content">
                  <h3 class="product-post-title">${product.name}</h3>
                  <p class="product-post-description">${product.description || ""}</p>
                  <a class="btn-whatsapp-post" href="${whatsappLink}" target="_blank" rel="noopener">
                    <i class="bi bi-whatsapp"></i> Consultar este producto
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    `;
  };

  const open = (product, assetBase) => {
    const config = window.SHOWROOM_CONFIG || {};
    const whatsappNumber = config.whatsappNumber || "573104692399";
    const fallbackImage = config.fallbackImage || "hero-carousel/img4.png";
    const root = getModalRoot();

    destroyMedia();
    root.innerHTML = buildModalMarkup(product, assetBase, whatsappNumber, fallbackImage);

    const modalEl = document.getElementById("showroomModal");
    if (!modalEl) return;

    modalEl.addEventListener("hidden.bs.modal", destroyMedia, { once: true });

    const sliderEl = modalEl.querySelector(".product-post-slider");
    modalEl.querySelectorAll("img[data-fallback-src]").forEach((image) => {
      image.addEventListener("error", () => {
        if (image.dataset.fallbackApplied === "true") return;
        image.dataset.fallbackApplied = "true";
        image.src = image.dataset.fallbackSrc;
      }, { once: true });
    });

    const allowLoop = Array.isArray(product.images) && product.images.length > 1;

    sliderSwiper = new Swiper(sliderEl, {
      loop: allowLoop,
      spaceBetween: 0,
      navigation: {
        nextEl: ".product-post-slider .swiper-button-next",
        prevEl: ".product-post-slider .swiper-button-prev"
      },
      pagination: {
        el: ".product-post-slider .swiper-pagination",
        clickable: true
      },
      effect: "slide",
      speed: 600
    });

    const modal = bootstrap.Modal.getOrCreateInstance(modalEl);
    modal.show();
  };

  window.ShowroomModal = { open };
})();
