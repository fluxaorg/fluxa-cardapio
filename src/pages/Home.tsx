
import HeroSection from '../components/HeroSection';
import './Home.css';

export default function Home() {
  return (
    <div className="page-container">
      <main className="main-section bg-white-block split-layout">
        <div className="split-left">
          <HeroSection
            topLabel="Bem vindo ao cardápio!"
            titleMedium="Faça seu"
            titleGiant="pedido!"
            subtitle="Escolha seu pedido, e receba em minutos!"
            showUnderline={true}
            showLanches={true}
          />
        </div>
        
        <div className="split-right">
          <div className="home-bento-grid">
            {/* Top Left: Pizza (Large Vertical) */}
            <div className="bento-item bento-pizza">
              <img src="https://images.unsplash.com/photo-1513104890138-7c749659a591?q=80&w=500" alt="Pizza" />
              <div className="bento-badge">PIZZAS</div>
            </div>

            <div className="bento-item bento-fries">
              <img src="https://images.unsplash.com/photo-1573080496219-bb080dd4f877?q=80&w=500" alt="Fries" />
              <div className="bento-badge">BATATAS</div>
            </div>
            <div className="bento-item bento-burger">
              <img src="https://images.unsplash.com/photo-1568901346375-23c9450c58cd?q=80&w=500" alt="Lanches" />
              <div className="bento-badge">LANCHES</div>
            </div>
            
            {/* Bottom Left: Coca-Cola */}
            <div className="bento-item bento-coke">
              <img src="https://images.unsplash.com/photo-1622483767028-3f66f32aef97?q=80&w=500" alt="Coke" />
              <div className="bento-badge">BEBIDAS</div>
            </div>

            {/* Bottom Right: Mozzarella Sticks */}
            <div className="bento-item bento-sticks">
              <img src="https://images.unsplash.com/photo-1531496681078-2742ed47fbc8?q=80&w=500" alt="Sticks" />
              <div className="bento-badge">PROMOÇÕES</div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
