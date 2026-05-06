
import HeroSection from '../components/HeroSection';
import './Profile.css';

export default function Profile() {
  return (
    <div className="page-container">
      <main className="main-section bg-white-block split-layout">
        <div className="split-left">
          <HeroSection
            titleMedium="oláaaa"
            titleGiant="fulano!"
            subtitle="o que manda hoje? me conta ai..."
            showEyes={true}
            showStackedLanches={false}
          />
        </div>
        
        <div className="split-right">
          <div className="profile-bento-grid">
            {/* Top Left: Endereços */}
            <div className="bento-card card-enderecos">
              <div className="enderecos-text">
                <span className="syl">en</span>
                <span className="syl">de</span>
                <span className="syl">re</span>
                <span className="syl">ços</span>
                <span className="enderecos-hint">confirma<br/>certinho né!</span>
              </div>
            </div>

            {/* Top Right: Pedidos recentes & Logout */}
            <div className="bento-card-group-top-right">
              <div className="bento-card card-recentes">
                <div className="card-recentes-content">
                  <span className="recentes-line1">pedidos</span>
                  <span className="recentes-line2">recentes</span>
                  <span className="recentes-hint">peça dnv...</span>
                </div>
              </div>
              
              <div className="bento-card card-logout">
                <div className="card-logout-content">
                  <span className="logout-title">Logout</span>
                  <span className="logout-hint">ja vai?</span>
                </div>
              </div>
            </div>

            {/* Bottom Left: Meus Cupons */}
            <div className="bento-card card-cupons">
              <div className="card-cupons-content">
                <span className="cupons-line1">Meus</span>
                <span className="cupons-line2">Cupons</span>
                <span className="cupons-hint">vai um desconto aí?</span>
              </div>
            </div>

            {/* Bottom Right: Meus Pedidos */}
            <div className="bento-card card-pedidos">
              <div className="card-pedidos-content">
                <span className="pedidos-line1">Meus</span>
                <span className="pedidos-line2">Pedidos</span>
                <span className="pedidos-hint">acompanhe seus pedidos.</span>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
