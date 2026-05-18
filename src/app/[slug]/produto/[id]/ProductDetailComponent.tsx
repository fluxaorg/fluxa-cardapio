"use client";
import { useState, useEffect } from 'react';
import { useParams, useRouter, useSearchParams } from 'next/navigation';
import { ArrowLeft, Heart, Plus, Minus, Check } from 'lucide-react';
import { supabase } from '@/lib/supabase';
import { useCompany } from '@/context/CompanyContext';
import { useCart } from '@/context/CartContext';
import './ProductDetail.css';

const INGREDIENT_EMOJI: Record<string, string> = {
  tomate: '🍅', cebola: '🧅', pimenta: '🌶️', alface: '🥬',
  queijo: '🧀', ovo: '🥚', bacon: '🥓', frango: '🍗',
  presunto: '🍖', pepino: '🥒', milho: '🌽', palmito: '🌿',
  catupiry: '🫙', mussarela: '🧀', manjericão: '🌱', maionese: '🫙',
  mostarda: '🌿', calabresa: '🌭', linguiça: '🌭', azeitona: '🫒',
  ervilha: '🌱', brócolis: '🥦', champignon: '🍄', pão: '🍞',
};

const EXTRAS = [
  { id: 'queijo-extra',  name: 'Queijo extra',     price: 3.5 },
  { id: 'bacon-extra',   name: 'Bacon crocante',   price: 4.0 },
  { id: 'cebola-cara',   name: 'Cebola caramelizada', price: 2.5 },
  { id: 'molho-especial',name: 'Molho da casa',    price: 1.5 },
];

function parseIngredients(desc: string | null | undefined) {
  if (!desc) return [];
  const lower = desc.toLowerCase();
  return Object.entries(INGREDIENT_EMOJI)
    .filter(([name]) => lower.includes(name))
    .map(([name, emoji]) => ({ id: name, emoji, label: name.charAt(0).toUpperCase() + name.slice(1) }));
}

