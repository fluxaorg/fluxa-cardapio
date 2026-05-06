import { Link, useLocation } from 'react-router-dom';
import { Home, BookOpen, Pizza, Megaphone, User, Search, ShoppingBag } from 'lucide-react';
import './Navbar.css';

export default function Navbar() {
  const location = useLocation();

  const navItems = [
    { name: 'Início', path: '/', icon: Home },
    { name: 'Menu', path: '/menu', icon: BookOpen },
    { name: 'Pizzas', path: '/menu?category=pizzas', icon: Pizza },
    { name: 'Promoções', path: '/promocoes', icon: Megaphone },
    { name: 'Meu Perfil', path: '/perfil', icon: User },
  ];

  return (
    <nav className="navbar">
      <div className="navbar-container">
        {/* Left: Logo Block */}
        <Link to="/" className="navbar-logo-block">
          <div className="navbar-logo-inner">
            <Pizza size={20} color="white" />
            <span className="navbar-logo-text">Quioski Lanches</span>
          </div>
          <span className="navbar-logo-sub">by fluxa</span>
        </Link>

        {/* Center: Nav Links */}
        <div className="navbar-links">
          {navItems.map((item) => {
            const isActive = location.pathname === item.path || (item.path.includes('?') && location.search.includes('category=pizzas'));
            return (
              <Link
                key={item.name}
                to={item.path}
                className={`navbar-link ${isActive ? 'active' : ''}`}
              >
                <item.icon size={16} />
                <span>{item.name}</span>
              </Link>
            );
          })}
        </div>

        {/* Right: Actions */}
        <div className="navbar-actions">
          <button className="navbar-search" aria-label="Search">
            <Search size={22} />
          </button>
          <button className="navbar-cart">
            <ShoppingBag size={16} color="white" />
            <span>Carrinho</span>
          </button>
        </div>
      </div>
    </nav>
  );
}
