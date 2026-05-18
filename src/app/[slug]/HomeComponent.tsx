"use client";
import { useState, useEffect, useMemo } from 'react';
import { useRouter } from 'next/navigation';
import { Search, SlidersHorizontal, ShoppingBag, MapPin, Star } from 'lucide-react';
import { useCompany } from '@/context/CompanyContext';
import { useCart } from '@/context/CartContext';
import { supabase } from '@/lib/supabase';
import './Home.css';

interface Category {
  id: string;
  name: string;
  emoji?: string | null;
}

interface MenuItem {
  id: string;
  name: string;
  description: string | null;
  price: number;
  image_url: string | null;
  category: string;
  promo_price?: number | null;
  rating?: number | null;
}

const CATEGORY_EMOJIS: Record<string, string> = {
  todos: '🍽️',
  pizzas: '🍕',
  pizza: '🍕',
  massas: '🍝',
  massa: '🍝',
  hamburgers: '🍔',
  lanches: '🍔',
  sanduiches: '🥪',
  saladas: '🥗',
  entradas: '🥗',
  bebidas: '🥤',
  bebida: '🥤',
  sobremesas: '🍮',
  sobremesa: '🍮',
  promocoes: '🎁',
};

function emojiFor(name: string): string {
  const key = name.toLowerCase().normalize('NFD').replace(/[̀-ͯ]/g, '');
  return CATEGORY_EMOJIS[key] || '🍴';
}

