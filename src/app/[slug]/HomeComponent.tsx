"use client";
import { useState, useEffect, useMemo } from 'react';
import { useRouter } from 'next/navigation';
import { Search, SlidersHorizontal, ShoppingBag, X } from 'lucide-react';
import { useCompany } from '@/context/CompanyContext';
import { useCart } from '@/context/CartContext';
import { supabase } from '@/lib/supabase';
import './Home.css';

interface Category {
  id: string;
  name: string;
}

interface MenuItem {
  id: string;
  name: string;
  description: string | null;
  price: number;
  image_url: string | null;
  category: string;
  promo_price?: number | null;
}

type SortOption = 'relevance' | 'price-asc' | 'price-desc' | 'name-asc';

const SORT_LABELS: Record<SortOption, string> = {
  'relevance':  'Mais relevantes',
  'price-asc':  'Menor preço',
  'price-desc': 'Maior preço',
  'name-asc':   'Nome (A–Z)',
};

const COMMON_INGREDIENTS = [
  'milho', 'cebola', 'tomate', 'queijo', 'bacon', 'calabresa',
  'frango', 'pepino', 'maionese', 'azeitona', 'ovo', 'pimenta',
  'catupiry', 'mussarela', 'presunto', 'palmito',
];

function effectivePrice(p: MenuItem): number {
  return p.promo_price && p.promo_price < p.price ? p.promo_price : p.price;
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

  // Filtros
  const [filterOpen, setFilterOpen] = useState(false);
  const [excludedIngredients, setExcludedIngredients] = useState<string[]>([]);
  const [maxPrice, setMaxPrice] = useState<number | null>(null);
  const [sortBy, setSortBy] = useState<SortOption>('relevance');

  // Drafts (somente aplicados ao confirmar)
  const [draftExcluded, setDraftExcluded] = useState<string[]>([]);
  const [draftMaxPrice, setDraftMaxPrice] = useState<number | null>(null);
  const [draftSortBy, setDraftSortBy] = useState<SortOption>('relevance');

  // Faixa de preço derivada dos produtos
  const priceCeiling = useMemo(() => {
    if (products.length === 0) return 100;
    const max = Math.max(...products.map(p => effectivePrice(p)));
    return Math.ceil(max / 5) * 5;
  }, [products]);

  const openFilter = () => {
    setDraftExcluded(excludedIngredients);
    setDraftMaxPrice(maxPrice);
    setDraftSortBy(sortBy);
    setFilterOpen(true);
  };

  const applyFilter = () => {
    setExcludedIngredients(draftExcluded);
    setMaxPrice(draftMaxPrice);
    setSortBy(draftSortBy);
    setFilterOpen(false);
  };

  const resetFilter = () => {
    setDraftExcluded([]);
    setDraftMaxPrice(null);
    setDraftSortBy('relevance');
  };

  const toggleDraftIngredient = (ing: string) => {
    setDraftExcluded(prev =>
      prev.includes(ing) ? prev.filter(i => i !== ing) : [...prev, ing]
    );
  };

  const activeFilterCount =
    excludedIngredients.length + (maxPrice !== null ? 1 : 0) + (sortBy !== 'relevance' ? 1 : 0);

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
    const filtered = products.filter((p) => {
      // Texto
      const haystack = `${p.name} ${p.description || ''}`.toLowerCase();
      const matchesSearch = q ? haystack.includes(q) : true;

      // Categoria
      const matchesCategory =
        activeCategory === 'todos'
          ? true
          : p.category === categories.find((c) => c.id === activeCategory)?.name;

      // Ingredientes excluídos
      const matchesIngredients = excludedIngredients.every(ing =>
        !haystack.includes(ing.toLowerCase())
      );

      // Preço máximo
      const matchesPrice = maxPrice === null ? true : effectivePrice(p) <= maxPrice;

      return matchesSearch && matchesCategory && matchesIngredients && matchesPrice;
    });

    // Ordenação
    switch (sortBy) {
      case 'price-asc':
        return [...filtered].sort((a, b) => effectivePrice(a) - effectivePrice(b));
      case 'price-desc':
        return [...filtered].sort((a, b) => effectivePrice(b) - effectivePrice(a));
      case 'name-asc':
        return [...filtered].sort((a, b) => a.name.localeCompare(b.name, 'pt-BR'));
      default:
        return filtered;
    }
  }, [products, searchQuery, activeCategory, categories, excludedIngredients, maxPrice, sortBy]);

  const popularItems = useMemo(() => {
    const promo = products.filter(p => p.promo_price && p.promo_price < p.price);
    if (promo.length >= 3) return promo.slice(0, 8);
    return products.slice(0, 8);
  }, [products]);

  const goToProduct = (id: string) => router.push(`${basePath}/produto/${id}`);

  return (
    <div className="page-container home-page">
      <main className="home-main">
        {/* HEADER — título página padrão + carrinho */}
        <header className="home-header">
          <div className="home-header-top">
            <div className="home-header-left">
              <span className="home-greet-eyebrow">Bem-vindo a</span>
              <h1 className="home-page-title">
                {company?.name || "Fluxa Food's"}
              </h1>
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
              <Search size={18} strokeWidth={2} className="home-search-icon" />
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
              className={`home-filter-btn ${activeFilterCount > 0 ? 'has-active' : ''}`}
              aria-label={`Filtros${activeFilterCount > 0 ? ` (${activeFilterCount} ativo${activeFilterCount > 1 ? 's' : ''})` : ''}`}
              onClick={openFilter}
            >
              <SlidersHorizontal size={18} strokeWidth={2} />
              {activeFilterCount > 0 && (
                <span className="home-filter-dot" aria-hidden="true">{activeFilterCount}</span>
              )}
            </button>
          </div>

          {/* Pills de categoria — Apple minimalista, sem emojis */}
          <div className="home-categories" role="tablist" aria-label="Categorias">
            <button
              type="button"
              role="tab"
              aria-selected={activeCategory === 'todos'}
              className={`home-cat-pill ${activeCategory === 'todos' ? 'active' : ''}`}
              onClick={() => setActiveCategory('todos')}
            >
              Todos
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
                {cat.name}
              </button>
            ))}
          </div>
        </header>

        {/* CONTENT */}
        <div className="home-content">
          {/* Itens populares — carrossel arrastável de cards */}
          {popularItems.length > 0 && (
            <section className="home-section">
              <header className="home-section-header">
                <h2 className="home-section-title">Itens populares</h2>
              </header>
              <div
                className="popular-carousel"
                role="list"
                aria-label="Itens populares — arraste pra ver mais"
              >
                {popularItems.map((p) => (
                  <button
                    type="button"
                    role="listitem"
                    key={p.id}
                    className="popular-card"
                    onClick={() => goToProduct(p.id)}
                    aria-label={`Ver ${p.name}`}
                  >
                    <img
                      src={p.image_url || 'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=600&q=80'}
                      alt={p.name}
                      className="popular-card-img"
                      draggable={false}
                    />
                    <div className="popular-card-overlay">
                      <h3 className="popular-card-name">{p.name}</h3>
                      <span className="popular-card-price">
                        R$ {(p.promo_price ?? p.price).toFixed(2)}
                      </span>
                      <span className="popular-card-cta">Adicionar</span>
                    </div>
                  </button>
                ))}
              </div>
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

      {/* ── Filter sheet ── */}
      {filterOpen && (
        <div
          className="filter-overlay"
          role="dialog"
          aria-modal="true"
          aria-label="Filtros"
          onClick={() => setFilterOpen(false)}
        >
          <div className="filter-sheet" onClick={(e) => e.stopPropagation()}>
            <div className="filter-sheet-handle" aria-hidden="true" />

            <header className="filter-sheet-header">
              <h2 className="filter-sheet-title">Filtros</h2>
              <button
                type="button"
                className="filter-close-btn"
                aria-label="Fechar filtros"
                onClick={() => setFilterOpen(false)}
              >
                <X size={20} />
              </button>
            </header>

            <div className="filter-sheet-content">
              {/* Excluir ingredientes */}
              <section className="filter-section">
                <h3 className="filter-section-title">Sem estes ingredientes</h3>
                <p className="filter-section-hint">
                  Quaisquer produtos com esses ingredientes serão ocultados.
                </p>
                <div className="filter-chip-grid">
                  {COMMON_INGREDIENTS.map((ing) => {
                    const isOn = draftExcluded.includes(ing);
                    return (
                      <button
                        type="button"
                        key={ing}
                        className={`filter-chip ${isOn ? 'is-on' : ''}`}
                        aria-pressed={isOn}
                        onClick={() => toggleDraftIngredient(ing)}
                      >
                        {isOn && <span className="filter-chip-mark" aria-hidden="true">×</span>}
                        <span className="filter-chip-label">{ing}</span>
                      </button>
                    );
                  })}
                </div>
              </section>

              {/* Preço máximo */}
              <section className="filter-section">
                <h3 className="filter-section-title">Preço máximo</h3>
                <div className="filter-price-row">
                  <input
                    type="range"
                    min={5}
                    max={priceCeiling}
                    step={5}
                    value={draftMaxPrice ?? priceCeiling}
                    onChange={(e) => setDraftMaxPrice(Number(e.target.value))}
                    className="filter-range"
                    aria-label="Preço máximo"
                  />
                  <span className="filter-price-value">
                    {draftMaxPrice === null
                      ? `Até R$ ${priceCeiling.toFixed(0)}`
                      : `Até R$ ${draftMaxPrice.toFixed(0)}`}
                  </span>
                </div>
                {draftMaxPrice !== null && (
                  <button
                    type="button"
                    className="filter-clear-link"
                    onClick={() => setDraftMaxPrice(null)}
                  >
                    Remover limite
                  </button>
                )}
              </section>

              {/* Ordenar */}
              <section className="filter-section">
                <h3 className="filter-section-title">Ordenar por</h3>
                <div className="filter-sort-list">
                  {(Object.keys(SORT_LABELS) as SortOption[]).map((opt) => (
                    <button
                      type="button"
                      key={opt}
                      className={`filter-sort-row ${draftSortBy === opt ? 'is-on' : ''}`}
                      aria-pressed={draftSortBy === opt}
                      onClick={() => setDraftSortBy(opt)}
                    >
                      <span>{SORT_LABELS[opt]}</span>
                      <span className={`filter-sort-radio ${draftSortBy === opt ? 'on' : ''}`} aria-hidden="true" />
                    </button>
                  ))}
                </div>
              </section>
            </div>

            <footer className="filter-sheet-footer">
              <button
                type="button"
                className="filter-reset-btn"
                onClick={resetFilter}
              >
                Limpar tudo
              </button>
              <button
                type="button"
                className="filter-apply-btn"
                onClick={applyFilter}
              >
                Aplicar
              </button>
            </footer>
          </div>
        </div>
      )}
    </div>
  );
}
