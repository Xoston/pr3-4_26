const express = require('express');
const cors = require('cors');

const app = express();
const PORT = 3000;

// Middleware
app.use(cors());
app.use(express.json());

// База данных товаров (10+ товаров)
let products = [
    { id: 1, name: "iPhone 14", category: "Смартфоны", description: "6.1 дюйм, A15 Bionic, 128 ГБ", price: 79990, stock: 15, rating: 5 },
    { id: 2, name: "Samsung Galaxy S23", category: "Смартфоны", description: "6.6 дюйм, 256 ГБ, Snapdragon", price: 74990, stock: 8, rating: 4 },
    { id: 3, name: "MacBook Air M2", category: "Ноутбуки", description: "13.6 дюйм, 8 ГБ RAM, 256 ГБ SSD", price: 119990, stock: 5, rating: 5 },
    { id: 4, name: "Dell XPS 13", category: "Ноутбуки", description: "13.4 дюйм, i7, 16 ГБ RAM", price: 109990, stock: 3, rating: 4 },
    { id: 5, name: "iPad Pro", category: "Планшеты", description: "11 дюйм, M2 чип, 128 ГБ", price: 89990, stock: 7, rating: 5 },
    { id: 6, name: "Samsung Tab S9", category: "Планшеты", description: "11 дюйм, AMOLED, 128 ГБ", price: 69990, stock: 4, rating: 4 },
    { id: 7, name: "Sony WH-1000XM5", category: "Аксессуары", description: "Беспроводные наушники с шумоподавлением", price: 34990, stock: 12, rating: 5 },
    { id: 8, name: "Apple Watch Series 9", category: "Аксессуары", description: "GPS, 41 мм, Always-On дисплей", price: 44990, stock: 6, rating: 4 },
    { id: 9, name: "PlayStation 5", category: "Игры", description: "Цифровая версия, 825 ГБ SSD", price: 49990, stock: 2, rating: 5 },
    { id: 10, name: "Xbox Series S", category: "Игры", description: "512 ГБ SSD, игровая консоль", price: 29990, stock: 4, rating: 4 },
    { id: 11, name: "Google Pixel 7", category: "Смартфоны", description: "6.3 дюйм, Tensor G2, 128 ГБ", price: 54990, stock: 10, rating: 4 },
    { id: 12, name: "iPad Mini", category: "Планшеты", description: "8.3 дюйм, A15 Bionic, 64 ГБ", price: 49990, stock: 9, rating: 5 }
];

// API Routes

// GET /api/products - получить все товары
app.get('/api/products', (req, res) => {
    res.json(products);
});

// GET /api/categories - получить все категории
app.get('/api/categories', (req, res) => {
    const categories = [...new Set(products.map(p => p.category))];
    res.json(categories);
});

// GET /api/products/:id - получить товар по ID
app.get('/api/products/:id', (req, res) => {
    const id = parseInt(req.params.id);
    const product = products.find(p => p.id === id);
    if (!product) {
        return res.status(404).json({ message: 'Товар не найден' });
    }
    res.json(product);
});

// POST /api/products - создать новый товар
app.post('/api/products', (req, res) => {
    const { name, category, description, price, stock, rating } = req.body;
    
    const newProduct = {
        id: products.length + 1,
        name,
        category,
        description,
        price: Number(price),
        stock: Number(stock),
        rating: Number(rating) || 5
    };
    
    products.push(newProduct);
    res.status(201).json(newProduct);
});

// PUT /api/products/:id - обновить товар
app.put('/api/products/:id', (req, res) => {
    const id = parseInt(req.params.id);
    const index = products.findIndex(p => p.id === id);
    
    if (index === -1) {
        return res.status(404).json({ message: 'Товар не найден' });
    }
    
    const { name, category, description, price, stock, rating } = req.body;
    
    products[index] = {
        id,
        name,
        category,
        description,
        price: Number(price),
        stock: Number(stock),
        rating: Number(rating) || products[index].rating
    };
    
    res.json(products[index]);
});

// DELETE /api/products/:id - удалить товар
app.delete('/api/products/:id', (req, res) => {
    const id = parseInt(req.params.id);
    const index = products.findIndex(p => p.id === id);
    
    if (index === -1) {
        return res.status(404).json({ message: 'Товар не найден' });
    }
    
    products = products.filter(p => p.id !== id);
    res.json({ message: 'Товар удален' });
});

// Запуск сервера
app.listen(PORT, () => {
    console.log(`🚀 API Server запущен на http://localhost:${PORT}`);
    console.log(`📦 Доступные маршруты:`);
    console.log(`   GET    http://localhost:${PORT}/api/products`);
    console.log(`   GET    http://localhost:${PORT}/api/categories`);
    console.log(`   POST   http://localhost:${PORT}/api/products`);
    console.log(`   PUT    http://localhost:${PORT}/api/products/:id`);
    console.log(`   DELETE http://localhost:${PORT}/api/products/:id`);
});