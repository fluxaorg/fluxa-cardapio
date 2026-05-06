
import HeroSection from '../components/HeroSection';
import './Login.css';

export default function Login() {
  return (
    <div className="page-container">
      <main className="main-section bg-white-block split-layout">
        <div className="split-left">
          <HeroSection
            titleMedium="faaala"
            titleGiant="fulano!"
            subtitle="faz teu login aí, bora pedir!"
            showEyes={true}
          />
        </div>
        
        <div className="split-right login-right-col">
          <div className="login-card">
            <div className="login-icon-wrapper">
              <div className="login-icon-circle">
                <span className="login-icon-f">F</span>
              </div>
            </div>

            <div className="login-section">
              <h3 className="login-title">Entrar</h3>
              <p className="login-subtitle">é bom te ver de volta!</p>
              <input type="email" placeholder="Email" className="login-input" />
              <input type="password" placeholder="Senha" className="login-input" />
            </div>

            <div className="login-divider"></div>

            <div className="login-section">
              <h3 className="login-title">Cadastrar</h3>
              <p className="login-subtitle">nesse caso... Prazer!</p>
              <input type="email" placeholder="Email" className="login-input" />
              <input type="password" placeholder="Senha" className="login-input" />
            </div>

            <button className="login-btn-submit">Booooooora pedir!</button>
          </div>
        </div>
      </main>
    </div>
  );
}
