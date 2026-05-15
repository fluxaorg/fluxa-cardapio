"use client";
import { useState, useEffect, useMemo } from 'react';
import HeroSection from '@/components/HeroSection';
import { ArrowLeft, ChevronRight, Check, Search } from 'lucide-react';
import { useCart } from '@/context/CartContext';
import { useCompany } from '@/context/CompanyContext';
import { supabase } from '@/lib/supabase';
import './Pizzas.css';

interface PizzaSize {
  id: string;
  name: string;
  price: number;
  maxFlavors: number;
}

interface Flavor {
  id: string;
  name: string;
  description: string;
  color: string;
  pattern: string;
}

const PIZZA_SIZES: PizzaSize[] = [
  { id: 'broto',   name: 'Pizza Broto',   price: 46,  maxFlavors: 1 },
  { id: 'pequena', name: 'Pizza Pequena', price: 61,  maxFlavors: 2 },
  { id: 'media',   name: 'Pizza Média',   price: 75,  maxFlavors: 3 },
  { id: 'grande',  name: 'Pizza Grande',  price: 85,  maxFlavors: 4 },
  { id: 'gigante', name: 'PIZZA GIGANTE', price: 105, maxFlavors: 4 },
];

const FLAVORS: Flavor[] = [
  { id: 'calabresa',   name: 'Calabresa',       description: 'Molho de tomate, mussarela, calabresa e cebola.',         color: '#B22222', pattern: 'calabresa'   },
  { id: 'frango',      name: 'Frango Catupiry',  description: 'Molho de tomate, mussarela, frango desfiado e catupiry.', color: '#D4A017', pattern: 'frango'      },
  { id: 'margherita',  name: 'Margherita',       description: 'Molho, mussarela, manjericão fresco e tomate.',           color: '#4CAF50', pattern: 'margherita'  },
  { id: '4queijos',    name: '4 Queijos',        description: 'Mussarela, catupiry, provolone e parmesão.',              color: '#FFD700', pattern: 'queijos'     },
  { id: 'portuguesa',  name: 'Portuguesa',       description: 'Mussarela, presunto, ovos, cebola, ervilha e azeitona.', color: '#FF8C00', pattern: 'portuguesa'  },
  { id: 'bacon',       name: 'Bacon',            description: 'Mussarela, bacon crocante e cebola.',                    color: '#8B4513', pattern: 'bacon'       },
  { id: 'pepperoni',   name: 'Pepperoni',        description: 'Mussarela, fatias de pepperoni e orégano.',              color: '#CC2200', pattern: 'pepperoni'   },
  { id: 'vegetariana', name: 'Vegetariana',      description: 'Brócolis, milho, ervilha e palmito.',                    color: '#2E8B57', pattern: 'vegetariana' },
];

const PIZZA_CRUSTS = [
  { id: 'sem',        name: 'Sem borda',              price: 0,    emoji: '🍕' },
  { id: 'queijo',     name: 'Borda de Queijo',        price: 6,    emoji: '🧀' },
  { id: 'catupiry',   name: 'Borda de Catupiry',      price: 8,    emoji: '🫙' },
  { id: 'cheddar',    name: 'Borda de Cheddar',       price: 8,    emoji: '🟡' },
  { id: 'integral',   name: 'Pão Integral',           price: 4,    emoji: '🌾' },
  { id: 'pq',         name: 'Pão de Queijo',          price: 6,    emoji: '🧆' },
  { id: 'choco_preto',name: 'Pão de Chocolate Preto', price: 9,    emoji: '🍫' },
  { id: 'choco_bco',  name: 'Pão de Chocolate Branco',price: 9,    emoji: '🤍' },
  { id: 'pq_recheado',name: 'Pão de Queijo Recheado', price: 10,   emoji: '🫕' },
  { id: 'doce_leite', name: 'Borda Doce de Leite',    price: 10,   emoji: '🍬' },
];

const FLAVOR_COLORS: Record<string, { color: string; pattern: string }> = {
  calabresa: { color: '#B22222', pattern: 'calabresa' },
  frango:    { color: '#D4A017', pattern: 'frango' },
  margherita:{ color: '#4CAF50', pattern: 'margherita' },
  queijo:    { color: '#FFD700', pattern: 'queijos' },
  portuguesa:{ color: '#FF8C00', pattern: 'portuguesa' },
  bacon:     { color: '#8B4513', pattern: 'bacon' },
  pepperoni: { color: '#CC2200', pattern: 'pepperoni' },
  vegetariana:{ color: '#2E8B57', pattern: 'vegetariana' },
};

