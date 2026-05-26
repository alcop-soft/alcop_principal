// Sample products data
const products = [
    { id: 1, name: "Piso de Roble Natural Premium", description: "Madera de roble de primera calidad con acabado natural. Ideal para interiores elegantes.", price: 85000, material: "roble", finish: "natural" },
    { id: 2, name: "Piso de Pino Barnizado", description: "Pino tratado con barniz protector. Duradero y fácil de mantener.", price: 65000, material: "pino", finish: "barnizado" },
    { id: 3, name: "Piso de Nogal Encerado", description: "Nogal con acabado encerado que realza la veta natural de la madera.", price: 95000, material: "nogal", finish: "encerado" },
    { id: 4, name: "Piso de Cedro Natural", description: "Cedro con acabado natural, perfecto para ambientes rústicos y modernos.", price: 75000, material: "cedro", finish: "natural" },
    { id: 5, name: "Piso de Roble Barnizado Clásico", description: "Roble con barniz que protege y embellece. Estilo clásico y atemporal.", price: 88000, material: "roble", finish: "barnizado" },
    { id: 6, name: "Piso de Pino Natural Económico", description: "Pino natural, excelente relación calidad-precio para cualquier espacio.", price: 55000, material: "pino", finish: "natural" },
    { id: 7, name: "Piso de Nogal Premium", description: "Nogal de alta gama con acabado profesional. Máxima elegancia.", price: 120000, material: "nogal", finish: "barnizado" },
    { id: 8, name: "Piso de Roble Encerado", description: "Roble con tratamiento encerado que proporciona brillo y protección.", price: 92000, material: "roble", finish: "encerado" },
    { id: 9, name: "Piso de Cedro Barnizado", description: "Cedro con barniz protector. Ideal para zonas de alto tráfico.", price: 78000, material: "cedro", finish: "barnizado" },
    { id: 10, name: "Piso de Pino Encerado", description: "Pino con acabado encerado. Brillo natural y fácil mantenimiento.", price: 68000, material: "pino", finish: "encerado" },
    { id: 11, name: "Piso de Roble Premium Plus", description: "Roble de máxima calidad con tratamiento especial. Garantía extendida.", price: 135000, material: "roble", finish: "barnizado" },
    { id: 12, name: "Piso de Nogal Natural Selecto", description: "Nogal seleccionado con acabado natural. Veta única y exclusiva.", price: 110000, material: "nogal", finish: "natural" }
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


// Initialize
document.addEventListener('DOMContentLoaded', function() {
    renderProducts(products);
});
