import { useState } from 'react';
import HeroSection from '../components/HeroSection';
import './Profile.css';
import { ArrowLeft } from 'lucide-react';

type ProfileTab = 'home' | 'enderecos' | 'recentes' | 'cupons' | 'pedidos';

export default function Profile() {
  const [activeTab, setActiveTab] = useState<ProfileTab>('home');

  const getHeroTitles = () => {
    switch (activeTab) {
      case 'enderecos':
        return { small: 'meus', large: 'endereços', sub: 'gerencie seus locais de entrega' };
      case 'recentes':
        return { small: 'pedidos', large: 'recentes', sub: 'peça novamente rapidinho' };
      case 'cupons':
        return { small: 'meus', large: 'cupons', sub: 'seus descontos salvos' };
      case 'pedidos':
        return { small: 'meus', large: 'pedidos', sub: 'acompanhe o histórico' };
      default:
        return { small: 'oláaaa', large: 'fulano!', sub: 'o que manda hoje? me conta ai...' };
    }
  };

  const heroTitles = getHeroTitles();

  return (
    <div className="page-container">
      <main className="main-section bg-white-block split-layout">
        <div className="split-left">
          <HeroSection
            titleMedium={heroTitles.small}
            titleGiant={heroTitles.large}
            subtitle={heroTitles.sub}
            showEyes={activeTab === 'home'}
            showStackedLanches={false}
          />
        </div>
        
        <div className="split-right profile-right-panel">
          {activeTab !== 'home' && (
            <button className="back-btn" onClick={() => setActiveTab('home')}>
              <ArrowLeft size={24} />
              <span>Voltar</span>
            </button>
          )}

          {activeTab === 'home' ? (
            <div className="profile-bento-grid">
              {/* Top Left: Endereços */}
              <div className="bento-card card-enderecos" onClick={() => setActiveTab('enderecos')}>
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
                <div className="bento-card card-recentes" onClick={() => setActiveTab('recentes')}>
                  <div className="card-recentes-content">
                    <span className="recentes-line1">pedidos</span>
                    <span className="recentes-line2">recentes</span>
                    <span className="recentes-hint">peça dnv...</span>
                  </div>
                </div>
                
                <div className="bento-card card-logout" onClick={() => console.log('Logout clicked')}>
                  <div className="card-logout-content">
                    <span className="logout-title">Logout</span>
                    <span className="logout-hint">ja vai?</span>
                  </div>
                </div>
              </div>

              {/* Bottom Left: Meus Cupons */}
              <div className="bento-card card-cupons" onClick={() => setActiveTab('cupons')}>
                <div className="card-cupons-content">
                  <span className="cupons-line1">Meus</span>
                  <span className="cupons-line2">Cupons</span>
                  <span className="cupons-hint">vai um desconto aí?</span>
                </div>
              </div>

              {/* Bottom Right: Meus Pedidos */}
              <div className="bento-card card-pedidos" onClick={() => setActiveTab('pedidos')}>
                <div className="card-pedidos-content">
                  <span className="pedidos-line1">Meus</span>
                  <span className="pedidos-line2">Pedidos</span>
                  <span className="pedidos-hint">acompanhe seus pedidos.</span>
                </div>
              </div>
            </div>
          ) : (
            <div className="profile-tab-content">
              <h2>Conteúdo em breve...</h2>
              <p>Esta área está em desenvolvimento.</p>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
