import { useState, useEffect } from 'react';
import { Filter, Plus } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useCompany } from '../context/CompanyContext';
import { supabase } from '../lib/supabase';
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
  const navigate = useNavigate();
  const { company } = useCompany();
  const slug = company?.slug || '';
  const basePath = slug ? `/${slug}` : '';

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

  const filteredProducts = activeCategoryId 
    ? products.filter(p => {
        const cat = categories.find(c => c.id === activeCategoryId);
        return p.category === cat?.name;
      })
    : products;

  return (
    <div className="page-container">
      <main className="main-section bg-white-block menu-section">
        <div className="menu-header">
          <h1 className="menu-title">Categorias</h1>
          <button className="menu-filter-btn">
            <Filter size={22} color="var(--color-red)" />
          </button>
        </div>

        <div className="menu-categories">
          {categories.map((cat) => (
            <button
              key={cat.id}
              onClick={() => {
                if (cat.name.toLowerCase() === 'pizzas') {
                  navigate(`${basePath}/pizzas`);
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

        <div className="menu-grid">
          {filteredProducts.map((p) => (
            <div 
              key={p.id} 
              className="product-card" 
              onClick={() => navigate(`${basePath}/produto/${p.id}`)}
            >
              <img src={p.image_url || 'https://via.placeholder.com/200'} alt={p.name} className="product-card-img" />
              <div className="product-card-info">
                <h3 className="product-card-name">{p.name}</h3>
                <p className="product-card-desc">{p.description}</p>
                <span className="product-card-price">a partir de R$ {p.price?.toFixed(2)}</span>
              </div>
              <button 
                className="product-card-add"
                onClick={(e) => {
                  e.stopPropagation();
                  navigate(`${basePath}/produto/${p.id}`);
                }}
              >
                <Plus size={18} strokeWidth={3} />
              </button>
            </div>
          ))}
          {filteredProducts.length === 0 && (
            <p style={{ color: '#888', gridColumn: '1 / -1', textAlign: 'center', padding: '40px' }}>Nenhum produto nesta categoria.</p>
          )}
        </div>
      </main>
    </div>
  );
}
