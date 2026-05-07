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

  const slug = company?.slug || '';
  const basePath = slug ? `/${slug}` : '';

  const [product, setProduct] = useState<any>(null);
  const [suggestions, setSuggestions] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [size, setSize] = useState('G');
  const [removedItems, setRemovedItems] = useState<string[]>([]);
  const [qty, setQty] = useState(1);

  useEffect(() => {
    if (!id) return;
    setLoading(true);
    setRemovedItems([]);
    setSize('G');
    setQty(1);

    async function fetchProduct() {
      const { data } = await supabase
        .from('food_menu_items')
        .select('*')
        .eq('id', id)
        .single();

      if (data) {
        setProduct(data);

        // Busca sugestões da mesma categoria
        if (company?.id) {
          const { data: suggs } = await supabase
            .from('food_menu_items')
            .select('id, name, price, image_url, category')
            .eq('company_id', company.id)
            .eq('category', data.category)
            .neq('id', id)
            .limit(6);
          setSuggestions(suggs || []);
        }
      }
      setLoading(false);
    }
    fetchProduct();
  }, [id, company?.id]);

  const handleAdd = () => {
    if (!product) return;
    const effectivePrice =
      product.promo_price && product.promo_price < product.price
        ? product.promo_price
        : product.price;
    addItem({
      productId: product.id,
      name: product.name,
      price: effectivePrice,
      qty,
      image_url: product.image_url,
      description: product.description,
      options: { size, removed: removedItems },
    } as any);
  };

  const toggleItem = (item: string) => {
    setRemovedItems((prev) =>
      prev.includes(item) ? prev.filter((i) => i !== item) : [...prev, item]
    );
  };

  if (loading) return <div className="page-loading">Carregando...</div>;
  if (!product) return <div className="page-loading">Produto não encontrado.</div>;

  const effectivePrice =
    product.promo_price && product.promo_price < product.price
      ? product.promo_price
      : product.price;

  return (
    <div className="page-container detail-layout">
      {/* Left Area */}
      <main className="main-section bg-white-block detail-left">
        <div className="detail-header">
          <button className="back-btn-round" onClick={() => navigate(-1)}>
            <ArrowLeft size={20} />
          </button>
          <h1 className="detail-header-title">Detalhes do produto</h1>
          <button className="menu-filter-btn">
            <Filter size={22} color="var(--color-red)" />
          </button>
        </div>

        <div className="product-area">
          <img
            src={product.image_url || 'https://images.unsplash.com/photo-1513104890138-7c749659a591?w=600&q=80'}
            alt={product.name}
            className="detail-img"
          />

          <div className="detail-info">
            <h2 className="detail-title">{product.name}</h2>
            <p className="detail-desc">{product.description}</p>

            <div className="size-selector">
              {['P', 'M', 'G'].map((s) => (
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
                  { id: 'pimenta', emoji: '🌶️' },
                ].map((ing) => (
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
                <button className="qty-btn" onClick={() => setQty(Math.max(1, qty - 1))}>
                  <Minus size={20} />
                </button>
                <span className="qty-val">{qty}</span>
                <button className="qty-btn" onClick={() => setQty(qty + 1)}>
                  <Plus size={20} />
                </button>
              </div>
              <div className="price-pill">
                {product.promo_price && product.promo_price < product.price && (
                  <span style={{ textDecoration: 'line-through', color: '#aaa', fontSize: '12px', marginRight: '6px' }}>
                    R$ {(product.price * qty).toFixed(2)}
                  </span>
                )}
                R$ {(effectivePrice * qty).toFixed(2)}
              </div>
              <button className="btn-add" onClick={handleAdd}>Adicionar</button>
            </div>
          </div>
        </div>

        {/* Sugestões */}
        {suggestions.length > 0 && (
          <div className="related-section">
            <span className="related-label">Procurando algo diferente?</span>
            <div className="related-carousel">
              {suggestions.map((s) => (
                <div
                  key={s.id}
                  className="related-card"
                  onClick={() => navigate(`${basePath}/produto/${s.id}`)}
                  style={{ cursor: 'pointer' }}
                >
                  <img
                    src={s.image_url || ''} onError={(e) => { (e.target as HTMLImageElement).style.display = 'none'; }}
                    alt={s.name}
                  />
                  <div className="related-info">
                    <span className="related-name">{s.name}</span>
                    <span className="related-price">R$ {s.price?.toFixed(2)}</span>
                  </div>
                  <button
                    className="related-add"
                    onClick={(e) => {
                      e.stopPropagation();
                      navigate(`${basePath}/produto/${s.id}`);
                    }}
                  >
                    <Plus size={12} />
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}
      </main>

      {/* Right Sidebar - Meu Pedido */}
      <aside className="main-section detail-sidebar">
        <div className="sidebar-header">
          <h2 className="sidebar-title">Meu pedido</h2>
          <span className="sidebar-count">{items.length} {items.length === 1 ? 'Item' : 'Itens'}</span>
        </div>

        <div className="sidebar-items">
          {items.map((item) => (
            <div key={item.id} className="sidebar-item">
              {item.image_url ? (
                <img src={item.image_url} alt={item.name} />
              ) : (
                <div style={{ width: 70, height: 70, borderRadius: 12, background: '#f5f5f5', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 24, flexShrink: 0 }}>🍴</div>
              )}
              <div className="sidebar-item-info">
                <span className="sidebar-item-name">{item.name}</span>
                <span className="sidebar-item-desc">{item.description?.substring(0, 40)}{item.description && item.description.length > 40 ? '…' : ''}</span>
              </div>
              <span className="sidebar-item-price">R$ {(item.price * item.qty).toFixed(0)}</span>
            </div>
          ))}
          {items.length === 0 && (
            <p className="empty-side-hint">Seu carrinho está vazio.</p>
          )}
        </div>

        <div className="sidebar-divider"></div>

        <div className="sidebar-summary">
          <div className="summary-row total-row">
            <span>Total</span>
            <span>R$ {total.toFixed(2)}</span>
          </div>
        </div>

        <button className="sidebar-btn-confirm" onClick={() => setIsOpen(true)}>
          Abrir Carrinho
        </button>
      </aside>
    </div>
  );
}
