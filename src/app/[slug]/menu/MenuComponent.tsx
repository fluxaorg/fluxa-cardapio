"use client";
import { useState, useEffect } from 'react';
import { Filter, Plus } from 'lucide-react';
import { useRouter, useSearchParams } from 'next/navigation';
import { useCompany } from '@/context/CompanyContext';
import { supabase } from '@/lib/supabase';
import './Menu.css';

type Category = {
  id: string;
  name: string;
};

type Product = {
  id: string;
  name: string;
  description: string;
  price: number;
  image_url: string;
  category: string;
};

export default function Menu() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { company } = useCompany();
  const slug = company?.slug || '';
  const basePath = slug ? `/${slug}` : '';

  const searchQuery = searchParams.get('q') || '';

  const [categories, setCategories] = useState<Category[]>([]);
  const [products, setProducts] = useState<Product[]>([]);
  const [activeCategoryId, setActiveCategoryId] = useState<string | null>(null);

  useEffect(() => {
    if (!company?.id) return;

    async function fetchData() {
      const { data: cats } = await supabase
        .from('food_categories')
        .select('*')
        .eq('company_id', company!.id);

      if (cats && cats.length > 0) {
        setCategories(cats);
        setActiveCategoryId(cats[0].id);
      }

      const { data: prods } = await supabase
        .from('food_menu_items')
        .select('*')
        .eq('company_id', company!.id);

      if (prods) {
        setProducts(prods);
      }
    }
    fetchData();
  }, [company?.id]);

  // Limpa filtro de categoria ao buscar
  useEffect(() => {
    if (searchQuery && categories.length > 0) {
      setActiveCategoryId(null);
    }
  }, [searchQuery, categories]);

  const filteredProducts = products.filter((p) => {
    const matchesSearch = searchQuery
      ? p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (p.description || '').toLowerCase().includes(searchQuery.toLowerCase())
      : true;

    const matchesCategory =
      !searchQuery && activeCategoryId
        ? p.category === categories.find((c) => c.id === activeCategoryId)?.name
        : true;

    return matchesSearch && matchesCategory;
  });

  return (
    <div className="page-container">
      <main className="main-section bg-white-block menu-section">
        <div className="menu-header">
          <h1 className="menu-title">
            {searchQuery ? `Resultados para "${searchQuery}"` : 'Categorias'}
          </h1>
          <button className="menu-filter-btn">
            <Filter size={22} color="var(--color-red)" />
          </button>
        </div>

        {!searchQuery && (
          <div className="menu-categories">
            {categories.map((cat) => (
              <button
                key={cat.id}
                onClick={() => {
                  if (cat.name.toLowerCase() === 'pizzas') {
                    router.push(`${basePath}/pizzas`);
                  } else {
                    setActiveCategoryId(cat.id);
                  }
                }}
                className={`category-pill ${cat.id === activeCategoryId ? 'active' : ''}`}
              >
                {cat.name}
              </button>
            ))}
          </div>
        )}

        <div className="menu-grid">
          {filteredProducts.map((p) => (
            <div
              key={p.id}
              className="product-card"
              onClick={() => router.push(`${basePath}/produto/${p.id}`)}
            >
              <img
                src={p.image_url || ''} onError={(e) => { (e.target as HTMLImageElement).style.display = 'none'; }}
                alt={p.name}
                className="product-card-img"
              />
              <div className="product-card-info">
                <h3 className="product-card-name">{p.name}</h3>
                <p className="product-card-desc">{p.description}</p>
                <span className="product-card-price">
                  a partir de R$ {p.price?.toFixed(2)}
                </span>
              </div>
              <button
                className="product-card-add"
                onClick={(e) => {
                  e.stopPropagation();
                  router.push(`${basePath}/produto/${p.id}`);
                }}
              >
                <Plus size={18} strokeWidth={3} />
              </button>
            </div>
          ))}
          {filteredProducts.length === 0 && (
            <p style={{ color: '#888', gridColumn: '1 / -1', textAlign: 'center', padding: '40px' }}>
              {searchQuery
                ? `Nenhum produto encontrado para "${searchQuery}".`
                : 'Nenhum produto nesta categoria.'}
            </p>
          )}
        </div>
      </main>
    </div>
  );
}
