export const MOCK_PRODUCTS = [
    {
        id: "p1",
        name: "Nomad Pouch",
        variant: "White & Black",
        category: "travel", // Coincide con el filtro
        price: 50,
        oldPrice: 80,
        discountPercent: 40,
        stock: 15,
        description: "El compañero perfecto para tus viajes. Este estuche minimalista y duradero está diseñado para organizar tus cables, cargadores y pequeños accesorios esenciales. Fabricado con materiales resistentes al agua para proteger tus pertenencias.",
        images: [
            "https://tailwindcss.com/plus-assets/img/ecommerce-images/category-page-07-product-01.jpg",
            "https://tailwindcss.com/plus-assets/img/ecommerce-images/product-page-03-product-02.jpg",
            "https://tailwindcss.com/plus-assets/img/ecommerce-images/product-page-03-product-03.jpg"
        ],
        details: [
            { key: "Material", value: "Nylon balístico resistente al agua" },
            { key: "Dimensiones", value: "20cm x 10cm x 5cm" },
            { key: "Cierre", value: "YKK Premium Zipper" },
            { key: "Garantía", value: "2 años de garantía limitada" }
        ]
    },
    {
        id: "p2",
        name: "Zip Tote Basket",
        variant: "Washed Black",
        category: "organization",
        price: 140,
        oldPrice: 180,
        discountPercent: 22,
        stock: 8,
        description: "La cesta tote reinventada. Con un cierre superior completo para seguridad y asas reforzadas, este bolso es ideal tanto para el mercado como para la oficina. Su estructura semirrígida mantiene la forma incluso cuando está vacío.",
        images: [
            "https://tailwindcss.com/plus-assets/img/ecommerce-images/category-page-07-product-02.jpg",
            "https://tailwindcss.com/plus-assets/img/ecommerce-images/product-page-03-product-04.jpg",
            "https://tailwindcss.com/plus-assets/img/ecommerce-images/category-page-07-product-05.jpg"
        ],
        details: [
            { key: "Material", value: "Lona de algodón encerado" },
            { key: "Capacidad", value: "25 Litros" },
            { key: "Limpieza", value: "Limpiar con paño húmedo" },
            { key: "Origen", value: "Diseñado en California" }
        ]
    },
    {
        id: "p3",
        name: "Medium Stuff Satchel",
        variant: "Blue",
        category: "accessories",
        price: 220,
        oldPrice: 260,
        discountPercent: 15,
        stock: 12,
        description: "Un bolso satchel mediano con un diseño atemporal. Cuenta con múltiples compartimentos internos para mantener tu tablet, libreta y móvil organizados. La correa ajustable permite llevarlo al hombro o cruzado.",
        images: [
            "https://tailwindcss.com/plus-assets/img/ecommerce-images/category-page-07-product-03.jpg",
            "https://tailwindcss.com/plus-assets/img/ecommerce-images/product-page-03-product-01.jpg",
            "https://tailwindcss.com/plus-assets/img/ecommerce-images/category-page-07-product-01.jpg"
        ],
        details: [
            { key: "Material", value: "Cuero sintético de alta calidad" },
            { key: "Correa", value: "Ajustable 80cm - 120cm" },
            { key: "Compartimentos", value: "3 internos, 1 externo" },
            { key: "Peso", value: "0.8 kg" }
        ]
    },
    {
        id: "p4",
        name: "High Wall Tote",
        variant: "Black & Orange",
        category: "organization",
        price: 210,
        oldPrice: 280,
        discountPercent: 25,
        stock: 5,
        description: "Diseñado para cargas pesadas y días largos. El High Wall Tote ofrece paredes laterales más altas para mayor capacidad y privacidad. Los detalles en naranja añaden un toque de visibilidad y estilo moderno.",
        images: [
            "https://tailwindcss.com/plus-assets/img/ecommerce-images/category-page-07-product-04.jpg",
            "https://tailwindcss.com/plus-assets/img/ecommerce-images/category-page-07-product-06.jpg",
            "https://tailwindcss.com/plus-assets/img/ecommerce-images/product-page-03-product-04.jpg"
        ],
        details: [
            { key: "Material", value: "Poliéster reciclado 900D" },
            { key: "Resistencia", value: "Soporta hasta 15kg" },
            { key: "Bolsillos", value: "2 laterales para botellas" },
            { key: "Uso recomendado", value: "Uso diario, Gimnasio" }
        ]
    },
    {
        id: "p5",
        name: "Zip Tote Basket",
        variant: "White & Black",
        category: "organization",
        price: 140,
        oldPrice: 160,
        discountPercent: 12,
        stock: 20,
        description: "La versión clásica en blanco y negro de nuestro Zip Tote. Elegante, funcional y listo para cualquier ocasión. Incluye un bolsillo interno con cremallera para objetos de valor.",
        images: [
            "https://tailwindcss.com/plus-assets/img/ecommerce-images/category-page-07-product-05.jpg",
            "https://tailwindcss.com/plus-assets/img/ecommerce-images/category-page-07-product-02.jpg",
            "https://tailwindcss.com/plus-assets/img/ecommerce-images/product-page-03-product-02.jpg"
        ],
        details: [
            { key: "Material", value: "Lona de algodón premium" },
            { key: "Dimensiones", value: "40cm x 35cm x 15cm" },
            { key: "Cierre", value: "Magnético y Cremallera" },
            { key: "Estilo", value: "Urbano / Casual" }
        ]
    },
    {
        id: "p6",
        name: "Zip High Wall Tote",
        variant: "White & Blue",
        category: "new-arrivals",
        price: 150,
        oldPrice: 200,
        discountPercent: 25,
        stock: 3,
        description: "Una fusión entre nuestro High Wall y el sistema Zip. Máxima seguridad con máxima capacidad. Perfecto para escapadas de fin de semana o días de playa.",
        images: [
            "https://tailwindcss.com/plus-assets/img/ecommerce-images/category-page-07-product-06.jpg",
            "https://tailwindcss.com/plus-assets/img/ecommerce-images/category-page-07-product-04.jpg",
            "https://tailwindcss.com/plus-assets/img/ecommerce-images/product-page-03-product-03.jpg"
        ],
        details: [
            { key: "Material", value: "Tejido técnico repelente al agua" },
            { key: "Asas", value: "Doble longitud (mano y hombro)" },
            { key: "Interior", value: "Forro impermeable" },
            { key: "Colección", value: "Verano 2026" }
        ]
    },
    {
        id: "p7",
        name: "Throwback Hip Bag",
        variant: "Salmon",
        category: "travel",
        price: 90,
        oldPrice: 120,
        discountPercent: 25,
        stock: 10,
        description: "Estilo retro con funcionalidad moderna. Esta riñonera (hip bag) en color salmón es perfecta para festivales o turismo urbano. Llévala en la cintura o cruzada al pecho.",
        images: [
            "https://tailwindcss.com/plus-assets/img/ecommerce-images/category-page-07-product-07.jpg",
            "https://tailwindcss.com/plus-assets/img/ecommerce-images/category-page-07-product-01.jpg",
            "https://tailwindcss.com/plus-assets/img/ecommerce-images/product-page-03-product-01.jpg"
        ],
        details: [
            { key: "Material", value: "Nylon 100%" },
            { key: "Correa", value: "Ajustable con clip rápido" },
            { key: "Bolsillos", value: "Principal + Secreto trasero" },
            { key: "Tamaño", value: "Compacto (2L)" }
        ]
    },
    {
        id: "p8",
        name: "Halfsize Tote",
        variant: "Clay",
        category: "sale",
        price: 210,
        oldPrice: 260,
        discountPercent: 19,
        stock: 7,
        description: "Para cuando no necesitas llevar toda la casa contigo. El Halfsize Tote ofrece la elegancia de nuestros bolsos grandes en un formato más manejable y ligero.",
        images: [
            "https://tailwindcss.com/plus-assets/img/ecommerce-images/category-page-07-product-08.jpg",
            "https://tailwindcss.com/plus-assets/img/ecommerce-images/category-page-07-product-03.jpg",
            "https://tailwindcss.com/plus-assets/img/ecommerce-images/product-page-03-product-02.jpg"
        ],
        details: [
            { key: "Material", value: "Arcilla natural teñida (Lona)" },
            { key: "Estructura", value: "Base reforzada" },
            { key: "Compatibilidad", value: "Tablets hasta 11 pulgadas" },
            { key: "Acabado", value: "Mate suave" }
        ]
    }
];