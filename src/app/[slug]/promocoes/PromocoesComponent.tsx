"use client";
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import HeroSection from '@/components/HeroSection';
import { useCompany } from '@/context/CompanyContext';
import { supabase } from '@/lib/supabase';
import './Promocoes.css';

interface Promotion {
  id: string;
  title: string;
  description: string | null;
  discount_pct: number;
  item_ids: string[];
  image_url: string | null;
  day_of_week: number | null;
  valid_until: string | null;
}

interface MenuItem {
  id: string;
  name: string;
  price: number;
  image_url: string | null;
  category: string;
}

const DAY_NAMES = ['Domingo', 'Segunda', 'Terça', 'Quarta', 'Quinta', 'Sexta', 'Sábado'];

export default function Promocoes() {
  const { company } = useCompany();
  const router = useRouter();
  const basePath = company?.slug ? `/${company.slug}` : '';

  const [promotions, setPromotions] = useState<Promotion[]>([]);
  const [promoItems, setPromoItems] = useState<Record<string, MenuItem[]>>({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!company?.id) return;
    fetchPromotions();
  }, [company?.id]);

  async function fetchPromotions() {
    const { data: promos } = await supabase
      .from('food_promotions')
      .select('*')
      .eq('company_id', company!.id)
      .eq('active', true)
      .order('created_at', { ascending: false });

    if (!promos || promos.length === 0) {
      setPromotions([]);
      setLoading(false);
      return;
    }

    setPromotions(promos);

    const allIds = Array.from(new Set(promos.flatMap((p: Promotion) => p.item_ids || [])));
    if (allIds.length > 0) {
      const { data: items } = await supabase
        .from('food_menu_items')
        .select('id, name, price, image_url, category')
        .in('id', allIds);

      const byId: Record<string, MenuItem> = {};
      (items || []).forEach((it: MenuItem) => { byId[it.id] = it; });

      const grouped: Record<string, MenuItem[]> = {};
      promos.forEach((p: Promotion) => {
        grouped[p.id] = (p.item_ids || []).map((id: string) => byId[id]).filter(Boolean);
      });
      setPromoItems(grouped);
    }

    setLoading(false);
  }

  const discountedPrice = (price: number, pct: number) => price * (1 - pct / 100);

  return (
    <div className="page-container">
      <header className="mobile-page-header">
        <h1 className="mobile-page-title">
          Promoções
          <span className="mobile-page-subtitle">aproveite enquanto durar</span>
        </h1>
      </header>

      <main className="main-section bg-white-block split-layout">
        <div className="split-left">
          <HeroSection
            titleMedium="nossas"
            titleGiant="promoções!"
            subtitle="aproveite enquanto durar"
          />
        </div>

        <div className="split-right promo-right-panel">
          {loading ? (
            <div className="promo-loading">Carregando...</div>
          ) : promotions.length === 0 ? (
            <div className="promo-empty">
              <span style={{ fontSize: 48 }}>🎉</span>
              <p style={{ fontWeight: 700, fontSize: 18, marginTop: 12 }}>Nenhuma promoção ativa</p>
              <p style={{ fontSize: 14, color: 'var(--color-text-secondary)', marginTop: 4 }}>
                Fique de olho, novas chegam em breve!
              </p>
            </div>
          ) : (
            <div className="promo-list">
              {promotions.map((promo) => (
                <div key={promo.id} className="promo-card">
                  <div className="promo-card-header">
                    <div className="promo-badge">-{promo.discount_pct}%</div>
                    <div className="promo-title-wrap">
                      <h3 className="promo-card-title">{promo.title}</h3>
                      {promo.day_of_week !== null && promo.day_of_week !== undefined && (
                        <span className="promo-day-tag">Toda {DAY_NAMES[promo.day_of_week]}</span>
                      )}
                      {promo.description && (
                        <p className="promo-card-desc">{promo.description}</p>
                      )}
                    </div>
                  </div>

                  {(promoItems[promo.id] || []).length > 0 && (
                    <div className="promo-items-row">
                      {(promoItems[promo.id] || []).map((item) => {
                        const promoPrice = discountedPrice(item.price, promo.discount_pct);
                        const href = `${basePath}/produto/${item.id}?promoPrice=${promoPrice.toFixed(2)}`;
                        return (
                          <div
                            key={item.id}
                            className="promo-item-card"
                            onClick={() => router.push(href)}
                          >
                            {item.image_url ? (
                              <img src={item.image_url} alt={item.name} className="promo-item-img" />
                            ) : (
                              <div className="promo-item-placeholder">🍴</div>
                            )}
                            <div className="promo-item-info">
                              <span className="promo-item-name">{item.name}</span>
                              <div className="promo-item-prices">
                                <span className="promo-item-original">R$ {item.price.toFixed(2)}</span>
                                <span className="promo-item-discounted">R$ {promoPrice.toFixed(2)}</span>
                              </div>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
