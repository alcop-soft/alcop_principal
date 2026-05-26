const products = [
    {
        id: 1,
        name: "Persiana Sheer Vertesse",
        description: "Persiana de tela premium con diseño moderno. Control total de luz y privacidad.",
        images: [
            "sheer/sheer (1).jpg",
            "sheer/sheer (2).jpg",
            "sheer/sheer (3).jpg"
        ]
    },
    {
        id: 2,
        name: "Persiana Sheer Classic",
        description: "Persiana de tela clásica con diseño elegante. Ideal para ambientes modernos.",
        images: [
            "sheer/sheer (4).jpg"
        ]
    },
    {
        id: 3,
        name: "Cortina Enrrollables",
        description: "Cortina enrrollable de alta calidad. Fácil instalación y control de luz.",
        images: [
            "enrollables (1).jpg",
            "enrollables (2).jpg"
        ]
    },
    {
        id: 4,
        name: "Persiana Onda Serena",
        description: "Persiana de tela con diseño ondulado. Ideal para ambientes modernos.",
        images: [
            "onda serena (1).jpg",
            "onda serena (2).jpeg"
        ]
    },
    {
        id: 5,
        name: "Persiana Vertical",
        description: "Persiana vertical en tela. Combinación de funcionalidad y diseño.",
        images: [
            "vertical/vertical (1).jpg",
            "vertical/vertical (2).jpg"
        ]
    },
    {
        id: 6,
        name: "Persiana Viewtex",
        description: "Persiana de viewte premium con acabados exclusivos.",
        images: [
            "sheer/sheer (5).jpg"
        ]
    },
    {
        id: 7,
        name: "Persiana Sheer Elegance",
        description: "Persiana sheer de alta calidad con acabados premium.",
        images: [
            "sheer/sheer (6).jpg"
        ]
    },
    {
        id: 8,
        name: "Persiana Celular",
        description: "Persiana celular de alta calidad. Control preciso de luz y privacidad.",
        images: [
            "CORTINA CELULAR.jpg",
            "celulares (1).JPG",
            "celulares (2).JPG"
        ]
    },
    {
        id: 9,
        name: "Panel Japonés",
        description: "Panel estilo japonés. Diseño minimalista y elegante.",
        images: [
            "panel/panel  (7).jpg",
            "panel/panel  (8).jpg"
        ]
    },
    {
        id: 10,
        name: "Persiana Macromadera",
        description: "Persiana de macromadera selecta. Máxima calidad y durabilidad.",
        images: [
            "macromadera (1).jpg"
        ]
    },
    {
        id: 11,
        name: "Minipersiana",
        description: "Minipersianas con acabados premium para ambientes modernos.",
        images: [
            "minipersiana (1).jpg"
        ]
    },
    {
        id: 12,
        name: "Persianas Sheer Royale",
        description: "Perfíl premium con acabados exclusivos para ambientes elegantes.",
        images: [
            "sheer/sheer (7).jpg"
        ]
    },
    {
        id: 13,
        name: "Persiana Romana",
        description: "Persiana romana de alta calidad con diseño elegante.",
        images: [
            "romana/romanas (3).jpg",
            "romana/romanas (4).jpg"
        ]
    }
];

let filteredProducts = [...products];

function renderProducts(productsToRender) {
    const container = document.getElementById('products-container');
    const countElement = document.getElementById('product-count');
    countElement.textContent = productsToRender.length;
    if (productsToRender.length === 0) {
        container.innerHTML = '<div class="col-12 text-center py-5"><h4>No se encontraron productos</h4></div>';
        return;
    }
    container.innerHTML = productsToRender.map(product => `
        <div class="col-lg-4 col-md-6 col-sm-12 mb-4">
            <div class="product-card shadow-lg" data-aos="fade-up" onclick="openProductModal(${product.id})" style="cursor:pointer; border-radius:20px; overflow:hidden; position:relative; height:400px; display:flex; align-items:stretch;">
                <img src="../assets/img/cortinas y persianas/${product.images[0]}" alt="${product.name}" style="width:100%; height:100%; object-fit:cover; position:absolute; top:0; left:0; z-index:1;">
                <div class="product-info" style="position:absolute; bottom:0; left:0; width:100%; background:rgba(255,255,255,0.95); color:#222; padding:30px 20px 20px 20px; z-index:2;">
                    <h3 class="product-name" style="font-size:2rem; font-weight:bold; margin-bottom:10px; color:#222;">${product.name}</h3>
                    <p class="product-description" style="font-size:1.1rem; margin-bottom:0; color:#333;">${product.description}</p>
                </div>
            </div>
        </div>
    `).join('');
}

