import React from 'react';
import { Filter, Plus } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import './Menu.css';

export default function Menu() {
  const navigate = useNavigate();
  const categories = ['Pizzas', 'Lanches', 'Bebidas', 'Sobremesas'];
  const activeCategory = 'Pizzas';

  const products = Array(8).fill(null).map((_, i) => ({
    id: i,
    name: 'Pizza - Margeritta',
    description: 'Feito com muito amor, para os amantes de',
    price: 'a partir de 99$',
    image: 'https://images.unsplash.com/photo-1513104890138-7c749659a591?w=200&q=80'
  }));

  return (
    <div className="page-container">
      <main className="main-section menu-section">
        <div className="menu-header">
          <h1 className="menu-title">Categorias</h1>
          <button className="menu-filter-btn">
            <Filter size={22} color="var(--color-red)" />
          </button>
        </div>

        <div className="menu-categories">
          {categories.map((cat) => (
            <button
              key={cat}
              className={`category-pill ${cat === activeCategory ? 'active' : ''}`}
            >
              {cat}
            </button>
          ))}
        </div>

        <div className="menu-grid">
          {products.map((p) => (
            <div 
              key={p.id} 
              className="product-card" 
              onClick={() => navigate(`/produto/${p.id}`)}
            >
              <img src={p.image} alt={p.name} className="product-card-img" />
              <div className="product-card-info">
                <h3 className="product-card-name">{p.name}</h3>
                <p className="product-card-desc">{p.description}</p>
                <span className="product-card-price">{p.price}</span>
              </div>
              <button 
                className="product-card-add"
                onClick={(e) => {
                  e.stopPropagation();
                  // action
                }}
              >
                <Plus size={18} strokeWidth={3} />
              </button>
            </div>
          ))}
        </div>
      </main>
    </div>
  );
}