function flavorStyle(name: string) {
  const key = Object.keys(FLAVOR_COLORS).find(k => name.toLowerCase().includes(k));
  return key ? FLAVOR_COLORS[key] : { color: '#888', pattern: 'calabresa' };
}

export default function Pizzas() {
  const { addItem } = useCart();
  const { company } = useCompany();
  const [step, setStep] = useState(1);
  const [selectedSize, setSelectedSize] = useState<PizzaSize | null>(null);
  const [selectedFlavors, setSelectedFlavors] = useState<Flavor[]>([]);
  const [desiredFlavorCount, setDesiredFlavorCount] = useState(1);
  const [selectedCrust, setSelectedCrust] = useState(PIZZA_CRUSTS[0]);
  const [flavorSearch, setFlavorSearch] = useState('');

  const [dynamicSizes, setDynamicSizes] = useState<PizzaSize[]>([]);
  const [dynamicFlavors, setDynamicFlavors] = useState<Flavor[]>([]);
  const [dynamicCrusts, setDynamicCrusts] = useState(PIZZA_CRUSTS);

  useEffect(() => {
    if (!company?.id) return;
    supabase
      .from('food_menu_items')
      .select('sizes, pizza_flavors_per_size, pizza_borda_options')
      .eq('company_id', company.id)
      .eq('item_type', 'pizza_global')
      .eq('active', true)
      .maybeSingle()
      .then(({ data }) => {
        if (data) {
          if (Array.isArray(data.sizes) && data.sizes.length > 0) {
            setDynamicSizes(data.sizes.map((s: any) => ({
              id: s.id || s.name,
              name: s.name,
              price: Number(s.price || s.preco || 0),
              maxFlavors: Number(s.max_sabores || s.maxFlavors || 4),
            })));
          }
          if (Array.isArray(data.pizza_flavors_per_size) && data.pizza_flavors_per_size.length > 0) {
            setDynamicFlavors(data.pizza_flavors_per_size.map((f: any) => {
              const style = flavorStyle(f.name);
              const firstPrice = f.prices ? Object.values(f.prices)[0] as number : 0;
              return {
                id: f.id || f.name,
                name: f.name,
                description: f.subcat || '',
                color: style.color,
                pattern: style.pattern,
                price: Number(firstPrice || 0),
              };
            }));
          }
          if (Array.isArray(data.pizza_borda_options) && data.pizza_borda_options.length > 0) {
            setDynamicCrusts([
              { id: 'sem', name: 'Sem borda', price: 0, emoji: '🍕' },
              ...data.pizza_borda_options.map((c: any) => ({
                id: c.id || c.name, name: c.name, price: Number(c.price || 0), emoji: '🔵',
              })),
            ]);
          }
        }
      });
  }, [company?.id]);

  const sizes   = dynamicSizes.length > 0   ? dynamicSizes   : PIZZA_SIZES;
  const flavors = dynamicFlavors.length > 0 ? dynamicFlavors : FLAVORS;
  const crusts  = dynamicCrusts;

  const filteredFlavors = useMemo(() => {
    const q = flavorSearch.trim().toLowerCase();
    if (!q) return flavors;
    return flavors.filter((f) =>
      f.name.toLowerCase().includes(q) ||
      (f.description || '').toLowerCase().includes(q)
    );
  }, [flavors, flavorSearch]);

  const handleSizeSelect = (size: PizzaSize) => {
    setSelectedSize(size);
    setSelectedFlavors([]);
    setDesiredFlavorCount(size.maxFlavors);
    setSelectedCrust(PIZZA_CRUSTS[0]);
    setStep(2);
  };

  const goToStep3 = () => {
    if (selectedFlavors.length === 0) return;
    setStep(3);
  };

  const changeDesiredCount = (delta: number) => {
    if (!selectedSize) return;
    const next = Math.max(1, Math.min(selectedSize.maxFlavors, desiredFlavorCount + delta));
    setDesiredFlavorCount(next);
    if (selectedFlavors.length > next) {
      setSelectedFlavors(selectedFlavors.slice(0, next));
    }
  };

  const toggleFlavor = (flavor: Flavor) => {
    if (!selectedSize) return;
    const isSelected = selectedFlavors.find((f) => f.id === flavor.id);
    if (isSelected) {
      setSelectedFlavors(selectedFlavors.filter((f) => f.id !== flavor.id));
    } else {
      if (selectedFlavors.length < desiredFlavorCount) {
        setSelectedFlavors([...selectedFlavors, flavor]);
      }
    }
  };

  const handleAddCart = () => {
    if (!selectedSize || selectedFlavors.length === 0) return;
    const crustExtra = selectedCrust.price;
    addItem({
      productId: `pizza-${selectedSize.id}`,
      name: `${selectedSize.name} (${selectedFlavors.map((f) => f.name).join(' / ')})${selectedCrust.id !== 'sem' ? ` — Borda ${selectedCrust.name}` : ''}`,
      price: selectedSize.price + crustExtra,
      qty: 1,
      image_url: '',
      description: selectedFlavors.map((f) => f.name).join(', '),
      options: { size: selectedSize.id, flavors: selectedFlavors.map((f) => f.id), crust: selectedCrust.id },
    } as any);
    setStep(1);
    setSelectedFlavors([]);
    setSelectedSize(null);
    setSelectedCrust(PIZZA_CRUSTS[0]);
  };

  const renderPizzaChart = () => {
    const n = desiredFlavorCount || 1;
    const cx = 120, cy = 120, R = 102;

    return (
      <svg viewBox="0 0 240 240" width="185" height="185" className="pizza-svg">
        <defs>
          <pattern id="pat-calabresa" patternUnits="userSpaceOnUse" width="36" height="36">
            <rect width="36" height="36" fill="#C0392B" opacity="0.15"/>
            <circle cx="18" cy="18" r="11" fill="#8B0000" opacity="0.9"/>
            <circle cx="18" cy="18" r="8"  fill="#B22222"/>
            <circle cx="18" cy="18" r="4"  fill="#7B0000" opacity="0.6"/>
            <circle cx="22" cy="14" r="1.5" fill="#FF6B6B" opacity="0.7"/>
          </pattern>
          <pattern id="pat-frango" patternUnits="userSpaceOnUse" width="34" height="34">
            <rect width="34" height="34" fill="#D4A017" opacity="0.18"/>
            <ellipse cx="17" cy="17" rx="10" ry="7"  fill="#F0C040" opacity="0.9" transform="rotate(25,17,17)"/>
            <ellipse cx="10" cy="10" rx="5"  ry="3.5" fill="#E8B830" opacity="0.7" transform="rotate(-15,10,10)"/>
            <ellipse cx="25" cy="24" rx="4"  ry="3"   fill="#F5D060" opacity="0.6" transform="rotate(10,25,24)"/>
          </pattern>
          <pattern id="pat-margherita" patternUnits="userSpaceOnUse" width="40" height="40">
            <rect width="40" height="40" fill="#E8F5E9" opacity="0.2"/>
            <circle cx="20" cy="20" r="10" fill="#E53935"/>
            <circle cx="20" cy="20" r="7"  fill="#C62828"/>
            <line x1="14" y1="20" x2="26" y2="20" stroke="#FF8A80" strokeWidth="1" opacity="0.5"/>
            <line x1="20" y1="14" x2="20" y2="26" stroke="#FF8A80" strokeWidth="1" opacity="0.5"/>
            <ellipse cx="8"  cy="8"  rx="5" ry="3" fill="#388E3C" transform="rotate(-30,8,8)"/>
            <ellipse cx="32" cy="32" rx="5" ry="3" fill="#43A047" transform="rotate(20,32,32)"/>
          </pattern>
          <pattern id="pat-queijos" patternUnits="userSpaceOnUse" width="38" height="38">
            <rect width="38" height="38" fill="#FFF176" opacity="0.3"/>
            <ellipse cx="19" cy="19" rx="12" ry="9"  fill="#FFD600" opacity="0.7" transform="rotate(15,19,19)"/>
            <ellipse cx="10" cy="28" rx="7"  ry="5"  fill="#FFC107" opacity="0.6" transform="rotate(-10,10,28)"/>
            <ellipse cx="28" cy="10" rx="6"  ry="4"  fill="#FFEE58" opacity="0.6" transform="rotate(30,28,10)"/>
          </pattern>
          <pattern id="pat-portuguesa" patternUnits="userSpaceOnUse" width="38" height="38">
            <rect width="38" height="38" fill="#FFA500" opacity="0.12"/>
            <circle cx="19" cy="19" r="5" fill="#2D2D2D"/>
            <circle cx="19" cy="19" r="2" fill="#555"/>
            <circle cx="8"  cy="10" r="3" fill="#5D8A4E"/>
            <circle cx="30" cy="28" r="3" fill="#5D8A4E"/>
            <ellipse cx="10" cy="28" rx="7" ry="4" fill="#F4A460" opacity="0.7" transform="rotate(20,10,28)"/>
            <ellipse cx="28" cy="10" rx="6" ry="3.5" fill="#F4A460" opacity="0.6" transform="rotate(-15,28,10)"/>
          </pattern>
          <pattern id="pat-bacon" patternUnits="userSpaceOnUse" width="30" height="20">
            <rect width="30" height="20" fill="#8B4513" opacity="0.15"/>
            <rect x="0" y="3"  width="30" height="4" fill="#6B2E0D" opacity="0.85" transform="rotate(-8,15,5)"/>
            <rect x="0" y="12" width="30" height="3" fill="#A0522D" opacity="0.7"  transform="rotate(-8,15,13)"/>
            <rect x="0" y="6"  width="30" height="2" fill="#CD853F" opacity="0.5"  transform="rotate(-8,15,7)"/>
          </pattern>
          <pattern id="pat-pepperoni" patternUnits="userSpaceOnUse" width="38" height="38">
            <rect width="38" height="38" fill="#CC2200" opacity="0.1"/>
            <circle cx="19" cy="19" r="13" fill="#CC2200"/>
            <circle cx="19" cy="19" r="11" fill="#B71C1C"/>
            <circle cx="14" cy="14" r="2"  fill="#FF5252" opacity="0.6"/>
            <circle cx="24" cy="15" r="1.5" fill="#FF5252" opacity="0.5"/>
            <circle cx="18" cy="25" r="1.5" fill="#FF5252" opacity="0.5"/>
          </pattern>
          <pattern id="pat-vegetariana" patternUnits="userSpaceOnUse" width="36" height="36">
            <rect width="36" height="36" fill="#2E8B57" opacity="0.12"/>
            <circle cx="12" cy="12" r="6" fill="#228B22"/>
            <circle cx="10" cy="10" r="3" fill="#32CD32" opacity="0.8"/>
            <circle cx="14" cy="14" r="3" fill="#2E8B57" opacity="0.8"/>
            <circle cx="26" cy="14" r="4" fill="#FFD700" opacity="0.9"/>
            <circle cx="14" cy="26" r="3" fill="#6DBF67"/>
            <circle cx="26" cy="26" r="3" fill="#4CAF50"/>
          </pattern>
        </defs>

        {/* Crust */}
        <circle cx={cx} cy={cy} r={R + 10} fill="#C8852A"/>
        <circle cx={cx} cy={cy} r={R + 8}  fill="#D4953A"/>
        {Array.from({ length: 16 }).map((_, k) => {
          const a = (k * Math.PI * 2 / 16);
          const br = R + 8;
          return <circle key={k} cx={cx + br * Math.cos(a)} cy={cy + br * Math.sin(a)} r="2.5" fill="#7A4A1A" opacity="0.35"/>;
        })}
        <circle cx={cx} cy={cy} r={R} fill="#E8A870"/>
        <circle cx={cx} cy={cy} r={R} fill="#D94E2F" opacity="0.18"/>

        {/* Slices */}
        {Array.from({ length: n }).map((_, i) => {
          const angleStep = 360 / n;
          const startAngle = i * angleStep;
          const endAngle = (i + 1) * angleStep;
          const x1 = cx + R * Math.cos((startAngle - 90) * Math.PI / 180);
          const y1 = cy + R * Math.sin((startAngle - 90) * Math.PI / 180);
          const x2 = cx + R * Math.cos((endAngle - 90) * Math.PI / 180);
          const y2 = cy + R * Math.sin((endAngle - 90) * Math.PI / 180);
          const largeArcFlag = angleStep > 180 ? 1 : 0;
          const flavor = selectedFlavors[i];
          if (n === 1) {
            return flavor
              ? <circle key={i} cx={cx} cy={cy} r={R} fill={`url(#pat-${flavor.pattern})`} stroke="#C8852A" strokeWidth="1.5"/>
              : <circle key={i} cx={cx} cy={cy} r={R} fill="#F5E5D0" opacity="0.55"/>;
          }
          const d = `M ${cx} ${cy} L ${x1.toFixed(1)} ${y1.toFixed(1)} A ${R} ${R} 0 ${largeArcFlag} 1 ${x2.toFixed(1)} ${y2.toFixed(1)} Z`;
          return (
            <path key={i} d={d}
              fill={flavor ? `url(#pat-${flavor.pattern})` : '#F5E5D0'}
              opacity={flavor ? 1 : 0.55}
              stroke="#C8852A" strokeWidth="1.5"/>
          );
        })}

        {/* Dividers */}
        {n > 1 && Array.from({ length: n }).map((_, i) => {
          const angle = i * (360 / n);
          const x = cx + R * Math.cos((angle - 90) * Math.PI / 180);
          const y = cy + R * Math.sin((angle - 90) * Math.PI / 180);
          return <line key={i} x1={cx} y1={cy} x2={x} y2={y} stroke="#C8852A" strokeWidth="1.5" opacity="0.8"/>;
        })}

        {/* Labels */}
        {selectedFlavors.map((flavor, i) => {
          const angleStep = 360 / n;
          const mid = (i * angleStep + (i + 1) * angleStep) / 2;
          const lr = R * 0.6;
          const lx = cx + lr * Math.cos((mid - 90) * Math.PI / 180);
          const ly = cy + lr * Math.sin((mid - 90) * Math.PI / 180);
          const short = flavor.name.length > 9 ? flavor.name.slice(0, 8) + '…' : flavor.name;
          return (
            <text key={flavor.id} x={lx} y={ly}
              textAnchor="middle" dominantBaseline="middle"
              fontSize={n <= 2 ? 11 : n <= 3 ? 9 : 8}
              fontWeight="800" fill="white"
              style={{ filter: 'drop-shadow(0 1px 2px rgba(0,0,0,0.7))', pointerEvents: 'none' }}>
              {short}
            </text>
          );
        })}
      </svg>
    );
  };

  if (step === 1) {
    return (
      <div className="page-container">
        <main className="main-section bg-white-block split-layout">
          <div className="split-left">
            <HeroSection
              titleMedium="monte sua"
              titleGiant="pizza!"
              subtitle="escolha o tamanho perfeito"
            />
          </div>
          <div className="split-right pizza-builder-panel">
            <div className="size-list">
              {sizes.map((size) => (
                <div key={size.id} className="size-row-card" onClick={() => handleSizeSelect(size)}>
                  <div className="size-main-info">
                    <h3>{size.name}</h3>
                    <p>Até {size.maxFlavors} sabor{size.maxFlavors === 1 ? '' : 'es'}</p>
                  </div>
                  <div className="size-right-info">
                    <span className="size-price">R$ {size.price.toFixed(2)}</span>
                    <ChevronRight size={20} />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </main>
      </div>
    );
  }

  if (step === 3) {
    return (
      <div className="page-container">
        <header className="mobile-page-header">
          <button className="mobile-back-btn" onClick={() => setStep(2)} aria-label="Voltar">
            <ArrowLeft size={20} />
          </button>
          <h1 className="mobile-page-title">
            Escolha a borda
            <span className="mobile-page-subtitle">{selectedSize?.name}</span>
          </h1>
        </header>

        <main className="main-section bg-white-block pizza-step2-layout">
          <div className="pizza-s2-header">
            <button className="back-link" onClick={() => setStep(2)}>
              <ArrowLeft size={18} />
              <span>Voltar aos sabores</span>
            </button>
            <div className="pizza-s2-title">
              <h2>Escolha a borda</h2>
              <p>{selectedSize?.name} — {selectedFlavors.map(f => f.name).join(' / ')}</p>
            </div>
          </div>

          <div className="pizza-s2-chart-area" style={{ marginBottom: 12 }}>
            <div className="pizza-visualizer-container">
              {renderPizzaChart()}
            </div>
          </div>

          <div className="pizza-crust-grid-step3">
            {crusts.map(crust => (
              <button
                key={crust.id}
                className={`pizza-crust-btn ${selectedCrust.id === crust.id ? 'selected' : ''}`}
                onClick={() => setSelectedCrust(crust)}
              >
                <span className="crust-emoji">{crust.emoji}</span>
                <span className="crust-name">{crust.name}</span>
                {crust.price > 0 && <span className="crust-price">+R$ {crust.price.toFixed(2)}</span>}
              </button>
            ))}
          </div>

          <div className="pizza-s2-footer">
            <button className="btn-add-cart" onClick={handleAddCart}>
              Adicionar ao Carrinho • R$ {((selectedSize?.price || 0) + selectedCrust.price).toFixed(2)}
            </button>
          </div>
        </main>
      </div>
    );
  }

  return (
    <div className="page-container">
      <header className="mobile-page-header">
        <button className="mobile-back-btn" onClick={() => { setStep(1); setSelectedFlavors([]); }} aria-label="Mudar tamanho">
          <ArrowLeft size={20} />
        </button>
        <h1 className="mobile-page-title">
          {selectedSize?.name || 'Escolha sabores'}
          <span className="mobile-page-subtitle">
            até {selectedSize?.maxFlavors} sabor{selectedSize?.maxFlavors === 1 ? '' : 'es'}
          </span>
        </h1>
      </header>

      <main className="main-section bg-white-block pizza-step2-layout">
        <div className="pizza-s2-header">
          <button className="back-link" onClick={() => { setStep(1); setSelectedFlavors([]); }}>
            <ArrowLeft size={18} />
            <span>Mudar tamanho</span>
          </button>
          <div className="pizza-s2-title">
            <h2>{selectedSize?.name}</h2>
            <p>Escolha até {selectedSize?.maxFlavors} sabor{selectedSize?.maxFlavors === 1 ? '' : 'es'}</p>
          </div>
        </div>

        {selectedSize && selectedSize.maxFlavors > 1 && (
          <div className="pizza-flavor-counter">
            <button
              className="pfc-btn"
              onClick={() => changeDesiredCount(-1)}
              disabled={desiredFlavorCount <= 1}
            >−</button>
            <span className="pfc-label">
              {desiredFlavorCount} sabor{desiredFlavorCount > 1 ? 'es' : ''}
            </span>
            <button
              className="pfc-btn"
              onClick={() => changeDesiredCount(1)}
              disabled={desiredFlavorCount >= (selectedSize?.maxFlavors || 1)}
            >+</button>
            <span className="pfc-hint">fatias maiores com menos sabores</span>
          </div>
        )}

        <div className="pizza-s2-chart-area">
          <div className="pizza-visualizer-container">
            {renderPizzaChart()}
          </div>
          <p className="pizza-s2-caption">
            {selectedFlavors.length === 0
              ? `Escolha ${desiredFlavorCount} sabor${desiredFlavorCount > 1 ? 'es' : ''}`
              : `${selectedFlavors.length} de ${desiredFlavorCount} sabor${desiredFlavorCount > 1 ? 'es' : ''} escolhido${selectedFlavors.length > 1 ? 's' : ''}`
            }
          </p>
        </div>

        {/* Search bar dos sabores */}
        <div className="flavor-search-wrap">
          <Search size={18} className="flavor-search-icon" />
          <input
            className="flavor-search-input"
            type="text"
            placeholder="Buscar sabor (ex: calabresa)"
            value={flavorSearch}
            onChange={(e) => setFlavorSearch(e.target.value)}
          />
          {flavorSearch && (
            <button
              className="flavor-search-clear"
              onClick={() => setFlavorSearch('')}
              aria-label="Limpar busca"
            >
              ✕
            </button>
          )}
        </div>

        <div className="flavors-selection-grid pizza-s2-flavors">
          {filteredFlavors.map((flavor) => {
            const isSelected = !!selectedFlavors.find((f) => f.id === flavor.id);
            const isDisabled = !isSelected && selectedFlavors.length >= desiredFlavorCount;
            return (
              <div
                key={flavor.id}
                className={`flavor-item-card ${isSelected ? 'is-selected' : ''} ${isDisabled ? 'is-disabled' : ''}`}
                onClick={() => !isDisabled && toggleFlavor(flavor)}
              >
                <div className="flavor-color-dot" style={{ backgroundColor: flavor.color }}></div>
                <div className="flavor-details">
                  <h4>{flavor.name}</h4>
                  <p>{flavor.description}</p>
                </div>
                {isSelected && <Check className="check-icon" size={16} />}
              </div>
            );
          })}
          {filteredFlavors.length === 0 && (
            <p className="flavor-empty">Nenhum sabor encontrado para “{flavorSearch}”.</p>
          )}
        </div>

        <div className="pizza-s2-footer">
          <button
            className={`btn-add-cart ${selectedFlavors.length === 0 ? 'inactive' : ''}`}
            disabled={selectedFlavors.length === 0}
            onClick={goToStep3}
          >
            Próximo: Escolha a Borda →
          </button>
        </div>
      </main>
    </div>
  );
}
