import { useState } from 'react';
import HeroSection from '../components/HeroSection';
import { ArrowLeft, ChevronRight, Check } from 'lucide-react';
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
  image?: string;
}

const PIZZA_SIZES: PizzaSize[] = [
  { id: 'broto', name: 'Pizza Broto', price: 46, maxFlavors: 1 },
  { id: 'pequena', name: 'Pizza Pequena', price: 61, maxFlavors: 2 },
  { id: 'media', name: 'Pizza Média', price: 75, maxFlavors: 2 },
  { id: 'grande', name: 'Pizza Grande', price: 85, maxFlavors: 3 },
  { id: 'gigante', name: 'PIZZA GIGANTE', price: 105, maxFlavors: 4 },
];

const FLAVORS: Flavor[] = [
  { id: 'calabresa', name: 'Calabresa', description: 'Molho de tomate, mussarela, calabresa e cebola.', image: '🍖' },
  { id: 'frango', name: 'Frango Catupiry', description: 'Molho de tomate, mussarela, frango desfiado e catupiry.', image: '🍗' },
  { id: 'margherita', name: 'Margherita', description: 'Molho de tomate, mussarela, manjericão fresco e tomate.', image: '🌿' },
  { id: '4queijos', name: '4 Queijos', description: 'Mussarela, catupiry, provolone e parmesão.', image: '🧀' },
  { id: 'portuguesa', name: 'Portuguesa', description: 'Mussarela, presunto, ovos, cebola, ervilha e azeitona.', image: '🥚' },
  { id: 'bacon', name: 'Bacon', description: 'Mussarela, bacon crocante e cebola.', image: '🥓' },
];

