
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
            showStackedLanches={true}
          />
        </div>
        
        <div className="split-right">
          <div className="home-bento-grid">
            {/* Top row */}
            <div className="bento-col-left">
              <div className="bento-placeholder img-large" style={{ backgroundColor: '#F0EFEF', borderRadius: '24px', width: '100%', height: '100%' }}></div>
            </div>
            <div className="bento-col-right">
              <div className="bento-placeholder img-small" style={{ backgroundColor: '#F0EFEF', borderRadius: '24px', width: '100%', height: '100%' }}></div>
              <div className="bento-placeholder img-small" style={{ backgroundColor: '#F0EFEF', borderRadius: '24px', width: '100%', height: '100%' }}></div>
            </div>
            
            {/* Bottom row */}
            <div className="bento-col-left-bottom">
              <div className="bento-placeholder img-med-vert" style={{ backgroundColor: '#F0EFEF', borderRadius: '24px', width: '100%', height: '100%' }}></div>
            </div>
            <div className="bento-col-right-bottom">
              <div className="bento-placeholder img-med-horiz" style={{ backgroundColor: '#F0EFEF', borderRadius: '24px', width: '100%', height: '100%' }}></div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
