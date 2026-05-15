"use client";
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import { useCompany } from '@/context/CompanyContext';
import HeroSection from '@/components/HeroSection';
import './Login.css';

export default function Login() {
  const { signInWithEmail, signUpWithEmail } = useAuth();
  const { company } = useCompany();
  const router = useRouter();
  const basePath = company?.slug ? `/${company.slug}` : '';

  const [mode, setMode] = useState<'login' | 'signup'>('login');

  const [loginEmail, setLoginEmail] = useState('');
  const [loginPassword, setLoginPassword] = useState('');
  const [signupEmail, setSignupEmail] = useState('');
  const [signupPassword, setSignupPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleLogin = async () => {
    if (!loginEmail || !loginPassword) return;
    setLoading(true); setError('');
    try {
      await signInWithEmail(loginEmail, loginPassword);
      router.push(`${basePath}/perfil`);
    } catch (err: any) {
      setError(err.message || 'Email ou senha incorretos.');
    } finally { setLoading(false); }
  };

  const handleSignup = async () => {
    if (!signupEmail || !signupPassword) return;
    setLoading(true); setError('');
    try {
      await signUpWithEmail(signupEmail, signupPassword);
      router.push(`${basePath}/perfil`);
    } catch (err: any) {
      setError(err.message || 'Erro ao cadastrar.');
    } finally { setLoading(false); }
  };

  const switchMode = (next: 'login' | 'signup') => {
    setMode(next);
    setError('');
  };

  return (
    <div className="page-container">
      <header className="mobile-page-header">
        <h1 className="mobile-page-title">
          {mode === 'login' ? 'Entrar' : 'Cadastrar'}
          <span className="mobile-page-subtitle">
            {mode === 'login' ? 'é bom te ver de volta!' : 'nesse caso… prazer!'}
          </span>
        </h1>
      </header>

      <main className="main-section bg-white-block split-layout login-page">
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

            {mode === 'login' ? (
              /* ── Entrar ── */
              <div className="login-section">
                <h3 className="login-title">Entrar</h3>
                <p className="login-subtitle">é bom te ver de volta!</p>
                <input type="email" placeholder="Email" className="login-input"
                  value={loginEmail} onChange={e => setLoginEmail(e.target.value)}
                  onKeyDown={e => e.key === 'Enter' && handleLogin()} />
                <input type="password" placeholder="Senha" className="login-input"
                  value={loginPassword} onChange={e => setLoginPassword(e.target.value)}
                  onKeyDown={e => e.key === 'Enter' && handleLogin()} />
                {error && <p className="login-error">{error}</p>}
                <button className="login-btn-section" onClick={handleLogin} disabled={loading}>
                  {loading ? 'Entrando...' : 'Entrar'}
                </button>
                <p className="login-switch">
                  Não tem cadastro?{' '}
                  <button className="login-switch-btn" onClick={() => switchMode('signup')}>
                    Cadastre-se
                  </button>
                </p>
              </div>
            ) : (
              /* ── Cadastrar ── */
              <div className="login-section">
                <h3 className="login-title">Cadastrar</h3>
                <p className="login-subtitle">nesse caso... Prazer!</p>
                <input type="email" placeholder="Email" className="login-input"
                  value={signupEmail} onChange={e => setSignupEmail(e.target.value)}
                  onKeyDown={e => e.key === 'Enter' && handleSignup()} />
                <input type="password" placeholder="Senha" className="login-input"
                  value={signupPassword} onChange={e => setSignupPassword(e.target.value)}
                  onKeyDown={e => e.key === 'Enter' && handleSignup()} />
                {error && <p className="login-error">{error}</p>}
                <button className="login-btn-submit" onClick={handleSignup} disabled={loading}>
                  {loading ? 'Cadastrando...' : 'Booooooora pedir!'}
                </button>
                <p className="login-switch">
                  Já tem conta?{' '}
                  <button className="login-switch-btn" onClick={() => switchMode('login')}>
                    Entrar
                  </button>
                </p>
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}
