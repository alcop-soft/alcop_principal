(function () {
  "use strict";

  const products = Array.isArray(window.PRODUCTS_DATA) ? window.PRODUCTS_DATA : [];
  const config = window.SHOWROOM_CONFIG || {};
  const category = document.body.dataset.productCategory;
  const assetBase = document.body.dataset.assetBase || "";
  const grid = document.getElementById("showroom-grid");
  const filtersWrap = document.getElementById("showroom-filters");
  const countEl = document.getElementById("product-count");
  const availableImages = window.AVAILABLE_IMAGE_PATHS instanceof Set ? window.AVAILABLE_IMAGE_PATHS : null;

  if (!category || !grid) {
    return;
  }

  const state = {
    type: "Todos"
  };

  const fallbackImage = config.fallbackImage || "hero-carousel/img4.png";

  const buildAssetPath = (path) => {
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

  const normalizePath = (path) => String(path || "").replace(/\\/g, "/").trim();
  const isAvailableImage = (path) => {
    if (!path) return false;
    if (/^https?:\/\//i.test(path)) return true;
    if (!availableImages) return true;
    return availableImages.has(normalizePath(path).toLowerCase());
  };

  const getFileStem = (path) => {
    const normalized = normalizePath(path);
    if (!normalized) return "";
    const fileName = normalized.split("/").pop() || "";
    return fileName.replace(/\.[^/.]+$/, "");
  };

  const normalizeStemKey = (value) => {
    const input = String(value || "");
    const withoutAccents = typeof input.normalize === "function"
      ? input.normalize("NFD").replace(/[\u0300-\u036f]/g, "")
      : input;
    return withoutAccents
      .toLowerCase()
      .replace(/[._-]+/g, " ")
      .replace(/\s+/g, " ")
      .trim();
  };

  const removeImageNumbers = (value) => String(value || "")
    .replace(/\(\s*\d+\s*\)/g, " ")
    .replace(/\s+\d+\s*$/g, " ")
    .replace(/\s+/g, " ")
    .trim();

  const getProductNameKey = (path) => {
    const formatted = formatNameFromPath(path);
    if (!formatted) return "";

    return normalizeStemKey(removeImageNumbers(formatted));
  };

  const buildImageGroupKey = (path, item) => {
    const nameKey = getProductNameKey(path);
    if (!nameKey) {
      return normalizePath(path).toLowerCase();
    }

    return nameKey;
  };

  const formatNameFromPath = (path) => {
    const stem = getFileStem(path);
    if (!stem) return "";
    const formatted = stem
      .replace(/[_-]+/g, " ")
      .replace(/\s*\.\s*/g, " ")
      .replace(/\s+/g, " ")
      .replace(/\(\s+/g, "(")
      .replace(/\s+\)/g, ")")
      .trim();

    if (!formatted || /^(img|save)[ _-]?\d+/i.test(formatted)) {
      return "";
    }

    return formatted;
  };

  const formatProductNameFromPath = (path) => {
    const formatted = formatNameFromPath(path);
    return removeImageNumbers(formatted) || formatted;
  };

  const buildCategoryProducts = (items) => {
    const grouped = new Map();

    items.forEach((item) => {
      const sourceImages = Array.isArray(item.images) ? item.images.filter(isAvailableImage) : [];
      const safeType = item.type || "General";
      const safeDescription = item.description || "";

      if (!sourceImages.length) {
        return;
      }

      sourceImages.forEach((imagePath) => {
        const groupKey = buildImageGroupKey(imagePath, item);
        if (!groupKey) return;

        if (grouped.has(groupKey)) {
          grouped.get(groupKey).images.push(imagePath);
          return;
        }

        const productId = `${item.id || category}-opt-${grouped.size + 1}`;
        grouped.set(groupKey, {
          id: productId,
          category: item.category || category,
          type: safeType,
          name: formatProductNameFromPath(imagePath) || item.name || safeType || `Producto ${grouped.size + 1}`,
          description: safeDescription,
          images: [imagePath]
        });
      });
    });

    return Array.from(grouped.values());
  };

  const categoryProducts = buildCategoryProducts(products.filter((item) => item.category === category));
  const getCategoryProducts = () => categoryProducts;

  const getTypes = (items) => {
    const unique = new Set();
    items.forEach((item) => {
      if (item.type) unique.add(item.type);
    });
    return ["Todos", ...Array.from(unique)];
  };

  const setActiveFilter = (button) => {
    if (!filtersWrap) return;
    filtersWrap.querySelectorAll(".showroom-filter").forEach((btn) => {
      btn.classList.toggle("active", btn === button);
    });
  };

  const renderFilters = (items) => {
    if (!filtersWrap) return;
    const types = getTypes(items);
    filtersWrap.innerHTML = types
      .map((type) => `<button type="button" class="showroom-filter${type === "Todos" ? " active" : ""}" data-type="${type}">${type}</button>`)
      .join("");
  };

  const renderProducts = () => {
    const items = getCategoryProducts().filter((item) => {
      if (state.type === "Todos") return true;
      return item.type === state.type;
    });

    if (countEl) {
      countEl.textContent = String(items.length);
    }

    if (!items.length) {
      grid.innerHTML = "<div class=\"showroom-empty\">No se encontraron productos</div>";
      return;
    }

    grid.innerHTML = items
      .map((item) => {
        const images = Array.isArray(item.images) && item.images.length ? item.images : [fallbackImage];
        const imageSrc = buildAssetPath(images[0]);
        const fallbackSrc = buildAssetPath(fallbackImage);
        const safeName = item.name || "Producto";
        return `
          <button class="showroom-card" type="button" data-product-id="${item.id}" data-aos="fade-up">
            <div class="showroom-media">
              <img src="${imageSrc}" alt="${safeName}" loading="lazy" decoding="async" data-fallback-src="${fallbackSrc}" data-product-id="${item.id}">
            </div>
            <div class="showroom-card-title">${safeName}${images.length > 1 ? ` <span>${images.length} estilos</span>` : ""}</div>
          </button>
        `;
      })
      .join("");

    grid.querySelectorAll(".showroom-card img").forEach((image) => {
      image.addEventListener("error", () => {
        const fallbackSrc = image.dataset.fallbackSrc;
        if (!fallbackSrc || image.dataset.fallbackApplied === "true") return;
        image.dataset.fallbackApplied = "true";
        image.src = fallbackSrc;
      }, { once: true });
    });

    if (window.AOS && typeof window.AOS.refresh === "function") {
      window.AOS.refresh();
    }
  };

  const handleFilterClick = (event) => {
    const button = event.target.closest(".showroom-filter");
    if (!button) return;
    state.type = button.dataset.type || "Todos";
    setActiveFilter(button);
    renderProducts();
  };

  const handleCardClick = (event) => {
    const card = event.target.closest("[data-product-id]");
    if (!card) return;
    const productId = card.dataset.productId;
    const product = categoryProducts.find((item) => String(item.id) === String(productId));
    if (!product) return;
    
    // Open the new Instagram-style product post modal
    if (window.ShowroomModal && typeof window.ShowroomModal.open === "function") {
      window.ShowroomModal.open(product, assetBase);
    }
  };

  const init = () => {
    const categoryItems = getCategoryProducts();
    renderFilters(categoryItems);
    renderProducts();

    if (filtersWrap) {
      filtersWrap.addEventListener("click", handleFilterClick);
    }

    grid.addEventListener("click", handleCardClick);
  };

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", init);
  } else {
    init();
  }
})();
