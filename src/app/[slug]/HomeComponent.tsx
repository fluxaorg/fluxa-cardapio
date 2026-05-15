"use client";
import HeroSection from '@/components/HeroSection';
import { useRouter } from 'next/navigation';
import { useCompany } from '@/context/CompanyContext';
import { Pizza, UtensilsCrossed, Sandwich, GlassWater, Tag, ChevronRight } from 'lucide-react';
import './Home.css';

const HOME_CATEGORIES = [
  { id: 'pizzas',     label: 'Pizzas',     hint: 'Monte sua pizza',         icon: Pizza,            href: 'pizzas',     color: '#D91E36' },
  { id: 'lanches',    label: 'Lanches',    hint: 'Hamburguers e mais',      icon: Sandwich,         href: 'menu?cat=lanches',    color: '#F97316' },
  { id: 'petiscos',   label: 'Petiscos',   hint: 'Pra galera toda',         icon: UtensilsCrossed,  href: 'menu?cat=petiscos',   color: '#EAB308' },
  { id: 'bebidas',    label: 'Bebidas',    hint: 'Geladinhas',              icon: GlassWater,       href: 'menu?cat=bebidas',    color: '#0EA5E9' },
  { id: 'promocoes',  label: 'Promoções',  hint: 'Aproveite enquanto dura', icon: Tag,              href: 'promocoes',           color: '#16A34A' },
];

export default function Home() {
  const router = useRouter();
  const { company } = useCompany();
  const basePath = company?.slug ? `/${company.slug}` : '';

  return (
    <div className="page-container home-page-container">
      {/* ── Mobile-only: título e lista de categorias centralizada ── */}
      <header className="mobile-page-header home-mobile-header">
        <h1 className="mobile-page-title">
          {company?.name || 'Cardápio'}
          <span className="mobile-page-subtitle">o que vai pedir hoje?</span>
        </h1>
      </header>

      <main className="main-section bg-white-block split-layout">
        <div className="split-left">
          <HeroSection
            topLabel="Bem vindo ao cardápio!"
            titleMedium="Faça seu"
            titleGiant="pedido!"
            subtitle="Escolha seu pedido, e receba em minutos!"
            showUnderline={true}
          />
        </div>

        <div className="split-right">
          {/* Mobile: lista de categorias centralizada (substitui o bento) */}
          <div className="home-mobile-cat-list">
            {HOME_CATEGORIES.map((cat) => {
              const Icon = cat.icon;
              return (
                <button
                  key={cat.id}
                  className="home-cat-card"
                  onClick={() => router.push(`${basePath}/${cat.href}`)}
                >
                  <div className="home-cat-icon" style={{ background: `${cat.color}15`, color: cat.color }}>
                    <Icon size={26} strokeWidth={2.2} />
                  </div>
                  <div className="home-cat-info">
                    <span className="home-cat-label">{cat.label}</span>
                    <span className="home-cat-hint">{cat.hint}</span>
                  </div>
                  <ChevronRight size={20} className="home-cat-chevron" />
                </button>
              );
            })}
          </div>

          {/* Desktop: bento grid mantido */}
          <div className="home-bento-grid">
            <div className="bento-item bento-pizza" onClick={() => router.push(`${basePath}/pizzas`)}>
              <img src="https://images.unsplash.com/photo-1513104890138-7c749659a591?q=80&w=500" alt="Pizza" />
              <div className="bento-badge">PIZZAS</div>
            </div>

            <div className="bento-item bento-fries" onClick={() => router.push(`${basePath}/menu?cat=petiscos`)}>
              <img src="https://images.unsplash.com/photo-1573080496219-bb080dd4f877?q=80&w=500" alt="Fries" />
              <div className="bento-badge">BATATAS</div>
            </div>
            <div className="bento-item bento-burger" onClick={() => router.push(`${basePath}/menu?cat=lanches`)}>
              <img src="https://images.unsplash.com/photo-1568901346375-23c9450c58cd?q=80&w=500" alt="Lanches" />
              <div className="bento-badge">LANCHES</div>
            </div>

            <div className="bento-item bento-coke" onClick={() => router.push(`${basePath}/menu?cat=bebidas`)}>
              <img src="https://images.unsplash.com/photo-1622483767028-3f66f32aef97?q=80&w=500" alt="Coke" />
              <div className="bento-badge">BEBIDAS</div>
            </div>

            <div className="bento-item bento-sticks" onClick={() => router.push(`${basePath}/promocoes`)}>
              <img src="https://images.unsplash.com/photo-1531496681078-2742ed47fbc8?q=80&w=500" alt="Sticks" />
              <div className="bento-badge">PROMOÇÕES</div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
