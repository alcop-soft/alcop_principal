const products = [
    { id: 1, name: "Alfombra de Rhapsody", description: "Alfombra de lana 100% natural. Suavidad y confort excepcionales.", price: 320000, material: "lana", size: "grande" },
    { id: 2, name: "Tapete de Algodón Moderno", description: "Tapete de algodón con diseño moderno. Fácil limpieza y mantenimiento.", price: 85000, material: "algodon", size: "mediano" },
    { id: 3, name: "Alfombra Sintética Resistente", description: "Alfombra sintética de alta resistencia. Ideal para zonas de alto tráfico.", price: 180000, material: "sintetico", size: "grande" },
    { id: 4, name: "Tapete de Yute Natural", description: "Tapete de yute ecológico. Estilo rústico y natural.", price: 95000, material: "yute", size: "pequeno" },
    { id: 5, name: "Alfombra de Lana Clásica", description: "Alfombra de lana con diseño clásico. Elegancia atemporal.", price: 380000, material: "lana", size: "grande" },
    { id: 6, name: "Tapete Sintético Económico", description: "Tapete sintético de excelente relación calidad-precio.", price: 65000, material: "sintetico", size: "pequeno" },
    { id: 7, name: "Alfombra de Algodón Premium", description: "Alfombra de algodón de alta calidad. Suave y duradera.", price: 250000, material: "algodon", size: "mediano" },
    { id: 8, name: "Tapete de Yute Grande", description: "Tapete de yute en tamaño grande. Perfecto para espacios amplios.", price: 150000, material: "yute", size: "grande" },
    { id: 9, name: "Alfombra Sintética Moderna", description: "Alfombra sintética con diseño moderno. Fácil mantenimiento.", price: 200000, material: "sintetico", size: "mediano" },
    { id: 10, name: "Tapete de Lana Pequeño", description: "Tapete de lana en tamaño pequeño. Ideal para espacios reducidos.", price: 120000, material: "lana", size: "pequeno" }
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
