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
    const max = selectedSize?.maxFlavors || 1;
    const slices = [];
    const angleStep = 360 / max;

    for (let i = 0; i < max; i++) {
      const startAngle = i * angleStep;
      const endAngle = (i + 1) * angleStep;
      const flavor = selectedFlavors[i];
      
      // Calculate path for circular slice
      const radius = 100;
      const x1 = 100 + radius * Math.cos((startAngle - 90) * Math.PI / 180);
      const y1 = 100 + radius * Math.sin((startAngle - 90) * Math.PI / 180);
      const x2 = 100 + radius * Math.cos((endAngle - 90) * Math.PI / 180);
      const y2 = 100 + radius * Math.sin((endAngle - 90) * Math.PI / 180);
      
      const largeArcFlag = angleStep > 180 ? 1 : 0;
      
      const d = `M 100 100 L ${x1} ${y1} A ${radius} ${radius} 0 ${largeArcFlag} 1 ${x2} ${y2} Z`;
      
      slices.push(
        <path 
          key={i} 
          d={d} 
          fill={flavor ? '#C41C3B' : '#F0EFEF'} 
          stroke="white" 
          strokeWidth="2"
          className="pizza-slice"
          style={{ opacity: flavor ? 1 : 0.5 }}
        />
      );
    }

    return (
      <div className="pizza-visualizer">
        <svg viewBox="0 0 200 200" width="200" height="200">
          <circle cx="100" cy="100" r="105" fill="#E5E5E5" /> {/* Border/Crust */}
          {slices}
          <circle cx="100" cy="100" r="5" fill="white" /> {/* Center hole */}
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
