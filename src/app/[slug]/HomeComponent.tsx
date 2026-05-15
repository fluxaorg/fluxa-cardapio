"use client";
import HeroSection from '@/components/HeroSection';
import { useRouter } from 'next/navigation';
import { useCompany } from '@/context/CompanyContext';
import './Home.css';

interface BentoTile {
  id: string;
  className: string;
  label: string;
  caption: string;
  image: string;
  href: string;
  accent?: string;
}

const BENTO_TILES: BentoTile[] = [
  {
    id: 'pizza',
    className: 'bento-pizza',
    label: 'Pizzas',
    caption: 'Monte do seu jeito',
    image: 'https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?q=80&w=900&auto=format&fit=crop',
    href: 'pizzas',
    accent: '#D91E36',
  },
  {
    id: 'lanches',
    className: 'bento-burger',
    label: 'Lanches',
    caption: 'Suculentos',
    image: 'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?q=80&w=900&auto=format&fit=crop',
    href: 'menu?cat=lanches',
    accent: '#F97316',
  },
  {
    id: 'petiscos',
    className: 'bento-fries',
    label: 'Petiscos',
    caption: 'Pra galera',
    image: 'https://images.unsplash.com/photo-1573080496219-bb080dd4f877?q=80&w=900&auto=format&fit=crop',
    href: 'menu?cat=petiscos',
    accent: '#EAB308',
  },
  {
    id: 'bebidas',
    className: 'bento-coke',
    label: 'Bebidas',
    caption: 'Geladinhas',
    image: 'https://images.unsplash.com/photo-1622483767028-3f66f32aef97?q=80&w=900&auto=format&fit=crop',
    href: 'menu?cat=bebidas',
    accent: '#0EA5E9',
  },
  {
    id: 'promocoes',
    className: 'bento-sticks',
    label: 'Promoções',
    caption: 'Aproveite',
    image: 'https://images.unsplash.com/photo-1606755962773-d324e0a13086?q=80&w=900&auto=format&fit=crop',
    href: 'promocoes',
    accent: '#16A34A',
  },
];

export default function Home() {
  const router = useRouter();
  const { company } = useCompany();
  const basePath = company?.slug ? `/${company.slug}` : '';

  return (
    <div className="page-container home-page-container">
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
          <div className="home-bento-grid">
            {BENTO_TILES.map((tile) => (
              <button
                key={tile.id}
                type="button"
                className={`bento-item ${tile.className}`}
                onClick={() => router.push(`${basePath}/${tile.href}`)}
                style={{ '--bento-accent': tile.accent } as React.CSSProperties}
              >
                <img src={tile.image} alt={tile.label} loading="lazy" />
                <div className="bento-overlay" aria-hidden="true" />
                <div className="bento-content">
                  <span className="bento-caption">{tile.caption}</span>
                  <span className="bento-label">{tile.label}</span>
                </div>
                <span className="bento-cta" aria-hidden="true">→</span>
              </button>
            ))}
          </div>
        </div>
      </main>
    </div>
  );
}
