import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useCompany } from '../context/CompanyContext';
import HeroSection from '../components/HeroSection';
import './Login.css';

export default function Login() {
  const { signInWithEmail, signUpWithEmail } = useAuth();
  const { company } = useCompany();
  const navigate = useNavigate();
  const basePath = company?.slug ? `/${company.slug}` : '';

  const [loginEmail, setLoginEmail] = useState('');
  const [loginPassword, setLoginPassword] = useState('');
  const [signupEmail, setSignupEmail] = useState('');
  const [signupPassword, setSignupPassword] = useState('');
  const [loadingLogin, setLoadingLogin] = useState(false);
  const [loadingSignup, setLoadingSignup] = useState(false);
  const [errorLogin, setErrorLogin] = useState('');
  const [errorSignup, setErrorSignup] = useState('');

  const handleLogin = async () => {
    if (!loginEmail || !loginPassword) return;
    setLoadingLogin(true);
    setErrorLogin('');
    try {
      await signInWithEmail(loginEmail, loginPassword);
      navigate(`${basePath}/perfil`);
    } catch (err: any) {
      setErrorLogin(err.message || 'Email ou senha incorretos.');
    } finally {
      setLoadingLogin(false);
    }
  };

  const handleSignup = async () => {
    if (!signupEmail || !signupPassword) return;
    setLoadingSignup(true);
    setErrorSignup('');
    try {
      await signUpWithEmail(signupEmail, signupPassword);
      navigate(`${basePath}/perfil`);
    } catch (err: any) {
      setErrorSignup(err.message || 'Erro ao cadastrar. Tente novamente.');
    } finally {
      setLoadingSignup(false);
    }
  };

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

            {/* Entrar */}
            <div className="login-section">
              <h3 className="login-title">Entrar</h3>
              <p className="login-subtitle">é bom te ver de volta!</p>
              <input
                type="email"
                placeholder="Email"
                className="login-input"
                value={loginEmail}
                onChange={(e) => setLoginEmail(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleLogin()}
              />
              <input
                type="password"
                placeholder="Senha"
                className="login-input"
                value={loginPassword}
                onChange={(e) => setLoginPassword(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleLogin()}
              />
              {errorLogin && <p className="login-error">{errorLogin}</p>}
              <button
                className="login-btn-section"
                onClick={handleLogin}
                disabled={loadingLogin}
              >
                {loadingLogin ? 'Entrando...' : 'Entrar'}
              </button>
            </div>

            <div className="login-divider"></div>

            {/* Cadastrar */}
            <div className="login-section">
              <h3 className="login-title">Cadastrar</h3>
              <p className="login-subtitle">nesse caso... Prazer!</p>
              <input
                type="email"
                placeholder="Email"
                className="login-input"
                value={signupEmail}
                onChange={(e) => setSignupEmail(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleSignup()}
              />
              <input
                type="password"
                placeholder="Senha"
                className="login-input"
                value={signupPassword}
                onChange={(e) => setSignupPassword(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleSignup()}
              />
              {errorSignup && <p className="login-error">{errorSignup}</p>}
              <button
                className="login-btn-submit"
                onClick={handleSignup}
                disabled={loadingSignup}
              >
                {loadingSignup ? 'Cadastrando...' : 'Booooooora pedir!'}
              </button>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
