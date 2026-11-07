const store = {
  name: "mira. electro",
  whatsappNumber: ""
};

const categories = [
  { id: "todos", label: "Todos" },
  { id: "celulares", label: "Celulares" },
  { id: "tablets", label: "Tablets" },
  { id: "computacion", label: "Computación" },
  { id: "tv-audio", label: "TV y audio" },
  { id: "hogar", label: "Hogar" }
];

const products = [
  {
    id: "MIR-001", name: "Celular N1 · 128 GB", category: "celulares", image: "assets/celular.jpg",
    alt: "Celular oscuro de ejemplo con pantalla azul", price: 399900, badge: "Para todos los días",
    description: "Un celular de ejemplo pensado para comunicarte, sacar fotos y tener tus aplicaciones a mano.",
    features: ["Pantalla 6,5″", "128 GB", "Cámara dual"],
    specs: [["Pantalla", "6,5 pulgadas"], ["Almacenamiento", "128 GB"], ["Conectividad", "4G y Wi-Fi"], ["Color", "Grafito"]]
  },
  {
    id: "MIR-002", name: "Tablet A10 · 10,9″", category: "tablets", image: "assets/tablet.jpg",
    alt: "Tablet plateada de ejemplo con pantalla azul y lila", price: 349900, badge: "Liviana y práctica",
    description: "Una tablet de ejemplo para estudiar, mirar contenido y llevar tus ideas a cualquier parte.",
    features: ["Pantalla 10,9″", "64 GB", "Wi-Fi"],
    specs: [["Pantalla", "10,9 pulgadas"], ["Almacenamiento", "64 GB"], ["Conectividad", "Wi-Fi"], ["Color", "Plata"]]
  },
  {
    id: "MIR-003", name: "Notebook Aire · 14″", category: "computacion", image: "assets/notebook.jpg",
    alt: "Notebook plateada de ejemplo abierta con pantalla azul", price: 849900, badge: "Para trabajar",
    description: "Una notebook de ejemplo para tareas diarias, clases y proyectos personales.",
    features: ["Pantalla 14″", "8 GB RAM", "256 GB SSD"],
    specs: [["Pantalla", "14 pulgadas"], ["Memoria", "8 GB RAM"], ["Almacenamiento", "256 GB SSD"], ["Color", "Plata"]]
  },
  {
    id: "MIR-004", name: "PC Compacta · 24″", category: "computacion", image: "assets/pc.jpg",
    alt: "Computadora de escritorio de ejemplo con gabinete y monitor", price: 1099900, badge: "Equipo completo",
    description: "Una PC de escritorio de ejemplo para tener un espacio de trabajo cómodo en casa.",
    features: ["Monitor 24″", "16 GB RAM", "512 GB SSD"],
    specs: [["Monitor", "24 pulgadas"], ["Memoria", "16 GB RAM"], ["Almacenamiento", "512 GB SSD"], ["Incluye", "Gabinete y monitor"]]
  },
  {
    id: "MIR-005", name: "Smart TV Vista · 43″", category: "tv-audio", image: "assets/tv.jpg",
    alt: "Televisor de ejemplo con imagen abstracta azul", price: 529900, badge: "Para disfrutar",
    description: "Un televisor de ejemplo para películas, series y momentos en familia.",
    features: ["Pantalla 43″", "Resolución 4K", "Wi-Fi"],
    specs: [["Pantalla", "43 pulgadas"], ["Resolución", "4K"], ["Conectividad", "Wi-Fi"], ["Color", "Negro"]]
  },
  {
    id: "MIR-006", name: "Auriculares Nube", category: "tv-audio", image: "assets/auriculares.jpg",
    alt: "Auriculares inalámbricos blancos de ejemplo con estuche", price: 78900, badge: "Llevá tu música",
    description: "Auriculares inalámbricos de ejemplo con estuche compacto para acompañarte en movimiento.",
    features: ["Inalámbricos", "Estuche de carga", "Color blanco"],
    specs: [["Tipo", "Inalámbricos"], ["Incluye", "Estuche de carga"], ["Conexión", "Bluetooth"], ["Color", "Blanco"]]
  },
  {
    id: "MIR-007", name: "Freidora de Aire · 5 L", category: "hogar", image: "assets/freidora.jpg",
    alt: "Freidora de aire oscura de ejemplo con perilla", price: 189900, badge: "Para tu cocina",
    description: "Una freidora de aire de ejemplo para sumar practicidad a las comidas de todos los días.",
    features: ["Capacidad 5 L", "Control manual", "Canasto extraíble"],
    specs: [["Capacidad", "5 litros"], ["Control", "Perilla manual"], ["Canasto", "Extraíble"], ["Color", "Grafito"]]
  },
  {
    id: "MIR-008", name: "Cafetera Espresso Mini", category: "hogar", image: "assets/cafetera.jpg",
    alt: "Cafetera espresso compacta de ejemplo color crema", price: 249900, badge: "Un café en casa",
    description: "Una cafetera espresso compacta de ejemplo para hacer una pausa en casa.",
    features: ["Espresso", "Formato compacto", "Portafiltro"],
    specs: [["Tipo", "Espresso"], ["Formato", "Compacto"], ["Incluye", "Portafiltro"], ["Color", "Crema"]]
  }
];
