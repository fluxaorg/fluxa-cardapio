import React, { useState } from 'react';
import { Filter, Plus, Minus } from 'lucide-react';
import './ProductDetail.css';

export default function ProductDetail() {
  const [size, setSize] = useState('Grande');
  const [removedItems, setRemovedItems] = useState<string[]>([]);
  const [qty, setQty] = useState(2);

  const toggleItem = (item: string) => {
    if (removedItems.includes(item)) {
      setRemovedItems(removedItems.filter(i => i !== item));
    } else {
      setRemovedItems([...removedItems, item]);
    }
  };

  return (
    <div className="page-container detail-layout">
      {/* Left Area */}
      <main className="main-section detail-left">
        <div className="detail-header">
          <h1 className="detail-header-title">Detalhes do produto...</h1>
          <button className="menu-filter-btn">
            <Filter size={22} color="var(--color-red)" />
          </button>
        </div>
        
        <div className="menu-categories">
          <button className="category-pill active">Pizzas</button>
          <button className="category-pill">Lanches</button>
          <button className="category-pill">Bebidas</button>
          <button className="category-pill">Sobremesas</button>
        </div>

        <div className="product-area">
          <img 
            src="https://images.unsplash.com/photo-1513104890138-7c749659a591?w=600&q=80" 
            alt="Pizza Margeritta" 
            className="detail-img"
          />
          
          <div className="detail-info">
            <h2 className="detail-title">Margeritta</h2>
            <p className="detail-desc">Feito com muito amor, para os amantes de pizza de todo o mundo.</p>
            
            <div className="size-selector">
              {['Grande', 'Média', 'Pequena'].map(s => (
                <button 
                  key={s} 
                  className={`size-pill ${size === s ? 'active' : ''}`}
                  onClick={() => setSize(s)}
                >
                  {s}
                </button>
              ))}
            </div>

            <div className="remove-section">
              <span className="remove-label">Deseja remover algo?</span>
              <div className="remove-grid">
                {[
                  { id: 'tomate', emoji: '🍅' },
                  { id: 'pimenta', emoji: '🌶️' },
                  { id: 'pimentao', emoji: '🫑' }
                ].map(ing => (
                  <button 
                    key={ing.id}
                    className={`remove-card ${removedItems.includes(ing.id) ? 'removed' : ''}`}
                    onClick={() => toggleItem(ing.id)}
                  >
                    <span className="remove-emoji">{ing.emoji}</span>
                  </button>
                ))}
              </div>
            </div>

            <div className="qty-action-row">
              <button className="qty-btn" onClick={() => setQty(Math.max(1, qty - 1))}><Minus size={20} /></button>
              <span className="qty-val">{qty}</span>
              <button className="qty-btn" onClick={() => setQty(qty + 1)}><Plus size={20} /></button>
              <div className="price-pill">189$</div>
              <button className="btn-add">Adicionar</button>
            </div>
          </div>
        </div>

        <div className="related-section">
          <span className="related-label">Procurando algo diferente?</span>
          <div className="related-carousel">
            {[1, 2, 3, 4].map(i => (
              <div key={i} className="related-card">
                <img src="https://images.unsplash.com/photo-1574071318508-1cdbab80d002?w=100&q=80" alt="Pizza" />
                <div className="related-info">
                  <span className="related-name">Pizza Especial</span>
                  <span className="related-price">a partir de 99$</span>
                </div>
                <button className="related-add"><Plus size={16} strokeWidth={3} /></button>
              </div>
            ))}
          </div>
        </div>
      </main>

      {/* Right Area Sidebar */}
      <aside className="main-section detail-sidebar">
        <div className="sidebar-header">
          <h2 className="sidebar-title">Meu pedido</h2>
          <span className="sidebar-count">2 Itens</span>
        </div>

        <div className="sidebar-items">
          {[1, 2].map(i => (
            <div key={i} className="sidebar-item">
              <img src="https://images.unsplash.com/photo-1513104890138-7c749659a591?w=100&q=80" alt="Pizza" />
              <div className="sidebar-item-info">
                <span className="sidebar-item-name">Pizza - Margeritta</span>
                <span className="sidebar-item-desc">Feito com muito amor, para os amantes de</span>
              </div>
              <span className="sidebar-item-price">99$</span>
            </div>
          ))}
        </div>

        <div className="sidebar-divider"></div>

        <div className="sidebar-coupon">
          <span className="coupon-label">CUPOM</span>
          <span className="coupon-val">PROMO20</span>
        </div>

        <div className="sidebar-summary">
          <div className="summary-row">
            <span>Desconto</span>
            <span>-5%</span>
          </div>
          <div className="summary-row">
            <span>Taxa de entrega</span>
            <span>10$</span>
          </div>
          <div className="summary-row total-row">
            <span>Total</span>
            <span>192$</span>
          </div>
        </div>

        <button className="sidebar-btn-confirm">Confirmar pedido</button>
      </aside>
    </div>
  );
}
