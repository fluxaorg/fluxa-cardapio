import { X, Plus, Minus, Trash2 } from 'lucide-react';
import { useCart } from '../context/CartContext';
import './CartSidebar.css';

export default function CartSidebar() {
  const { items, isOpen, setIsOpen, updateQty, removeItem, total } = useCart();

  if (!isOpen) return null;

  return (
    <div className="cart-overlay" onClick={() => setIsOpen(false)}>
      <aside className="cart-sidebar" onClick={(e) => e.stopPropagation()}>
        <div className="cart-header">
          <h2 className="cart-title">Meu Pedido</h2>
          <button className="close-btn" onClick={() => setIsOpen(false)}>
            <X size={24} />
          </button>
        </div>

        <div className="cart-items">
          {items.length === 0 ? (
            <div className="empty-cart">
              <ShoppingBag size={48} color="#ccc" />
              <p>Seu carrinho está vazio.</p>
            </div>
          ) : (
            items.map((item) => (
              <div key={item.id} className="cart-item">
                <img src={item.image_url} alt={item.name} className="cart-item-img" />
                <div className="cart-item-details">
                  <span className="cart-item-name">{item.name}</span>
                  <span className="cart-item-price">R$ {item.price.toFixed(2)}</span>
                  <div className="cart-item-actions">
                    <button onClick={() => updateQty(item.id, item.qty - 1)}><Minus size={14} /></button>
                    <span>{item.qty}</span>
                    <button onClick={() => updateQty(item.id, item.qty + 1)}><Plus size={14} /></button>
                    <button className="remove-item" onClick={() => removeItem(item.id)}>
                      <Trash2 size={14} />
                    </button>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>

        {items.length > 0 && (
          <div className="cart-footer">
            <div className="cart-total">
              <span>Total</span>
              <span>R$ {total.toFixed(2)}</span>
            </div>
            <button className="confirm-btn">Confirmar Pedido</button>
          </div>
        )}
      </aside>
    </div>
  );
}

import { ShoppingBag } from 'lucide-react';
