import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './App.css';

// API клиент
const API = axios.create({
  baseURL: 'http://localhost:3000/api'
});

function App() {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState('Все');
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);
  
  // Состояние формы
  const [formData, setFormData] = useState({
    name: '',
    category: '',
    description: '',
    price: '',
    stock: '',
    rating: '5'
  });

  // Загрузка данных при старте
  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      setLoading(true);
      const [productsRes, categoriesRes] = await Promise.all([
        API.get('/products'),
        API.get('/categories')
      ]);
      setProducts(productsRes.data);
      setCategories(['Все', ...categoriesRes.data]);
    } catch (error) {
      console.error('Ошибка загрузки:', error);
      alert('Ошибка загрузки данных. Проверьте сервер.');
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    try {
      if (editingProduct) {
        // Обновление товара
        await API.put(`/products/${editingProduct.id}`, formData);
        alert('Товар обновлен!');
      } else {
        // Создание товара
        await API.post('/products', formData);
        alert('Товар добавлен!');
      }
      
      // Обновляем список
      await fetchData();
      
      // Закрываем модалку
      setShowModal(false);
      setEditingProduct(null);
      setFormData({ name: '', category: '', description: '', price: '', stock: '', rating: '5' });
    } catch (error) {
      console.error('Ошибка сохранения:', error);
      alert('Ошибка при сохранении товара');
    }
  };

  const handleEdit = (product) => {
    setEditingProduct(product);
    setFormData(product);
    setShowModal(true);
  };

  const handleDelete = async (id) => {
    if (window.confirm('Удалить этот товар?')) {
      try {
        await API.delete(`/products/${id}`);
        alert('Товар удален!');
        fetchData();
      } catch (error) {
        console.error('Ошибка удаления:', error);
        alert('Ошибка при удалении товара');
      }
    }
  };

  // Фильтрация по категории
  const filteredProducts = selectedCategory === 'Все' 
    ? products 
    : products.filter(p => p.category === selectedCategory);

  // Рейтинг звездами
  const renderStars = (rating) => {
    const stars = [];
    for (let i = 1; i <= 5; i++) {
      stars.push(
        <span key={i} style={{ color: i <= rating ? '#ffc107' : '#e4e5e9' }}>
          ★
        </span>
      );
    }
    return stars;
  };

  if (loading) {
    return <div className="loading">Загрузка...</div>;
  }

  return (
    <div className="app">
      <header className="header">
        <h1>🛍️ Интернет-магазин</h1>
        <button className="btn-add" onClick={() => setShowModal(true)}>
          ➕ Добавить товар
        </button>
      </header>

      {/* Фильтр по категориям */}
      <div className="categories">
        {categories.map(cat => (
          <button
            key={cat}
            className={`category-btn ${selectedCategory === cat ? 'active' : ''}`}
            onClick={() => setSelectedCategory(cat)}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* Модальное окно для добавления/редактирования */}
      {showModal && (
        <div className="modal-overlay">
          <div className="modal">
            <h2>{editingProduct ? '✏️ Редактировать товар' : '➕ Новый товар'}</h2>
            <form onSubmit={handleSubmit}>
              <div className="form-group">
                <label>Название:</label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  required
                />
              </div>
              
              <div className="form-group">
                <label>Категория:</label>
                <input
                  type="text"
                  name="category"
                  value={formData.category}
                  onChange={handleInputChange}
                  required
                />
              </div>
              
              <div className="form-group">
                <label>Описание:</label>
                <textarea
                  name="description"
                  value={formData.description}
                  onChange={handleInputChange}
                  rows="3"
                  required
                />
              </div>
              
              <div className="form-row">
                <div className="form-group">
                  <label>Цена (₽):</label>
                  <input
                    type="number"
                    name="price"
                    value={formData.price}
                    onChange={handleInputChange}
                    required
                  />
                </div>
                
                <div className="form-group">
                  <label>Количество:</label>
                  <input
                    type="number"
                    name="stock"
                    value={formData.stock}
                    onChange={handleInputChange}
                    required
                  />
                </div>
                
                <div className="form-group">
                  <label>Рейтинг:</label>
                  <select name="rating" value={formData.rating} onChange={handleInputChange}>
                    <option value="5">5 ★</option>
                    <option value="4">4 ★</option>
                    <option value="3">3 ★</option>
                    <option value="2">2 ★</option>
                    <option value="1">1 ★</option>
                  </select>
                </div>
              </div>
              
              <div className="modal-actions">
                <button type="submit" className="btn-save">💾 Сохранить</button>
                <button type="button" className="btn-cancel" onClick={() => {
                  setShowModal(false);
                  setEditingProduct(null);
                  setFormData({ name: '', category: '', description: '', price: '', stock: '', rating: '5' });
                }}>❌ Отмена</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Сетка товаров */}
      <div className="products-grid">
        {filteredProducts.map(product => (
          <div key={product.id} className="product-card">
            <div className="product-header">
              <h3>{product.name}</h3>
              <span className="category-badge">{product.category}</span>
            </div>
            
            <p className="description">{product.description}</p>
            
            <div className="rating">
              {renderStars(product.rating)}
              <span className="rating-value">{product.rating}.0</span>
            </div>
            
            <div className="price-stock">
              <span className="price">{product.price.toLocaleString()} ₽</span>
              <span className={`stock ${product.stock < 5 ? 'low' : ''}`}>
                {product.stock} шт.
              </span>
            </div>
            
            <div className="actions">
              <button className="btn-edit" onClick={() => handleEdit(product)}>
                ✏️ Ред.
              </button>
              <button className="btn-delete" onClick={() => handleDelete(product.id)}>
                🗑️ Удал.
              </button>
            </div>
          </div>
        ))}
      </div>

      {filteredProducts.length === 0 && (
        <div className="empty">
          😕 Товары не найдены
        </div>
      )}
    </div>
  );
}

export default App;