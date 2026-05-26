const products = [
    { id: 1, name: "Mesa de Ratán Redonda", description: "Mesa redonda de ratán sintético. Resistente a la intemperie y elegante.", price: 450000, type: "mesa", material: "ratan" },
    { id: 2, name: "Silla de Aluminio Plegable", description: "Silla de aluminio plegable. Práctica y cómoda para exteriores.", price: 85000, type: "silla", material: "aluminio" },
    { id: 3, name: "Sofá de Ratán 3 Plazas", description: "Sofá de ratán para 3 personas. Confort y estilo para tu terraza.", price: 680000, type: "sofa", material: "ratan" },
    { id: 4, name: "Juego Completo Ratán", description: "Juego completo de ratán: mesa, 4 sillas y sofá. Diseño coordinado.", price: 1200000, type: "juego", material: "ratan" },
    { id: 5, name: "Mesa de Madera Teak", description: "Mesa de madera teak. Natural y resistente a las condiciones climáticas.", price: 750000, type: "mesa", material: "madera" },
    { id: 6, name: "Silla de Plástico Premium", description: "Silla de plástico de alta calidad. Ligera y fácil de mantener.", price: 65000, type: "silla", material: "plastico" },
    { id: 7, name: "Sofá de Aluminio Moderno", description: "Sofá de aluminio con cojines. Diseño moderno y funcional.", price: 550000, type: "sofa", material: "aluminio" },
    { id: 8, name: "Mesa de Aluminio Rectangular", description: "Mesa rectangular de aluminio. Ideal para espacios amplios.", price: 380000, type: "mesa", material: "aluminio" },
    { id: 9, name: "Juego Completo Aluminio", description: "Juego completo en aluminio. Moderno y duradero.", price: 950000, type: "juego", material: "aluminio" },
    { id: 10, name: "Silla de Madera Teak", description: "Silla de madera teak. Elegancia natural para exteriores.", price: 180000, type: "silla", material: "madera" },
    { id: 11, name: "Sofá de Plástico Modular", description: "Sofá modular de plástico. Versátil y resistente.", price: 420000, type: "sofa", material: "plastico" }
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
        <div class="col-lg-3 col-md-4 col-sm-6">
            <div class="product-card" data-aos="fade-up">
                <div class="product-image-placeholder"></div>
                <div class="product-info">
                    <h3 class="product-name">${product.name}</h3>
                    <p class="product-description">${product.description}</p>
                    <div class="product-actions">
                        <button class="btn btn-product-whatsapp" onclick="contactProduct(${product.id})">
                            <i class="bi bi-whatsapp"></i> Consultar
                        </button>
                    </div>
                </div>
            </div>
        </div>
    `).join('');
}

function contactProduct(id) {
    const product = products.find(p => p.id === id);
    const message = encodeURIComponent(`Hola, me interesa el producto: ${product.name}`);
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
});
