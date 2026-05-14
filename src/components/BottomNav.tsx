"use client";
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { House, UtensilsCrossed, Pizza, ShoppingBag, User, ClipboardList } from 'lucide-react';
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
    {
      name: 'Início',
      path: `${basePath}/`,
      icon: House,
      matchFn: (p: string) => p === basePath || p === `${basePath}/`,
    },
    {
      name: 'Menu',
      path: `${basePath}/menu`,
      icon: UtensilsCrossed,
      matchFn: (p: string) => p.endsWith('/menu'),
    },
    {
      name: 'Pizzas',
      path: `${basePath}/pizzas`,
      icon: Pizza,
      matchFn: (p: string) => p.endsWith('/pizzas'),
    },
    {
      name: isMesaMode ? 'Comanda' : 'Perfil',
      path: `${basePath}/${isMesaMode ? 'comanda' : 'perfil'}`,
      icon: isMesaMode ? ClipboardList : User,
      matchFn: (p: string) => p.endsWith('/comanda') || p.endsWith('/perfil'),
    },
  ];

  return (
    <nav className="bottom-nav" role="tablist" aria-label="Navegação principal">
      {navItems.map((item) => {
        const isActive = item.matchFn(pathname);
        const Icon = item.icon;
        return (
          <Link
            key={item.name}
            href={item.path}
            role="tab"
            aria-selected={isActive}
            aria-label={item.name}
            className={`bottom-nav-item ${isActive ? 'active' : ''}`}
          >
            <Icon
              size={24}
              strokeWidth={isActive ? 2.2 : 1.6}
              aria-hidden="true"
            />
            <span>{item.name}</span>
          </Link>
        );
      })}

      {/* Cart button — always last */}
      <button
        className={`bottom-nav-item bottom-nav-cart ${items.length > 0 ? 'active' : ''}`}
        onClick={() => setIsOpen(true)}
        role="tab"
        aria-label={`Carrinho${items.length > 0 ? ` — ${items.length} ${items.length === 1 ? 'item' : 'itens'}` : ' vazio'}`}
        aria-haspopup="dialog"
      >
        <div>
          <ShoppingBag
            size={24}
            strokeWidth={items.length > 0 ? 2.2 : 1.6}
            aria-hidden="true"
          />
          {items.length > 0 && (
            <span className="bottom-cart-badge" aria-hidden="true">
              {items.length > 9 ? '9+' : items.length}
            </span>
          )}
        </div>
        <span>Carrinho</span>
      </button>
    </nav>
  );
}