export default function Home() {
  const router = useRouter();
  const { company } = useCompany();
  const { items, setIsOpen } = useCart();

  const slug = company?.slug || '';
  const basePath = slug ? `/${slug}` : '';

  const [categories, setCategories] = useState<Category[]>([]);
  const [products, setProducts] = useState<MenuItem[]>([]);
  const [activeCategory, setActiveCategory] = useState<string>('todos');
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    if (!company?.id) return;
    (async () => {
      const { data: cats } = await supabase
        .from('food_categories')
        .select('id, name')
        .eq('company_id', company.id);
      if (cats) setCategories(cats);

      const { data: prods } = await supabase
        .from('food_menu_items')
        .select('id, name, description, price, image_url, category, promo_price')
        .eq('company_id', company.id);
      if (prods) setProducts(prods as MenuItem[]);
    })();
  }, [company?.id]);

  const filteredProducts = useMemo(() => {
    const q = searchQuery.trim().toLowerCase();
    return products.filter((p) => {
      const matchesSearch = q
        ? p.name.toLowerCase().includes(q) || (p.description || '').toLowerCase().includes(q)
        : true;
      const matchesCategory =
        activeCategory === 'todos'
          ? true
          : p.category === categories.find((c) => c.id === activeCategory)?.name;
      return matchesSearch && matchesCategory;
    });
  }, [products, searchQuery, activeCategory, categories]);

  const popularItem = useMemo(() => {
    return products.find(p => p.promo_price && p.promo_price < p.price) || products[0];
  }, [products]);

  const goToProduct = (id: string) => router.push(`${basePath}/produto/${id}`);

  return (
    <div className="page-container home-page">
      <main className="home-main">
        {/* HEADER */}
        <header className="home-header">
          <div className="home-header-top">
            <div className="home-header-left">
              <span className="home-greet-eyebrow">Bem-vindo a</span>
              <h1 className="home-restaurant-name">
                {company?.name || "Fluxa Food's"}
              </h1>
              <span className="home-location">
                <MapPin size={12} strokeWidth={2.5} />
                <span>Entrega 30–45 min</span>
              </span>
            </div>
            <button
              type="button"
              className="home-cart-btn"
              aria-label={`Carrinho — ${items.length} ${items.length === 1 ? 'item' : 'itens'}`}
              onClick={() => setIsOpen(true)}
            >
              <ShoppingBag size={22} strokeWidth={2} />
              {items.length > 0 && (
                <span className="home-cart-badge" aria-hidden="true">
                  {items.length > 9 ? '9+' : items.length}
                </span>
              )}
            </button>
          </div>

          {/* Search + filtros */}
          <div className="home-search-row">
            <div className="home-search-wrap">
              <Search size={18} strokeWidth={2.2} className="home-search-icon" />
              <input
                type="text"
                className="home-search-input"
                placeholder="O que vai pedir hoje?"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                aria-label="Buscar no cardápio"
              />
            </div>
            <button
              type="button"
              className="home-filter-btn"
              aria-label="Filtros"
            >
              <SlidersHorizontal size={18} strokeWidth={2.2} />
            </button>
          </div>

          {/* Pills de categoria */}
          <div className="home-categories" role="tablist" aria-label="Categorias">
            <button
              type="button"
              role="tab"
              aria-selected={activeCategory === 'todos'}
              className={`home-cat-pill ${activeCategory === 'todos' ? 'active' : ''}`}
              onClick={() => setActiveCategory('todos')}
            >
              <span className="home-cat-emoji" aria-hidden="true">🍽️</span>
              <span className="home-cat-label">Todos</span>
            </button>
            {categories.map((cat) => (
              <button
                type="button"
                role="tab"
                aria-selected={activeCategory === cat.id}
                key={cat.id}
                className={`home-cat-pill ${activeCategory === cat.id ? 'active' : ''}`}
                onClick={() => setActiveCategory(cat.id)}
              >
                <span className="home-cat-emoji" aria-hidden="true">{emojiFor(cat.name)}</span>
                <span className="home-cat-label">{cat.name}</span>
              </button>
            ))}
          </div>
        </header>

        {/* CONTENT */}
        <div className="home-content">
          {/* Itens populares — card destaque */}
          {popularItem && (
            <section className="home-section">
              <header className="home-section-header">
                <h2 className="home-section-title">Itens populares</h2>
              </header>
              <button
                type="button"
                className="popular-card"
                onClick={() => goToProduct(popularItem.id)}
                aria-label={`Ver ${popularItem.name}`}
              >
                <img
                  src={popularItem.image_url || 'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=600&q=80'}
                  alt={popularItem.name}
                  className="popular-card-img"
                />
                <div className="popular-card-meta">
                  <div className="popular-card-info">
                    <h3 className="popular-card-name">{popularItem.name}</h3>
                    <div className="popular-card-rating" aria-label="Avaliação 5.0 estrelas">
                      <Star size={12} fill="currentColor" strokeWidth={0} />
                      <span>5.0</span>
                    </div>
                  </div>
                  <div className="popular-card-bottom">
                    <span className="popular-card-price">
                      R$ {(popularItem.promo_price ?? popularItem.price).toFixed(2)}
                    </span>
                    <span className="popular-card-cta">Adicionar</span>
                  </div>
                </div>
              </button>
            </section>
          )}

          {/* Itens deliciosos — lista scrollável */}
          <section className="home-section">
            <header className="home-section-header">
              <h2 className="home-section-title">Itens deliciosos</h2>
              <button
                type="button"
                className="home-section-link"
                onClick={() => router.push(`${basePath}/menu`)}
              >
                Ver todos
              </button>
            </header>

            <div className="delicious-list">
              {filteredProducts.length === 0 ? (
                <p className="delicious-empty">
                  {searchQuery
                    ? `Nada encontrado para "${searchQuery}".`
                    : 'Nada nesta categoria ainda.'}
                </p>
              ) : (
                filteredProducts.map((p) => (
                  <button
                    type="button"
                    key={p.id}
                    className="delicious-row"
                    onClick={() => goToProduct(p.id)}
                  >
                    <img
                      src={p.image_url || 'https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?w=200&q=80'}
                      alt={p.name}
                      className="delicious-img"
                    />
                    <div className="delicious-info">
                      <h3 className="delicious-name">{p.name}</h3>
                      {p.description && (
                        <p className="delicious-desc">{p.description}</p>
                      )}
                      <span className="delicious-price">
                        R$ {(p.promo_price ?? p.price).toFixed(2)}
                      </span>
                    </div>
                  </button>
                ))
              )}
            </div>
          </section>
        </div>
      </main>
    </div>
  );
}