export default function Pizzas() {
  const [step, setStep] = useState(1);
  const [selectedSize, setSelectedSize] = useState<PizzaSize | null>(null);
  const [selectedFlavors, setSelectedFlavors] = useState<Flavor[]>([]);

  const handleSizeSelect = (size: PizzaSize) => {
    setSelectedSize(size);
    setStep(2);
  };

  const toggleFlavor = (flavor: Flavor) => {
    if (!selectedSize) return;

    const isSelected = selectedFlavors.find(f => f.id === flavor.id);
    if (isSelected) {
      setSelectedFlavors(selectedFlavors.filter(f => f.id !== flavor.id));
    } else {
      if (selectedFlavors.length < selectedSize.maxFlavors) {
        setSelectedFlavors([...selectedFlavors, flavor]);
      }
    }
  };

  const renderPizzaChart = () => {
    const numSlices = selectedFlavors.length || 1;
    const angleStep = 360 / numSlices;

    return (
      <div className="pizza-visualizer">
        <svg viewBox="0 0 240 240" width="240" height="240">
          <defs>
            {/* Calabresa Pattern */}
            <pattern id="pattern-calabresa" patternUnits="userSpaceOnUse" width="40" height="40">
              <circle cx="20" cy="20" r="18" fill="#E04A4A" />
              <circle cx="20" cy="20" r="12" fill="#C41C3B" />
              <circle cx="15" cy="15" r="3" fill="#A01630" opacity="0.3" />
            </pattern>
            {/* Frango Pattern */}
            <pattern id="pattern-frango" patternUnits="userSpaceOnUse" width="30" height="30">
              <path d="M5,5 L25,5 L15,25 Z" fill="#F2D06B" transform="rotate(15)" />
              <path d="M10,10 L20,10 L15,20 Z" fill="#D4AF37" transform="rotate(-20)" />
            </pattern>
            {/* Margherita Pattern */}
            <pattern id="pattern-margherita" patternUnits="userSpaceOnUse" width="50" height="50">
              <circle cx="25" cy="25" r="15" fill="#E63946" /> {/* Tomato */}
              <path d="M20,10 Q25,0 30,10 T40,10" fill="#4CAF50" /> {/* Basil */}
            </pattern>
            {/* Gloss Filter */}
            <filter id="gloss">
              <feSpecularLighting surfaceScale="5" specularConstant=".75" specularExponent="20" lightingColor="#white">
                <fePointLight x="-50" y="-50" z="300" />
              </feSpecularLighting>
            </filter>
          </defs>

          {/* Outer Crust Shadow */}
          <circle cx="120" cy="120" r="115" fill="rgba(0,0,0,0.1)" />
          
          {/* Main Crust */}
          <circle cx="120" cy="120" r="110" fill="#D49A6A" />
          <circle cx="120" cy="120" r="102" fill="#FDE6D2" />

          {/* Slices */}
          {selectedFlavors.length === 0 ? (
            <circle cx="120" cy="120" r="102" fill="#FDE6D2" opacity="0.5" stroke="#D49A6A" strokeWidth="1" strokeDasharray="5,5" />
          ) : (
            selectedFlavors.map((flavor, i) => {
              const startAngle = i * angleStep;
              const endAngle = (i + 1) * angleStep;
              
              const x1 = 120 + 102 * Math.cos((startAngle - 90) * Math.PI / 180);
              const y1 = 120 + 102 * Math.sin((startAngle - 90) * Math.PI / 180);
              const x2 = 120 + 102 * Math.cos((endAngle - 90) * Math.PI / 180);
              const y2 = 120 + 102 * Math.sin((endAngle - 90) * Math.PI / 180);
              
              const largeArcFlag = angleStep > 180 ? 1 : 0;
              const d = `M 120 120 L ${x1} ${y1} A 102 102 0 ${largeArcFlag} 1 ${x2} ${y2} Z`;

              let patternId = '';
              if (flavor.id === 'calabresa') patternId = 'url(#pattern-calabresa)';
              else if (flavor.id === 'frango') patternId = 'url(#pattern-frango)';
              else if (flavor.id === 'margherita') patternId = 'url(#pattern-margherita)';
              else patternId = '#F2D06B'; // Default cheese color

              return (
                <g key={flavor.id}>
                  <path d={d} fill={patternId} stroke="#D49A6A" strokeWidth="2" />
                  {/* Subtle cheese texture overlay */}
                  <path d={d} fill="white" opacity="0.1" />
                </g>
              );
            })
          )}

          {/* Slice dividers (visible if > 1 slice) */}
          {numSlices > 1 && selectedFlavors.length > 0 && Array.from({ length: numSlices }).map((_, i) => {
            const angle = i * angleStep;
            const x = 120 + 102 * Math.cos((angle - 90) * Math.PI / 180);
            const y = 120 + 102 * Math.sin((angle - 90) * Math.PI / 180);
            return <line key={i} x1="120" y1="120" x2={x} y2={y} stroke="#D49A6A" strokeWidth="2" />;
          })}
          
          <circle cx="120" cy="120" r="102" fill="none" stroke="rgba(255,255,255,0.2)" strokeWidth="4" />
        </svg>
      </div>
    );
  };

  return (
    <div className="page-container">
      <main className="main-section bg-white-block split-layout">
        <div className="split-left">
          <HeroSection 
            titleMedium={step === 1 ? "monte sua" : "escolha os"} 
            titleGiant={step === 1 ? "pizza!" : "sabores!"} 
            subtitle={step === 1 ? "escolha o tamanho perfeito" : `você pode escolher até ${selectedSize?.maxFlavors} sabores`} 
            showEyes={false} 
            showStackedLanches={false} 
          />
          
          {step === 2 && (
            <div className="pizza-summary-box">
              {renderPizzaChart()}
              <div className="summary-info">
                <p className="summary-size">{selectedSize?.name}</p>
                <p className="summary-price">R$ {selectedSize?.price.toFixed(2)}</p>
                <div className="selected-flavors-list">
                  {selectedFlavors.map(f => (
                    <span key={f.id} className="flavor-tag">{f.name}</span>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>

        <div className="split-right pizza-builder-content">
          {step === 1 ? (
            <div className="size-selection-grid">
              {PIZZA_SIZES.map(size => (
                <div key={size.id} className="size-card" onClick={() => handleSizeSelect(size)}>
                  <div className="size-info">
                    <h3>{size.name}</h3>
                    <p>Até {size.maxFlavors} {size.maxFlavors === 1 ? 'sabor' : 'sabores'}</p>
                  </div>
                  <div className="size-price-action">
                    <span className="price">R$ {size.price.toFixed(2)}</span>
                    <ChevronRight size={20} />
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="flavor-selection-container">
              <button className="back-btn" onClick={() => { setStep(1); setSelectedFlavors([]); }}>
                <ArrowLeft size={20} />
                <span>Mudar tamanho</span>
              </button>

              <div className="flavors-grid">
                {FLAVORS.map(flavor => {
                  const isSelected = selectedFlavors.find(f => f.id === flavor.id);
                  const isDisabled = !isSelected && selectedFlavors.length >= (selectedSize?.maxFlavors || 0);
                  
                  return (
                    <div 
                      key={flavor.id} 
                      className={`flavor-card ${isSelected ? 'selected' : ''} ${isDisabled ? 'disabled' : ''}`}
                      onClick={() => !isDisabled && toggleFlavor(flavor)}
                    >
                      <div className="flavor-emoji">{flavor.image}</div>
                      <div className="flavor-info">
                        <h4>{flavor.name}</h4>
                        <p>{flavor.description}</p>
                      </div>
                      {isSelected && <div className="selected-badge"><Check size={14} /></div>}
                    </div>
                  );
                })}
              </div>

              <div className="builder-footer">
                <button 
                  className={`btn-confirm-pizza ${selectedFlavors.length === 0 ? 'disabled' : ''}`}
                  disabled={selectedFlavors.length === 0}
                >
                  Adicionar ao Carrinho • R$ {selectedSize?.price.toFixed(2)}
                </button>
              </div>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
