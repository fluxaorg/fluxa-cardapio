import { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate, useSearchParams } from 'react-router-dom';
import { Home, BookOpen, Pizza, Megaphone, User, Search, ShoppingBag, X, ClipboardList } from 'lucide-react';
import { useCompany } from '../context/CompanyContext';
import { useCart } from '../context/CartContext';
import { useMesa } from '../context/MesaContext';
import { useBasePath } from '../hooks/useBasePath';
import './Navbar.css';

export default function Navbar() {
  const location = useLocation();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { company } = useCompany();
  const { items, setIsOpen } = useCart();
  const { isMesaMode, mesaNumber } = useMesa();
  const basePath = useBasePath();
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState(searchParams.get('q') || '');

  useEffect(() => {
    const q = searchParams.get('q') || '';
    setSearchQuery(q);
    if (q) setIsSearchOpen(true);
  }, [searchParams]);

  const navItems = [
    { name: 'Início', path: `${basePath}/`, icon: Home },
    { name: 'Menu', path: `${basePath}/menu`, icon: BookOpen },
    { name: 'Pizzas', path: `${basePath}/pizzas`, icon: Pizza },
    ...(!isMesaMode ? [
      { name: 'Promoções', path: `${basePath}/promocoes`, icon: Megaphone },
      { name: 'Meu Perfil', path: `${basePath}/perfil`, icon: User },
    ] : [
      { name: 'Comanda', path: `${basePath}/comanda`, icon: ClipboardList },
    ]),
  ];

  const handleSearchChange = (val: string) => {
    setSearchQuery(val);
    const target = `${basePath}/menu${val.trim() ? `?q=${encodeURIComponent(val.trim())}` : ''}`;
    navigate(target, { replace: true });
  };

  const handleSearchToggle = () => {
    if (isSearchOpen && searchQuery) {
      setSearchQuery('');
      navigate(`${basePath}/menu`, { replace: true });
    }
    setIsSearchOpen(!isSearchOpen);
  };

  return (
    <nav className="navbar">
      <div className="navbar-container">
        {/* Logo */}
        <Link to={`${basePath}/`} className="navbar-logo-block">
          <div className="navbar-logo-inner">
            {company?.logo_url ? (
              <img src={company.logo_url} alt="Logo" style={{ width: '24px', height: '24px', objectFit: 'cover', borderRadius: '4px' }} />
            ) : (
              <Pizza size={24} color="black" />
            )}
            <span className="navbar-logo-text">{company?.name || 'Quiosque Lanches'}</span>
          </div>
          <span className="navbar-logo-sub">by fluxa</span>
        </Link>

        {/* Mesa badge */}
        {isMesaMode && (
          <div style={{ background: 'rgba(217,30,54,0.1)', border: '1.5px solid var(--color-red)', borderRadius: 10, padding: '4px 12px', fontSize: 13, fontWeight: 800, color: 'var(--color-red)', flexShrink: 0 }}>
            Mesa {mesaNumber}
          </div>
        )}

        {/* Nav Links */}
        <div className="navbar-links">
          {navItems.map((item) => {
            const isActive = location.pathname === item.path ||
              (item.path.endsWith('/menu') && location.pathname.endsWith('/menu'));
            return (
              <Link key={item.name} to={item.path} className={`navbar-link ${isActive ? 'active' : ''}`}>
                <item.icon size={16} />
                <span>{item.name}</span>
              </Link>
            );
          })}
        </div>

        {/* Actions */}
        <div className="navbar-actions">
          {!isMesaMode && (
            <>
              <div className={`navbar-search-wrapper ${isSearchOpen ? 'open' : ''}`}>
                <input
                  type="text"
                  placeholder="Buscar no cardápio..."
                  className="navbar-search-input"
                  value={searchQuery}
                  onChange={(e) => handleSearchChange(e.target.value)}
                  autoFocus={isSearchOpen}
                />
              </div>
              <button className="navbar-search" aria-label="Search" onClick={handleSearchToggle}>
                {isSearchOpen && searchQuery ? <X size={22} /> : <Search size={22} />}
              </button>
            </>
          )}
          <button className="navbar-cart" onClick={() => setIsOpen(true)}>
            <ShoppingBag size={16} color="white" />
            <span>{isMesaMode ? 'Pedido' : 'Carrinho'}</span>
            {items.length > 0 && <span className="cart-badge">{items.length}</span>}
          </button>
        </div>
      </div>
    </nav>
  );
}
