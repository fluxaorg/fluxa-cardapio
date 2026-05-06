import HeroSection from '../components/HeroSection';

export default function Pizzas() {
  return (
    <div className="page-container">
      <main className="main-section bg-white-block split-layout">
        <div className="split-left">
          <HeroSection 
            titleMedium="monte" 
            titleGiant="sua pizza!" 
            subtitle="escolha até 4 sabores" 
            showEyes={false} 
            showStackedLanches={false} 
          />
        </div>
        <div className="split-right">
          <div style={{padding: '40px'}}>
            <h2>Construtor de Pizzas em breve...</h2>
          </div>
        </div>
      </main>
    </div>
  );
}