export default function ProductDetail() {
  const params = useParams();
  const id = params?.id as string;
  const router = useRouter();
  const searchParams = useSearchParams();
  const { company } = useCompany();
  const { addItem, items, total, setIsOpen } = useCart();

  const slug = company?.slug || '';
  const basePath = slug ? `/${slug}` : '';

  // Preço promocional vindo da URL (?promoPrice=X)
  const urlPromoPrice = searchParams.get('promoPrice') ? parseFloat(searchParams.get('promoPrice')!) : null;

  const [product, setProduct] = useState<any>(null);
  const [suggestions, setSuggestions] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [size, setSize] = useState('G');
  const [removedItems, setRemovedItems] = useState<string[]>([]);
  const [addedExtras, setAddedExtras] = useState<string[]>([]);
  const [qty, setQty] = useState(1);
  const [favorite, setFavorite] = useState(false);
  const [categories, setCategories] = useState<any[]>([]);

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

        // Busca categorias
        if (company?.id) {
          const { data: cats } = await supabase
            .from('food_categories')
            .select('id, name')
            .eq('company_id', company.id);
          if (cats) setCategories(cats);

          // Busca sugestões
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
    const basePrice = urlPromoPrice ??
      (product.promo_price && product.promo_price < product.price
        ? product.promo_price : product.price);
    const selectedExtras = EXTRAS.filter(e => addedExtras.includes(e.id));
    const finalUnit = basePrice + selectedExtras.reduce((acc, e) => acc + e.price, 0);
    addItem({
      productId: product.id,
      name: product.name,
      price: finalUnit,
      qty,
      image_url: product.image_url,
      description: product.description,
      options: {
        size,
        removed: removedItems,
        extras: selectedExtras.map(e => e.id),
      },
    } as any);
  };

  const toggleItem = (item: string) => {
    setRemovedItems((prev) =>
      prev.includes(item) ? prev.filter((i) => i !== item) : [...prev, item]
    );
  };

  const toggleExtra = (id: string) => {
    setAddedExtras((prev) =>
      prev.includes(id) ? prev.filter((i) => i !== id) : [...prev, id]
    );
  };

  const extrasTotal = EXTRAS
    .filter(e => addedExtras.includes(e.id))
    .reduce((acc, e) => acc + e.price, 0);

  if (loading) return <div className="page-loading">Carregando...</div>;
  if (!product) return <div className="page-loading">Produto não encontrado.</div>;

  // Prioridade: promoPrice da URL > promo_price do produto > preço normal
  const effectivePrice =
    urlPromoPrice ??
    (product.promo_price && product.promo_price < product.price
      ? product.promo_price
      : product.price);

  const ingredients = parseIngredients(product.description);

  const unitPrice = effectivePrice + extrasTotal;
  const finalPrice = unitPrice * qty;

  return (
    <div className="page-container detail-layout">
      <main className="main-section bg-white-block detail-left">
        {/* Header: ← Voltar    Detalhes    ♥ */}
        <header className="pd-header">
          <button
            type="button"
            className="pd-header-btn"
            aria-label="Voltar"
            onClick={() => router.back()}
          >
            <ArrowLeft size={22} />
          </button>
          <h1 className="pd-header-title">Detalhes do produto</h1>
          <button
            type="button"
            className={`pd-header-btn pd-fav ${favorite ? 'is-fav' : ''}`}
            aria-label={favorite ? 'Remover dos favoritos' : 'Adicionar aos favoritos'}
            aria-pressed={favorite}
            onClick={() => setFavorite(f => !f)}
          >
            <Heart size={20} strokeWidth={2.2} fill={favorite ? 'currentColor' : 'none'} />
          </button>
        </header>

        <div className="pd-content">
          {/* Foto quadrada centralizada */}
          <figure className="pd-photo-wrap">
            <img
              src={product.image_url || 'https://images.unsplash.com/photo-1513104890138-7c749659a591?w=600&q=80'}
              alt={product.name}
              className="pd-photo"
            />
          </figure>

          {/* Nome + preço + descrição */}
          <div className="pd-meta">
            <h2 className="pd-name">{product.name}</h2>
            <div className="pd-price-row">
              {product.promo_price && product.promo_price < product.price && (
                <span className="pd-price-old">R$ {product.price.toFixed(2)}</span>
              )}
              <span className="pd-price">R$ {effectivePrice.toFixed(2)}</span>
            </div>
            {product.description && (
              <p className="pd-desc">{product.description}</p>
            )}
          </div>

          {/* Tamanho */}
          <section className="pd-section">
            <h3 className="pd-section-title">Tamanho</h3>
            <div className="size-selector">
              {['P', 'M', 'G'].map((s) => (
                <button
                  type="button"
                  key={s}
                  className={`size-pill ${size === s ? 'active' : ''}`}
                  onClick={() => setSize(s)}
                  aria-pressed={size === s}
                >
                  {s}
                </button>
              ))}
            </div>
          </section>

          {/* Ingredientes a remover (apenas se houver) */}
          {ingredients.length > 0 && (
            <section className="pd-section remove-section">
              <h3 className="pd-section-title">Deseja remover algo?</h3>
              <div className="remove-grid">
                {ingredients.map((ing) => (
                  <button
                    type="button"
                    key={ing.id}
                    className={`remove-card ${removedItems.includes(ing.id) ? 'removed' : ''}`}
                    onClick={() => toggleItem(ing.id)}
                    title={ing.label}
                    aria-pressed={removedItems.includes(ing.id)}
                  >
                    <span className="remove-emoji">{ing.emoji}</span>
                    <span className="remove-name">{ing.label}</span>
                  </button>
                ))}
              </div>
            </section>
          )}

          {/* Ingredientes extras */}
          <section className="pd-section">
            <h3 className="pd-section-title">Adicionais</h3>
            <div className="extras-list">
              {EXTRAS.map((extra) => {
                const isSel = addedExtras.includes(extra.id);
                return (
                  <button
                    type="button"
                    key={extra.id}
                    className={`extra-row ${isSel ? 'is-selected' : ''}`}
                    onClick={() => toggleExtra(extra.id)}
                    aria-pressed={isSel}
                  >
                    <div className="extra-info">
                      <span className="extra-name">{extra.name}</span>
                      <span className="extra-price">+ R$ {extra.price.toFixed(2)}</span>
                    </div>
                    <span className={`extra-check ${isSel ? 'on' : ''}`}>
                      {isSel && <Check size={14} strokeWidth={3} />}
                    </span>
                  </button>
                );
              })}
            </div>
          </section>
        </div>

        {/* CTA fixo: qty + adicionar */}
        <div className="pd-bottom-bar">
          <div className="qty-controls">
            <button
              type="button"
              className="qty-btn"
              aria-label="Diminuir quantidade"
              onClick={() => setQty(Math.max(1, qty - 1))}
              disabled={qty <= 1}
            >
              <Minus size={18} />
            </button>
            <span className="qty-val">{qty}</span>
            <button
              type="button"
              className="qty-btn"
              aria-label="Aumentar quantidade"
              onClick={() => setQty(qty + 1)}
            >
              <Plus size={18} />
            </button>
          </div>
          <button type="button" className="btn-add" onClick={handleAdd}>
            <span className="btn-add-label">Adicionar</span>
            <span className="btn-add-price">R$ {finalPrice.toFixed(2)}</span>
          </button>
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
                  onClick={() => router.push(`${basePath}/produto/${s.id}`)}
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
                      router.push(`${basePath}/produto/${s.id}`);
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
          <h2 className="sidebar-title">Meu pedido<br/><span style={{fontSize: '12px', fontWeight: 400, color: '#888'}}>Forma de pagamento</span></h2>
          <span className="sidebar-count">{items.length} {items.length === 1 ? 'Item' : 'Itens'}</span>
        </div>

        <div className="sidebar-items">
          {items.map((item) => (
            <div key={item.id} className="sidebar-item-card">
              {item.image_url ? (
                <img src={item.image_url} alt={item.name} />
              ) : (
                <div className="sidebar-item-placeholder">🍴</div>
              )}
              <div className="sidebar-item-info">
                <span className="sidebar-item-name">{item.name}</span>
                <span className="sidebar-item-desc">{item.description?.substring(0, 40)}{item.description && item.description.length > 40 ? '…' : ''}</span>
              </div>
              <span className="sidebar-item-price">R$ {(item.price * item.qty).toFixed(2)}</span>
            </div>
          ))}
          {items.length === 0 && (
            <div className="empty-cart-card">
              Adicione itens ao carrinho!
            </div>
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
