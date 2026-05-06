
import HeroSection from '../components/HeroSection';
import './Home.css';

export default function Home() {
  return (
    <div className="page-container">
      <main className="main-section split-layout">
        <div className="split-left">
          <HeroSection
            topLabel="Bem vindo ao cardápio!"
            titleMedium="Faça seu"
            titleGiant="pedido!"
            subtitle="Escolha seu pedido, e receba em minutos!"
            showUnderline={true}
            showStackedLanches={true}
          />
        </div>
        
        <div className="split-right">
          <div className="home-bento-grid">
            {/* Top row */}
            <div className="bento-col-left">
              <img src="https://images.unsplash.com/photo-1513104890138-7c749659a591?w=800&q=80" alt="Pizza" className="bento-img img-large" />
            </div>
            <div className="bento-col-right">
              <img src="https://images.unsplash.com/photo-1576107232684-1279f3908594?w=400&q=80" alt="Fries" className="bento-img img-small" />
              <img src="https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=400&q=80" alt="Burger" className="bento-img img-small" />
            </div>
            
            {/* Bottom row */}
            <div className="bento-col-left-bottom">
              <img src="https://images.unsplash.com/photo-1622483767028-3f66f32aef97?w=400&q=80" alt="Soda" className="bento-img img-med-vert" />
            </div>
            <div className="bento-col-right-bottom">
              <img src="https://images.unsplash.com/photo-1632712852654-e054413b91c8?w=800&q=80" alt="Cheese" className="bento-img img-med-horiz" />
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
