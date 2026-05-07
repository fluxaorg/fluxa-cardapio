import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { useCompany } from '../context/CompanyContext';
import { useAuth } from '../context/AuthContext';
import { supabase } from '../lib/supabase';
import { Check } from 'lucide-react';
import './ProductDetail.css';
import './Checkout.css';

const PAYMENT_METHODS = [
  { id: 'pix',     label: 'Pix',              icon: '💸' },
  { id: 'credito', label: 'Cartão de Crédito', icon: '💳' },
  { id: 'debito',  label: 'Cartão de Débito',  icon: '💳' },
  { id: 'dinheiro',label: 'Dinheiro',          icon: '💵' },
];

export default function Checkout() {
  const { items, total, clearCart } = useCart();
  const { company } = useCompany();
  const { user } = useAuth();
  const navigate = useNavigate();
  const basePath = company?.slug ? `/${company.slug}` : '';

  const [selectedPayment, setSelectedPayment] = useState<string | null>(null);
  const [confirmed, setConfirmed] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');

  const deliveryFee = 10;
  const finalTotal = total + deliveryFee;

  const handleConfirm = async () => {
    if (!selectedPayment || items.length === 0 || !company?.id) return;
    setSaving(true);
    setError('');
    try {
      const orderNum = `#${Math.floor(Math.random() * 9000) + 1000}`;
      const orderItems = items.map(i => ({
        name: i.name,
        qty: i.qty,
        price: i.price,
        obs: i.description || '',
      }));

      const { data: order, error: orderErr } = await supabase
        .from('food_orders')
        .insert({
          company_id: company.id,
          order_number: orderNum,
          cliente_nome: user?.email?.split('@')[0] || 'Convidado',
          status: 'recebido',
          total: finalTotal,
          payment_method: selectedPayment,
          items: orderItems,
          order_source: 'cardapio-v9',
          tipo_pedido: 'delivery',
          user_id: user?.id || null,
        })
        .select()
        .single();

      if (orderErr) throw orderErr;

      if (order) {
        const itemInserts = items.map(i => ({
          order_id: order.id,
          menu_item_id: i.productId.startsWith('pizza-') ? null : i.productId,
          name: i.name,
          quantity: i.qty,
          unit_price: i.price,
          subtotal: i.price * i.qty,
        }));
        await supabase.from('food_order_items').insert(itemInserts);
      }

      setConfirmed(true);
      clearCart();
      setTimeout(() => navigate(`${basePath}/menu`), 3000);
    } catch (e: any) {
      setError('Erro ao confirmar pedido. Tente novamente.');
    } finally {
      setSaving(false);
    }
  };

  if (confirmed) {
    return (
      <div className="page-container" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: '60vh' }}>
        <div style={{ textAlign: 'center', padding: '40px' }}>
          <div style={{ width: 80, height: 80, background: 'var(--color-red)', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 24px' }}>
            <Check size={40} color="white" strokeWidth={3} />
          </div>
          <h2 style={{ fontSize: 32, fontWeight: 800, marginBottom: 8 }}>Pedido confirmado!</h2>
          <p style={{ color: 'var(--color-text-secondary)', fontSize: 16 }}>Seu pedido está sendo preparado. Redirecionando...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="page-container detail-layout">
      {/* Esquerda: resumo dos itens */}
      <main className="main-section bg-white-block detail-left">
        <div className="detail-header">
          <h1 className="detail-header-title" style={{ color: 'var(--color-black)', opacity: 1 }}>
            Resumo do pedido
          </h1>
        </div>

        {items.length === 0 ? (
          <div style={{ padding: '60px 0', textAlign: 'center', color: 'var(--color-text-secondary)' }}>
            <p style={{ fontSize: 18 }}>Seu carrinho está vazio.</p>
            <button
              style={{ marginTop: 16, background: 'var(--color-red)', color: 'white', padding: '12px 28px', borderRadius: 12, fontWeight: 700, fontSize: 15 }}
              onClick={() => navigate(`${basePath}/menu`)}
            >
              Ver Menu
            </button>
          </div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 12, marginTop: 8 }}>
            {items.map((item) => (
              <div key={item.id} className="sidebar-item" style={{ padding: '14px', background: '#fafafa', borderRadius: 14, border: '1px solid var(--color-border)' }}>
                {item.image_url ? (
                  <img src={item.image_url} alt={item.name} style={{ width: 64, height: 64, borderRadius: 10, objectFit: 'cover', flexShrink: 0 }} />
                ) : (
                  <div style={{ width: 64, height: 64, borderRadius: 10, background: '#f0f0f0', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 24, flexShrink: 0 }}>🍴</div>
                )}
                <div className="sidebar-item-info">
                  <span className="sidebar-item-name">{item.name}</span>
                  <span style={{ fontSize: 12, color: 'var(--color-text-secondary)', marginTop: 2 }}>Qtd: {item.qty}</span>
                </div>
                <span className="sidebar-item-price">R$ {(item.price * item.qty).toFixed(2)}</span>
              </div>
            ))}
          </div>
        )}
      </main>

      {/* Direita: pagamento */}
      <aside className="main-section bg-white-block detail-sidebar checkout-sidebar">
        <div className="sidebar-header">
          <div>
            <h2 className="sidebar-title">Meu pedido</h2>
            <p className="checkout-subtitle">Forma de pagamento</p>
          </div>
          <span className="sidebar-count">{items.length} {items.length === 1 ? 'Item' : 'Itens'}</span>
        </div>

        <div className="payment-methods-list">
          {PAYMENT_METHODS.map((pm) => (
            <button
              key={pm.id}
              className={`payment-method-btn ${selectedPayment === pm.id ? 'selected' : ''}`}
              onClick={() => setSelectedPayment(pm.id)}
            >
              <span className="pm-icon">{pm.icon}</span>
              <span className="pm-label">{pm.label}</span>
              {selectedPayment === pm.id && <Check size={16} className="pm-check" />}
            </button>
          ))}
        </div>

        <div className="sidebar-divider"></div>

        <div className="sidebar-summary">
          <div className="summary-row">
            <span>Subtotal</span>
            <span>R$ {total.toFixed(2)}</span>
          </div>
          <div className="summary-row">
            <span>Taxa de entrega</span>
            <span>R$ {deliveryFee.toFixed(2)}</span>
          </div>
          <div className="summary-row total-row">
            <span>Total</span>
            <span>R$ {finalTotal.toFixed(2)}</span>
          </div>
        </div>

        {error && <p style={{ color: 'var(--color-red)', fontSize: 13, textAlign: 'center', marginBottom: 8 }}>{error}</p>}

        <button
          className="sidebar-btn-confirm"
          onClick={handleConfirm}
          disabled={!selectedPayment || items.length === 0 || saving}
          style={{ opacity: (!selectedPayment || items.length === 0 || saving) ? 0.45 : 1 }}
        >
          {saving ? 'Confirmando...' : 'Confirmar pedido'}
        </button>
        {!selectedPayment && items.length > 0 && (
          <p style={{ textAlign: 'center', fontSize: 12, color: 'var(--color-text-secondary)', marginTop: 8 }}>
            Selecione uma forma de pagamento
          </p>
        )}
      </aside>
    </div>
  );
}
