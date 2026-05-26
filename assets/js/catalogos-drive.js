(function () {
  "use strict";

  const catalogLinks = document.querySelectorAll(".catalogos-section a[href*='drive.google.com/file/d/']");

  if (!catalogLinks.length) {
    return;
  }

  const getModalRoot = () => {
    let root = document.getElementById("catalogo-drive-modal-root");
    if (!root) {
      root = document.createElement("div");
      root.id = "catalogo-drive-modal-root";
      document.body.appendChild(root);
    }
    return root;
  };

  const buildModal = (title, src) => `
    <div class="modal catalogo-drive-modal" id="catalogoDriveModal" tabindex="-1" aria-hidden="true">
      <div class="modal-dialog modal-xl modal-dialog-centered">
        <div class="modal-content">
          <div class="modal-header">
            <h5 class="modal-title">${title}</h5>
            <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Cerrar"></button>
          </div>
          <div class="modal-body">
            <div class="catalogo-frame-wrap">
              <iframe src="${src}" title="${title}" loading="lazy" allow="autoplay"></iframe>
            </div>
          </div>
        </div>
      </div>
    </div>
  `;

  catalogLinks.forEach((link) => {
    link.addEventListener("click", (event) => {
      if (!window.bootstrap || !bootstrap.Modal) {
        return;
      }

      event.preventDefault();
      const card = link.closest(".card");
      const title = card?.querySelector(".card-title")?.textContent?.trim() || "Catalogo";
      const src = link.href;
      const root = getModalRoot();

      root.innerHTML = buildModal(title, src);

      const modalEl = document.getElementById("catalogoDriveModal");
      if (!modalEl) return;

      const modal = bootstrap.Modal.getOrCreateInstance(modalEl);
      modal.show();
    });
  });
})();
