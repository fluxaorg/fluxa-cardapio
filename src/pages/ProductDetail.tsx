import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Filter, Plus, Minus, ArrowLeft } from 'lucide-react';
import { supabase } from '../lib/supabase';
import { useCompany } from '../context/CompanyContext';
import { useCart } from '../context/CartContext';
import './ProductDetail.css';

export default function ProductDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { company } = useCompany();
  const { addItem, items, total, setIsOpen } = useCart();
  
  const [product, setProduct] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [size, setSize] = useState('G');
  const [removedItems, setRemovedItems] = useState<string[]>([]);
  const [qty, setQty] = useState(1);

  useEffect(() => {
    async function fetchProduct() {
      const { data } = await supabase
        .from('food_menu_items')
        .select('*')
        .eq('id', id)
        .single();
      
      if (data) {
        setProduct(data);
      }
      setLoading(false);
    }
    fetchProduct();
  }, [id]);

  const handleAdd = () => {
    if (!product) return;
    addItem({
      productId: product.id,
      name: product.name,
      price: product.price,
      qty: qty,
      image_url: product.image_url,
      description: product.description,
      options: { size, removed: removedItems }
    } as any);
  };

  const toggleItem = (item: string) => {
    if (removedItems.includes(item)) {
      setRemovedItems(removedItems.filter(i => i !== item));
    } else {
      setRemovedItems([...removedItems, item]);
    }
  };

  if (loading) return <div className="page-loading">Carregando...</div>;
  if (!product) return <div className="page-loading">Produto não encontrado.</div>;

  return (
    <div className="page-container detail-layout">
      {/* Left Area */}
      <main className="main-section bg-white-block detail-left">
        <div className="detail-header">
          <button className="back-btn-round" onClick={() => navigate(-1)}>
            <ArrowLeft size={20} />
          </button>
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
            src={product.image_url || "https://images.unsplash.com/photo-1513104890138-7c749659a591?w=600&q=80"} 
            alt={product.name} 
            className="detail-img"
          />
          
          <div className="detail-info">
            <h2 className="detail-title">{product.name}</h2>
            <p className="detail-desc">{product.description}</p>
            
            <div className="size-selector">
              {['P', 'M', 'G'].map(s => (
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
                  { id: 'cebola', emoji: '🧅' },
                  { id: 'pimenta', emoji: '🌶️' }
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
              <div className="qty-controls">
                <button className="qty-btn" onClick={() => setQty(Math.max(1, qty - 1))}><Minus size={20} /></button>
                <span className="qty-val">{qty}</span>
                <button className="qty-btn" onClick={() => setQty(qty + 1)}><Plus size={20} /></button>
              </div>
              <div className="price-pill">R$ {(product.price * qty).toFixed(2)}</div>
              <button className="btn-add" onClick={handleAdd}>Adicionar</button>
            </div>
          </div>
        </div>
      </main>

      {/* Right Area Sidebar */}
      <aside className="main-section detail-sidebar">
        <div className="sidebar-header">
          <h2 className="sidebar-title">Meu pedido</h2>
          <span className="sidebar-count">{items.length} Itens</span>
        </div>

        <div className="sidebar-items">
          {items.map(item => (
            <div key={item.id} className="sidebar-item">
              <img src={item.image_url} alt={item.name} />
              <div className="sidebar-item-info">
                <span className="sidebar-item-name">{item.name}</span>
                <span className="sidebar-item-desc">{item.description?.substring(0, 40)}...</span>
              </div>
              <span className="sidebar-item-price">R$ {item.price.toFixed(0)}</span>
            </div>
          ))}
          {items.length === 0 && <p className="empty-side-hint">Seu carrinho está vazio.</p>}
        </div>

        <div className="sidebar-divider"></div>

        <div className="sidebar-summary">
          <div className="summary-row total-row">
            <span>Total</span>
            <span>R$ {total.toFixed(2)}</span>
          </div>
        </div>

        <button className="sidebar-btn-confirm" onClick={() => setIsOpen(true)}>Ver Carrinho Completo</button>
      </aside>
    </div>
  );
}
