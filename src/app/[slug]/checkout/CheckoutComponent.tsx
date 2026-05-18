"use client";
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useCart } from '@/context/CartContext';
import { useCompany } from '@/context/CompanyContext';
import { useAuth } from '@/context/AuthContext';
import { useMesa } from '@/context/MesaContext';
import { useBasePath } from '@/hooks/useBasePath';
import { supabase } from '@/lib/supabase';
import { Check, ArrowLeft, X, MapPin, CreditCard, Wallet, Banknote, Landmark } from 'lucide-react';
import './Checkout.css';

const PAYMENT_METHODS = [
  { id: 'pix',     label: 'Pix',              icon: <Landmark size={20} /> },
  { id: 'credito', label: 'Cartão de Crédito', icon: <CreditCard size={20} /> },
  { id: 'debito',  label: 'Cartão de Débito',  icon: <CreditCard size={20} /> },
  { id: 'dinheiro',label: 'Dinheiro',          icon: <Banknote size={20} /> },
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
      <div className="confirm-page">
        <div className="confirm-icon-box">
          <Check size={48} color="white" strokeWidth={4} />
        </div>
        <h1 className="confirm-title">Pedido feito!</h1>
        <p className="confirm-subtitle">
          {isMesaMode 
            ? `Já estamos preparando tudo para a Mesa ${mesaNumber}. 🙏` 
            : 'Recebemos seu pedido e já vamos começar a preparar! 🙏'}
        </p>
      </div>
    );
  }

  return (
    <div className="checkout-page">
      <header className="page-header">
        <button className="header-btn" onClick={() => router.back()} aria-label="Voltar">
          <ArrowLeft size={22} />
        </button>
        <h1 className="page-header-title">
          {isMesaMode ? `Pedido da Mesa ${mesaNumber}` : 'Finalizar pedido'}
        </h1>
        <button className="header-btn" onClick={() => router.push(`${basePath}/menu`)} aria-label="Fechar">
          <X size={22} />
        </button>
      </header>

      <div className="checkout-content">
        {/* Banner mesa (apenas em modo mesa) */}
        {isMesaMode && (
          <div className="mesa-banner">
            <div className="mesa-banner-num">{mesaNumber}</div>
            <div className="mesa-banner-text">
              <span className="mesa-banner-eyebrow">Você está na</span>
              <strong className="mesa-banner-title">Mesa {mesaNumber}</strong>
              <span className="mesa-banner-sub">O pedido vai direto pra cozinha</span>
            </div>
          </div>
        )}

        {/* Resumo dos Itens */}
        <section className="checkout-section">
          <h2 className="checkout-section-title">Seu Pedido</h2>
          <div className="checkout-items-list">
            {items.map(item => (
              <div key={item.id} className="checkout-item-row">
                {item.image_url ? (
                  <img src={item.image_url} alt={item.name} className="checkout-item-img" />
                ) : (
                  <div className="checkout-item-img checkout-item-img--placeholder" aria-hidden="true" />
                )}
                <div className="checkout-item-info">
                  <p className="checkout-item-name">{item.name}</p>
                  <p className="checkout-item-qty">{item.qty}× R$ {item.price.toFixed(2)}</p>
                </div>
                <span className="checkout-item-price">R$ {(item.price * item.qty).toFixed(2)}</span>
              </div>
            ))}
          </div>
        </section>

        {/* Endereço — só em delivery */}
        {!isMesaMode && (
          <section className="checkout-section">
            <h2 className="checkout-section-title">Onde entregar</h2>
            <div className="checkout-options-list">
              {savedAddresses.map(addr => (
                <button
                  key={addr.id}
                  className={`checkout-option-card ${selectedAddressId === addr.id ? 'selected' : ''}`}
                  onClick={() => selectAddress(addr)}
                >
                  <div className="checkout-option-icon"><MapPin size={20} /></div>
                  <div className="checkout-option-info">
                    <p className="checkout-option-label">{addr.label}</p>
                    <p className="checkout-option-sub">{addr.street}, {addr.number}</p>
                  </div>
                  {selectedAddressId === addr.id && <Check size={20} className="pm-check" />}
                </button>
              ))}
              <button
                className={`checkout-option-card ${selectedAddressId === 'new' ? 'selected' : ''}`}
                onClick={() => { setSelectedAddressId('new'); setStreet(''); setNumber(''); }}
              >
                <div className="checkout-option-icon">+</div>
                <div className="checkout-option-info">
                  <p className="checkout-option-label">Novo endereço</p>
                  <p className="checkout-option-sub">Informar endereço manualmente</p>
                </div>
              </button>

              {selectedAddressId === 'new' && (
                <div className="checkout-new-addr-form">
                  <input className="input-field" placeholder="Rua / Avenida *" value={street} onChange={e => setStreet(e.target.value)} />
                  <input className="input-field" placeholder="Nº" value={number} onChange={e => setNumber(e.target.value)} />
                </div>
              )}
            </div>
          </section>
        )}

        {/* Pagamento — só em delivery */}
        {!isMesaMode && (
          <section className="checkout-section">
            <h2 className="checkout-section-title">Como pagar</h2>
            <div className="checkout-options-list">
              {PAYMENT_METHODS.map(pm => (
                <button
                  key={pm.id}
                  className={`checkout-option-card ${selectedPayment === pm.id ? 'selected' : ''}`}
                  onClick={() => setSelectedPayment(pm.id)}
                >
                  <div className="checkout-option-icon">{pm.icon}</div>
                  <div className="checkout-option-info">
                    <p className="checkout-option-label">{pm.label}</p>
                    <p className="checkout-option-sub">{pm.id === 'pix' ? 'Pagamento instantâneo' : 'Pagar na entrega'}</p>
                  </div>
                  {selectedPayment === pm.id && <Check size={20} className="pm-check" />}
                </button>
              ))}
            </div>
          </section>
        )}

        {/* Observações (mesa mode) */}
        {isMesaMode && (
          <section className="checkout-section">
            <h2 className="checkout-section-title">Alguma observação?</h2>
            <textarea
              className="checkout-obs-textarea"
              placeholder="Ex: sem cebola, ponto da carne, etc"
              rows={3}
            />
            <p className="checkout-obs-hint">A cozinha verá essa observação junto com o pedido.</p>
          </section>
        )}

        {/* Resumo de Valores */}
        <section className="checkout-section">
          <div className="checkout-summary-box">
            <div className="checkout-summary-row"><span>Itens</span><span>R$ {total.toFixed(2)}</span></div>
            {!isMesaMode && (
              <div className="checkout-summary-row"><span>Entrega</span><span>R$ {deliveryFee.toFixed(2)}</span></div>
            )}
            <div className="checkout-summary-total"><span>Total</span><span>R$ {finalTotal.toFixed(2)}</span></div>
          </div>
        </section>

        {error && <p className="checkout-error">{error}</p>}
      </div>

      <footer className="checkout-footer">
        <button
          className="btn-primary"
          onClick={handleConfirm}
          disabled={!canConfirm || saving}
        >
          {saving ? 'Enviando...' : isMesaMode ? 'Enviar para a cozinha' : 'Confirmar pedido'}
        </button>
      </footer>
    </div>
  );
}
