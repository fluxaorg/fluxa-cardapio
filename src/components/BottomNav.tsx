"use client";
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Home, BookOpen, Pizza, ShoppingBag, User } from 'lucide-react';
import { useCart } from '@/context/CartContext';
import { useMesa } from '@/context/MesaContext';
import { useBasePath } from '@/hooks/useBasePath';
import './BottomNav.css';

export default function BottomNav() {
  const pathname = usePathname();
  const { items, setIsOpen } = useCart();
  const { isMesaMode } = useMesa();
  const basePath = useBasePath();

  const navItems = [
    { name: 'Início',  path: `${basePath}/`,       icon: Home },
    { name: 'Menu',    path: `${basePath}/menu`,    icon: BookOpen },
    { name: 'Pizzas',  path: `${basePath}/pizzas`,  icon: Pizza },
    { name: isMesaMode ? 'Comanda' : 'Perfil',
      path: `${basePath}/${isMesaMode ? 'comanda' : 'perfil'}`,
      icon: User },
  ];

  return (
    <nav className="bottom-nav">
      {navItems.map((item) => {
        const isActive = pathname === item.path ||
          (item.path.endsWith('/menu') && pathname.endsWith('/menu'));
        return (
          <Link key={item.name} href={item.path} className={`bottom-nav-item ${isActive ? 'active' : ''}`}>
            <item.icon size={22} />
            <span>{item.name}</span>
          </Link>
        );
      })}
      <button className="bottom-nav-item bottom-nav-cart" onClick={() => setIsOpen(true)}>
        <div style={{ position: 'relative' }}>
          <ShoppingBag size={22} />
          {items.length > 0 && <span className="bottom-cart-badge">{items.length}</span>}
        </div>
        <span>Carrinho</span>
      </button>
    </nav>
  );
}
