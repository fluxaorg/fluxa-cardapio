"use client";
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useCart } from '@/context/CartContext';
import { useCompany } from '@/context/CompanyContext';
import { useAuth } from '@/context/AuthContext';
import { useMesa } from '@/context/MesaContext';
import { useBasePath } from '@/hooks/useBasePath';
import { supabase } from '@/lib/supabase';
import { Check, MapPin } from 'lucide-react';
import HeroSection from '@/components/HeroSection';
import './ProductDetail.css';
import './Checkout.css';

const PAYMENT_METHODS = [
  { id: 'pix',     label: 'Pix',              icon: '💸' },
  { id: 'credito', label: 'Cartão de Crédito', icon: '💳' },
  { id: 'debito',  label: 'Cartão de Débito',  icon: '💳' },
  { id: 'dinheiro',label: 'Dinheiro',          icon: '💵' },
];

interface SavedAddress {
  id: string;
  label: string;
  street: string | null;
  number: string | null;
  complement: string | null;
  city: string | null;
}

export default function Checkout() {
  const { items, total, clearCart } = useCart();
  const { company } = useCompany();
  const { user } = useAuth();
  const { isMesaMode, mesaNumber } = useMesa();
  const router = useRouter();
  const basePath = useBasePath();

  const [selectedPayment, setSelectedPayment] = useState<string | null>(null);
  const [confirmed, setConfirmed] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');

  // Endereços (apenas delivery)
  const [savedAddresses, setSavedAddresses] = useState<SavedAddress[]>([]);
  const [selectedAddressId, setSelectedAddressId] = useState<string | null>(null);
  const [street, setStreet] = useState('');
  const [number, setNumber] = useState('');
  const [complement, setComplement] = useState('');
  const [city, setCity] = useState('');

  const deliveryFee = isMesaMode ? 0 : 10;
  const finalTotal = total + deliveryFee;

  useEffect(() => {
    if (isMesaMode || !user) return;
    supabase
      .from('food_customer_addresses')
      .select('id, label, street, number, complement, city')
      .eq('user_id', user.id)
      .then(({ data }) => {
        if (data && data.length > 0) {
          setSavedAddresses(data);
          setSelectedAddressId(data[0].id);
          setStreet(data[0].street || '');
          setNumber(data[0].number || '');
          setComplement(data[0].complement || '');
          setCity(data[0].city || '');
        } else {
          setSelectedAddressId('new');
        }
      });
  }, [user, isMesaMode]);

  const selectAddress = (addr: SavedAddress) => {
    setSelectedAddressId(addr.id);
    setStreet(addr.street || ''); setNumber(addr.number || '');
    setComplement(addr.complement || ''); setCity(addr.city || '');
  };

  const resolvedAddress = isMesaMode
    ? `Mesa ${mesaNumber}`
    : `${street}${number ? `, ${number}` : ''}${complement ? ` - ${complement}` : ''}${city ? ` · ${city}` : ''}`;

  const canConfirm = isMesaMode
    ? items.length > 0
    : items.length > 0 && !!selectedPayment && !!street.trim();

  const handleConfirm = async () => {
    if (!canConfirm || !company?.id) return;
    if (!isMesaMode && !street.trim()) { setError('Informe o endereço de entrega.'); return; }
    setSaving(true);
    setError('');
    try {
      const orderNum = `#${Math.floor(Math.random() * 9000) + 1000}`;
      const orderItems = items.map(i => ({ name: i.name, qty: i.qty, price: i.price, obs: i.description || '' }));

      const { data: order, error: orderErr } = await supabase
        .from('food_orders')
        .insert({
          company_id: company.id,
          order_number: orderNum,
          cliente_nome: isMesaMode
            ? 'Convidado'
            : (user?.user_metadata?.display_name || user?.email?.split('@')[0] || 'Convidado'),
          status: 'recebido',
          total: finalTotal,
          payment_method: isMesaMode ? 'Na mesa' : selectedPayment,
          items: orderItems,
          order_source: 'cardapio-v9',
          tipo_pedido: isMesaMode ? 'mesa' : 'delivery',
          mesa_numero: isMesaMode ? parseInt(mesaNumber!) : null,
          user_id: isMesaMode ? null : (user?.id || null),
          address: resolvedAddress,
        })
        .select().single();

      if (orderErr) throw orderErr;

      if (order) {
        const itemInserts = items.map(i => ({
          order_id: order.id,
          menu_item_id: i.productId.startsWith('pizza-') ? null : i.productId,
          name: i.name, quantity: i.qty, unit_price: i.price, subtotal: i.price * i.qty,
        }));
        await supabase.from('food_order_items').insert(itemInserts);

        if (isMesaMode && mesaNumber) {
          await supabase.from('food_tables')
            .update({ status: 'ocupada' })
            .eq('company_id', company.id)
            .eq('numero', parseInt(mesaNumber));
        }
      }

      setConfirmed(true);
      clearCart();
      setTimeout(() => router.push(isMesaMode ? `${basePath}/comanda` : `${basePath}/menu`), 3000);
    } catch {
      setError('Erro ao confirmar pedido. Tente novamente.');
    } finally {
      setSaving(false);
    }
  };

  if (confirmed) {
    return (
      <div className="page-container">
        <main className="main-section bg-white-block split-layout">
          <div className="split-left">
            <HeroSection
              titleMedium="aeeee,"
              titleGiant="pedido confirmado!"
              subtitle={isMesaMode ? `chegando na Mesa ${mesaNumber}! 🙏` : 'só esperar uns minutinhos ta?! 🙏'}
            />
          </div>
          <div className="split-right" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <div style={{ textAlign: 'center' }}>
              <div style={{ width: 100, height: 100, background: 'var(--color-red)', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 20px', boxShadow: '0 8px 32px rgba(217,30,54,0.35)' }}>
                <Check size={52} color="white" strokeWidth={3} />
              </div>
              <p style={{ color: 'var(--color-text-secondary)', fontSize: 16 }}>
                {isMesaMode ? 'Abrindo comanda...' : 'Redirecionando...'}
              </p>
            </div>
          </div>
        </main>
      </div>
    );
  }

  return (
    <div className="page-container detail-layout">
      {/* Esquerda: itens */}
      <main className="main-section bg-white-block detail-left">
        <div className="detail-header">
          <h1 className="detail-header-title" style={{ color: 'var(--color-black)', opacity: 1 }}>
            {isMesaMode ? `Mesa ${mesaNumber} — Resumo` : 'Resumo do pedido'}
          </h1>
        </div>
        {items.length === 0 ? (
          <div style={{ padding: '60px 0', textAlign: 'center', color: 'var(--color-text-secondary)' }}>
            <p style={{ fontSize: 18 }}>Seu carrinho está vazio.</p>
            <button style={{ marginTop: 16, background: 'var(--color-red)', color: 'white', padding: '12px 28px', borderRadius: 12, fontWeight: 700, fontSize: 15 }}
              onClick={() => router.push(`${basePath}/menu`)}>Ver Menu</button>
          </div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 12, marginTop: 8 }}>
            {items.map(item => (
              <div key={item.id} className="sidebar-item" style={{ padding: '14px', background: '#fafafa', borderRadius: 14, border: '1px solid var(--color-border)' }}>
                {item.image_url
                  ? <img src={item.image_url} alt={item.name} style={{ width: 64, height: 64, borderRadius: 10, objectFit: 'cover', flexShrink: 0 }} />
                  : <div style={{ width: 64, height: 64, borderRadius: 10, background: '#f0f0f0', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 24, flexShrink: 0 }}>🍴</div>
                }
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

      {/* Direita: pagamento / mesa */}
      <aside className="main-section bg-white-block detail-sidebar checkout-sidebar">
        <div className="sidebar-header">
          <div>
            <h2 className="sidebar-title">Meu pedido</h2>
            <p className="checkout-subtitle">{isMesaMode ? `Mesa ${mesaNumber}` : 'Entrega e pagamento'}</p>
          </div>
          <span className="sidebar-count">{items.length} {items.length === 1 ? 'Item' : 'Itens'}</span>
        </div>

        {/* MODO MESA: confirmação simples */}
        {isMesaMode ? (
          <div className="mesa-confirm-info">
            <div className="mesa-confirm-icon">🪑</div>
            <p className="mesa-confirm-text">
              Seu pedido chegará diretamente na <strong>Mesa {mesaNumber}</strong>.<br />
              O pagamento é feito no caixa ao final.
            </p>
          </div>
        ) : (
          <>
            {/* Endereços salvos */}
            <div className="checkout-address-section">
              <p className="checkout-address-title">
                <MapPin size={14} style={{ display: 'inline', marginRight: 6, verticalAlign: 'middle' }} />
                Endereço de entrega
              </p>
              {savedAddresses.length > 0 && (
                <div className="checkout-saved-addresses">
                  {savedAddresses.map(addr => (
                    <button key={addr.id}
                      className={`checkout-addr-option ${selectedAddressId === addr.id ? 'selected' : ''}`}
                      onClick={() => selectAddress(addr)}>
                      <span className="addr-option-label">{addr.label}</span>
                      <span className="addr-option-street">{addr.street}{addr.number ? `, ${addr.number}` : ''}{addr.city ? ` · ${addr.city}` : ''}</span>
                    </button>
                  ))}
                  <button className={`checkout-addr-option ${selectedAddressId === 'new' ? 'selected' : ''}`}
                    onClick={() => { setSelectedAddressId('new'); setStreet(''); setNumber(''); setComplement(''); setCity(''); }}>
                    <span className="addr-option-label">+ Novo endereço</span>
                  </button>
                </div>
              )}
              {(selectedAddressId === 'new' || savedAddresses.length === 0) && (
                <div className="checkout-addr-form">
                  <div className="checkout-addr-row">
                    <input className="checkout-addr-input checkout-addr-street" placeholder="Rua / Avenida *" value={street} onChange={e => setStreet(e.target.value)} />
                    <input className="checkout-addr-input checkout-addr-number" placeholder="Nº" value={number} onChange={e => setNumber(e.target.value)} />
                  </div>
                  <input className="checkout-addr-input" placeholder="Complemento (opcional)" value={complement} onChange={e => setComplement(e.target.value)} style={{ marginTop: 8 }} />
                  <input className="checkout-addr-input" placeholder="Cidade" value={city} onChange={e => setCity(e.target.value)} style={{ marginTop: 8 }} />
                </div>
              )}
            </div>

            <div className="sidebar-divider"></div>

            {/* Métodos de pagamento */}
            <div className="payment-methods-list">
              {PAYMENT_METHODS.map(pm => (
                <button key={pm.id}
                  className={`payment-method-btn ${selectedPayment === pm.id ? 'selected' : ''}`}
                  onClick={() => setSelectedPayment(pm.id)}>
                  <span className="pm-icon">{pm.icon}</span>
                  <span className="pm-label">{pm.label}</span>
                  {selectedPayment === pm.id && <Check size={16} className="pm-check" />}
                </button>
              ))}
            </div>
          </>
        )}

        <div className="sidebar-divider"></div>

        <div className="sidebar-summary">
          <div className="summary-row"><span>Subtotal</span><span>R$ {total.toFixed(2)}</span></div>
          {!isMesaMode && <div className="summary-row"><span>Taxa de entrega</span><span>R$ {deliveryFee.toFixed(2)}</span></div>}
          <div className="summary-row total-row"><span>Total</span><span>R$ {finalTotal.toFixed(2)}</span></div>
        </div>

        {error && <p style={{ color: 'var(--color-red)', fontSize: 13, textAlign: 'center', marginBottom: 8 }}>{error}</p>}

        <button className="sidebar-btn-confirm"
          onClick={handleConfirm}
          disabled={!canConfirm || saving}
          style={{ opacity: (!canConfirm || saving) ? 0.45 : 1 }}>
          {saving ? 'Confirmando...' : isMesaMode ? `✓ Chegará na Mesa ${mesaNumber}!` : 'Confirmar pedido'}
        </button>
      </aside>
    </div>
  );
}