// Modal y galería
function openProductModal(id) {
    const product = products.find(p => p.id === id);
    if (!product) return;
        let imagesHtml = `
            <div class="row g-3 justify-content-center">
                ${product.images.map(img => `
                    <div class="col-12 col-md-6 col-lg-4 d-flex align-items-center justify-content-center">
                        <img src="../assets/img/cortinas y persianas/${img}" alt="${product.name}" style="max-width:100%;max-height:320px;object-fit:contain;border-radius:12px;box-shadow:0 2px 12px rgba(0,0,0,0.08);">
                    </div>
                `).join('')}
            </div>`;
        const modalHtml = `
            <div class="modal fade" id="productModal" tabindex="-1" aria-labelledby="productModalLabel" aria-hidden="true">
                <div class="modal-dialog modal-xl modal-dialog-centered">
                    <div class="modal-content" style="border-radius:18px;">
                        <div class="modal-header" style="border-bottom:0;">
                            <h2 class="modal-title w-100 text-center" id="productModalLabel" style="font-size:2rem;">${product.name}</h2>
                            <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                        </div>
                        <div class="modal-body" style="padding:1.5rem;">
                            ${imagesHtml}
                            <div class="d-flex justify-content-center mt-4">
                                <button class="btn btn-success px-4 py-2" onclick="contactProduct(${product.id})" style="font-size:1.15rem;"><i class="bi bi-whatsapp"></i> Consultar por WhatsApp</button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        `;
    let modalContainer = document.getElementById('product-modal-container');
    if (!modalContainer) {
        modalContainer = document.createElement('div');
        modalContainer.id = 'product-modal-container';
        document.body.appendChild(modalContainer);
    }
    modalContainer.innerHTML = modalHtml;
    const modal = new bootstrap.Modal(document.getElementById('productModal'));
    modal.show();
}

function contactProduct(id) {
    const product = products.find(p => p.id === id);
    const message = encodeURIComponent(`Hola, me interesa el producto: ${product ? product.name : ''}`);
    window.open(`https://wa.me/573104692399?text=${message}`, '_blank');
}

// Botón WhatsApp general para todos los productos
function contactAllProducts() {
    const message = encodeURIComponent('Hola, me interesan los productos de cortinas y persianas.');
    window.open(`https://wa.me/573104692399?text=${message}`, '_blank');
}

function sortProducts() {
    const sortValue = document.getElementById('sort-select').value;
    
    switch(sortValue) {
        case 'price-asc':
            filteredProducts.sort((a, b) => a.price - b.price);
            break;
        case 'price-desc':
            filteredProducts.sort((a, b) => b.price - a.price);
            break;
        case 'name-asc':
            filteredProducts.sort((a, b) => a.name.localeCompare(b.name));
            break;
        case 'name-desc':
            filteredProducts.sort((a, b) => b.name.localeCompare(a.name));
            break;
        default:
            filteredProducts = [...products];
    }
    
    renderProducts(filteredProducts);
}


document.addEventListener('DOMContentLoaded', function() {
    renderProducts(products);
    // Agregar botón WhatsApp general
    let btn = document.createElement('button');
    btn.className = 'btn btn-success mb-4';
    btn.innerHTML = '<i class="bi bi-whatsapp"></i> Consultar por todos los productos';
    btn.onclick = contactAllProducts;
    const catalog = document.querySelector('.catalog-header');
    if (catalog) catalog.appendChild(btn);
});
