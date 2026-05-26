const products = [
    { id: 1, name: "Cojín Decorativo Moderno", description: "Cojín decorativo con diseño moderno y colores vibrantes. Perfecto para cualquier espacio.", price: 45000 },
    { id: 2, name: "Cojín de Algodón Premium", description: "Cojín de algodón 100% natural. Suave y cómodo para máximo confort.", price: 55000 },
    { id: 3, name: "Cojín Estampado Floral", description: "Cojín con estampado floral elegante. Añade un toque de naturaleza a tu hogar.", price: 48000 },
    { id: 4, name: "Cojín Geométrico Minimalista", description: "Diseño geométrico minimalista en tonos neutros. Estilo contemporáneo.", price: 50000 },
    { id: 5, name: "Cojín de Lino Natural", description: "Cojín de lino natural. Textura única y respirable para espacios frescos.", price: 60000 },
    { id: 6, name: "Cojín Terciopelo Elegante", description: "Cojín de terciopelo con acabado elegante. Lujo y sofisticación en cada detalle.", price: 75000 },
    { id: 7, name: "Cojín Estilo Boho", description: "Cojín con estilo bohemio. Colores cálidos y diseños únicos para espacios acogedores.", price: 52000 },
    { id: 8, name: "Cojín de Plumas Premium", description: "Relleno de plumas premium para máximo confort. Suavidad excepcional.", price: 85000 },
    { id: 9, name: "Cojín Rústico Texturizado", description: "Cojín con textura rústica. Estilo natural y acogedor para ambientes cálidos.", price: 58000 },
    { id: 10, name: "Cojín Moderno Abstracto", description: "Diseño abstracto moderno. Colores vivos y formas únicas para espacios contemporáneos.", price: 55000 }
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
