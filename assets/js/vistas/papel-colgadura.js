const products = [
    { id: 1, name: "Papel Moderno Abstracto", description: "Diseño abstracto moderno en colores vibrantes. Ideal para espacios contemporáneos.", price: 45000, style: "moderno", texture: "liso" },
    { id: 2, name: "Papel Clásico Floral", description: "Patrón floral clásico que nunca pasa de moda. Elegancia atemporal.", price: 55000, style: "clasico", texture: "liso" },
    { id: 3, name: "Papel Rústico Texturizado", description: "Textura rústica que añade calidez y carácter a cualquier espacio.", price: 60000, style: "rustico", texture: "texturizado" },
    { id: 4, name: "Papel Geométrico Moderno", description: "Patrones geométricos en colores neutros. Estilo minimalista y sofisticado.", price: 50000, style: "geometrico", texture: "liso" },
    { id: 5, name: "Papel Clásico con Relieve", description: "Diseño clásico con efecto relieve. Profundidad y elegancia en cada pared.", price: 75000, style: "clasico", texture: "relieve" },
    { id: 6, name: "Papel Moderno Texturizado", description: "Estilo moderno con textura sutil. Perfecto para crear ambientes acogedores.", price: 65000, style: "moderno", texture: "texturizado" },
    { id: 7, name: "Papel Geométrico Premium", description: "Patrones geométricos de alta calidad. Diseño exclusivo y duradero.", price: 80000, style: "geometrico", texture: "texturizado" },
    { id: 8, name: "Papel Rústico Natural", description: "Estilo rústico con acabado natural. Conecta con la naturaleza en tu hogar.", price: 58000, style: "rustico", texture: "liso" },
    { id: 9, name: "Papel Clásico Vintage", description: "Diseño vintage clásico que evoca elegancia y nostalgia.", price: 68000, style: "clasico", texture: "texturizado" },
    { id: 10, name: "Papel Moderno con Relieve", description: "Diseño moderno con efecto relieve. Textura que se siente y se ve.", price: 85000, style: "moderno", texture: "relieve" },
    { id: 11, name: "Papel Geométrico Minimalista", description: "Geometría minimalista en tonos suaves. Simplicidad y elegancia.", price: 48000, style: "geometrico", texture: "liso" }
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
