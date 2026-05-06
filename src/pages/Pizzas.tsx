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
  color: string;
  pattern?: string;
}

const PIZZA_SIZES: PizzaSize[] = [
  { id: 'broto', name: 'Pizza Broto', price: 46, maxFlavors: 1 },
  { id: 'pequena', name: 'Pizza Pequena', price: 61, maxFlavors: 2 },
  { id: 'media', name: 'Pizza Média', price: 75, maxFlavors: 3 },
  { id: 'grande', name: 'Pizza Grande', price: 85, maxFlavors: 4 },
  { id: 'gigante', name: 'PIZZA GIGANTE', price: 105, maxFlavors: 4 },
];

const FLAVORS: Flavor[] = [
  { id: 'calabresa', name: 'Calabresa', description: 'Molho de tomate, mussarela, calabresa e cebola.', color: '#C41C3B', pattern: 'calabresa' },
  { id: 'frango', name: 'Frango Catupiry', description: 'Molho de tomate, mussarela, frango desfiado e catupiry.', color: '#F2D06B', pattern: 'frango' },
  { id: 'margherita', name: 'Margherita', description: 'Molho de tomate, mussarela, manjericão fresco e tomate.', color: '#4CAF50', pattern: 'margherita' },
  { id: '4queijos', name: '4 Queijos', description: 'Mussarela, catupiry, provolone e parmesão.', color: '#FFD700', pattern: 'cheese' },
  { id: 'portuguesa', name: 'Portuguesa', description: 'Mussarela, presunto, ovos, cebola, ervilha e azeitona.', color: '#FFA500', pattern: 'portuguesa' },
  { id: 'bacon', name: 'Bacon', description: 'Mussarela, bacon crocante e cebola.', color: '#8B4513', pattern: 'bacon' },
  { id: 'pepperoni', name: 'Pepperoni', description: 'Mussarela, fatias de pepperoni e orégano.', color: '#FF0000', pattern: 'pepperoni' },
  { id: 'vegetariana', name: 'Vegetariana', description: 'Brócolis, milho, ervilha e palmito.', color: '#228B22', pattern: 'vegetariana' },
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
      <div className="pizza-visualizer-container">
        <svg viewBox="0 0 240 240" width="220" height="220" className="pizza-svg">
          <defs>
            <pattern id="pattern-calabresa" patternUnits="userSpaceOnUse" width="40" height="40">
              <circle cx="20" cy="20" r="18" fill="#E04A4A" />
              <circle cx="20" cy="20" r="12" fill="#C41C3B" />
            </pattern>
            <pattern id="pattern-frango" patternUnits="userSpaceOnUse" width="30" height="30">
              <path d="M5,5 L25,5 L15,25 Z" fill="#F2D06B" />
            </pattern>
            <pattern id="pattern-margherita" patternUnits="userSpaceOnUse" width="50" height="50">
              <circle cx="25" cy="25" r="12" fill="#E63946" />
              <circle cx="10" cy="10" r="5" fill="#4CAF50" />
            </pattern>
            <pattern id="pattern-pepperoni" patternUnits="userSpaceOnUse" width="40" height="40">
              <circle cx="20" cy="20" r="15" fill="#FF4D4D" />
              <circle cx="20" cy="20" r="13" fill="#D63031" />
            </pattern>
          </defs>

          {/* Crust */}
          <circle cx="120" cy="120" r="110" fill="#D49A6A" />
          <circle cx="120" cy="120" r="102" fill="#FDE6D2" />

          {/* Slices */}
          {selectedFlavors.length === 0 ? (
            <circle cx="120" cy="120" r="102" fill="#FDE6D2" opacity="0.4" />
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

              return (
                <path 
                  key={flavor.id} 
                  d={d} 
                  fill={flavor.pattern ? `url(#pattern-${flavor.pattern})` : flavor.color} 
                  stroke="#D49A6A" 
                  strokeWidth="1.5" 
                />
              );
            })
          )}

          {/* Slice lines */}
          {numSlices > 1 && selectedFlavors.length > 0 && Array.from({ length: numSlices }).map((_, i) => {
            const angle = i * angleStep;
            const x = 120 + 102 * Math.cos((angle - 90) * Math.PI / 180);
            const y = 120 + 102 * Math.sin((angle - 90) * Math.PI / 180);
            return <line key={i} x1="120" y1="120" x2={x} y2={y} stroke="#D49A6A" strokeWidth="1" />;
          })}
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
          />
          
          {step === 2 && (
            <div className="pizza-visual-preview hide-mobile">
              {renderPizzaChart()}
            </div>
          )}
        </div>

        <div className="split-right pizza-builder-panel">
          {step === 1 ? (
            <div className="size-list">
              {PIZZA_SIZES.map(size => (
                <div key={size.id} className="size-row-card" onClick={() => handleSizeSelect(size)}>
                  <div className="size-main-info">
                    <h3>{size.name}</h3>
                    <p>Até {size.maxFlavors} sabores</p>
                  </div>
                  <div className="size-right-info">
                    <span className="size-price">R$ {size.price.toFixed(2)}</span>
                    <ChevronRight size={20} />
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="builder-step-2">
              <div className="builder-header-sticky">
                <button className="back-link" onClick={() => { setStep(1); setSelectedFlavors([]); }}>
                  <ArrowLeft size={18} />
                  <span>Mudar tamanho</span>
                </button>
                <div className="builder-pizza-mobile show-mobile">
                   {renderPizzaChart()}
                </div>
              </div>

              <div className="flavors-selection-grid">
                {FLAVORS.map(flavor => {
                  const isSelected = selectedFlavors.find(f => f.id === flavor.id);
                  const isDisabled = !isSelected && selectedFlavors.length >= (selectedSize?.maxFlavors || 0);
                  
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
              </div>

              <div className="builder-action-bar">
                <button 
                  className={`btn-add-cart ${selectedFlavors.length === 0 ? 'inactive' : ''}`}
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
