import HeroSection from '../components/HeroSection';

export default function Promocoes() {
  return (
    <div className="page-container">
      <main className="main-section bg-white-block split-layout">
        <div className="split-left">
          <HeroSection 
            titleMedium="nossas" 
            titleGiant="promoções!" 
            subtitle="aproveite enquanto durar" 
            showEyes={false} 
          />
        </div>
        <div className="split-right">
          <div style={{padding: '40px'}}>
            <h2>Aba de promoções em breve...</h2>
          </div>
        </div>
      </main>
    </div>
  );
}
