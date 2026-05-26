const products = [
    { id: 1, name: "Sombrilla de Jardín Grande", description: "Sombrilla de jardín grande para espacios amplios. Protección solar efectiva y diseño elegante.", price: 280000 },
    { id: 2, name: "Toldo Retráctil Premium", description: "Toldo retráctil de alta calidad. Control total de sombra y protección contra rayos UV.", price: 450000 },
    { id: 3, name: "Pérgola de Aluminio", description: "Pérgola de aluminio resistente. Estructura duradera para crear espacios sombreados.", price: 850000 },
    { id: 4, name: "Sombrilla de Ratán", description: "Sombrilla de ratán sintético. Estilo elegante y resistencia a la intemperie.", price: 320000 },
    { id: 5, name: "Toldo Fijo de Lona", description: "Toldo fijo de lona resistente. Protección permanente para terrazas y patios.", price: 380000 },
    { id: 6, name: "Sombrilla de Playa", description: "Sombrilla portátil ideal para playa y piscina. Fácil de transportar y montar.", price: 150000 },
    { id: 7, name: "Pérgola de Madera", description: "Pérgola de madera natural. Estructura rústica y acogedora para espacios exteriores.", price: 950000 },
    { id: 8, name: "Toldo Motorizado", description: "Toldo motorizado con control remoto. Máxima comodidad y tecnología avanzada.", price: 1200000 },
    { id: 9, name: "Sombrilla de Centro", description: "Sombrilla de centro para mesas. Perfecta para áreas de comedor exterior.", price: 220000 },
    { id: 10, name: "Cortina de Exterior", description: "Cortina de exterior para crear sombra. Diseño moderno y funcional.", price: 180000 }
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
            <div class="product-card shadow-lg" data-aos="fade-up" style="cursor:pointer; border-radius:20px; overflow:hidden; position:relative; height:400px; display:flex; align-items:stretch;">
                <div class="product-image-placeholder" style="background:#e0e7ef; width:100%; height:100%; position:absolute; top:0; left:0;"></div>
                <div class="product-info" style="position:absolute; bottom:0; left:0; width:100%; background:rgba(10,30,80,0.82); color:#fff; padding:30px 20px 20px 20px; z-index:2;">
                    <h3 class="product-name" style="font-size:2rem; font-weight:bold; margin-bottom:10px;">${product.name}</h3>
                    <p class="product-description" style="font-size:1.1rem; margin-bottom:0;">${product.description}</p>
                    <div class="product-actions mt-3">
                        <button class="btn btn-success w-100" onclick="contactProduct(${product.id})">
                            <i class="bi bi-whatsapp"></i> Consultar
                        </button>
                    </div>
                </div>
            </div>
        </div>
    `).join('');
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

function contactProduct(id) {
    const product = products.find(p => p.id === id);
    const message = encodeURIComponent(`Hola, me interesa el producto: ${product.name}`);
    window.open(`https://wa.me/573104692399?text=${message}`, '_blank');
}

document.addEventListener('DOMContentLoaded', function() {
    renderProducts(products);
});
