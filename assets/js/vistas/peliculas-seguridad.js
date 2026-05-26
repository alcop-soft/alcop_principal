const products = [
    { id: 1, name: "Película de Seguridad Premium", description: "Máxima protección contra rotura y fragmentación. Ideal para seguridad residencial y comercial.", price: 180000, type: "seguridad", thickness: "gruesa" },
    { id: 2, name: "Película Control Solar Clásica", description: "Reducción efectiva de calor y rayos UV. Ahorro energético garantizado.", price: 120000, type: "control-solar", thickness: "media" },
    { id: 3, name: "Película Combinada Premium", description: "Seguridad y control solar en un solo producto. Protección completa.", price: 250000, type: "combinada", thickness: "gruesa" },
    { id: 4, name: "Película de Seguridad Estándar", description: "Protección básica contra rotura. Ideal para ventanas residenciales.", price: 140000, type: "seguridad", thickness: "media" },
    { id: 5, name: "Película Control Solar Delgada", description: "Control solar en película delgada. Mantiene la estética de tus ventanas.", price: 95000, type: "control-solar", thickness: "delgada" },
    { id: 6, name: "Película Combinada Media", description: "Combinación de seguridad y control solar en espesor medio.", price: 200000, type: "combinada", thickness: "media" },
    { id: 7, name: "Película de Seguridad Delgada", description: "Protección en película delgada. Discreta y efectiva.", price: 110000, type: "seguridad", thickness: "delgada" },
    { id: 8, name: "Película Control Solar Premium", description: "Control solar de alta gama. Máxima eficiencia energética.", price: 160000, type: "control-solar", thickness: "gruesa" },
    { id: 9, name: "Película Combinada Delgada", description: "Seguridad y control solar en formato delgada. Elegancia y protección.", price: 175000, type: "combinada", thickness: "delgada" }
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
