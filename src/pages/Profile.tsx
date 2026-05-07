import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import HeroSection from '../components/HeroSection';
import { useAuth } from '../context/AuthContext';
import { useCompany } from '../context/CompanyContext';
import { supabase } from '../lib/supabase';
import { ArrowLeft, Plus, Trash2 } from 'lucide-react';
import './Profile.css';

type ProfileTab = 'home' | 'enderecos' | 'recentes' | 'cupons' | 'pedidos';

interface Order {
  id: string;
  order_number: string;
  created_at: string;
  status: string;
  total: number;
  payment_method: string | null;
  items: any[];
}

interface Address {
  id: string;
  label: string;
  street: string | null;
  number: string | null;
  complement: string | null;
  city: string | null;
  cep: string | null;
  is_default: boolean;
}

const STATUS_LABELS: Record<string, string> = {
  recebido: '🔴 Recebido',
  preparo: '⚡ Em preparo',
  pronto: '✅ Pronto',
  entregue: '📦 Entregue',
  cancelado: '❌ Cancelado',
};

export default function Profile() {
  const { user, signOut, loading } = useAuth();
  const { company } = useCompany();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState<ProfileTab>('home');
  const basePath = company?.slug ? `/${company.slug}` : '';

  // Dados dos tabs
  const [orders, setOrders] = useState<Order[]>([]);
  const [coupons, setCoupons] = useState<any[]>([]);
  const [addresses, setAddresses] = useState<Address[]>([]);
  const [dataLoading, setDataLoading] = useState(false);

  // Formulário de endereço
  const [showAddressForm, setShowAddressForm] = useState(false);
  const [addrForm, setAddrForm] = useState({ label: 'Casa', street: '', number: '', complement: '', city: '', cep: '' });

  useEffect(() => {
    if (user && activeTab !== 'home') loadTabData(activeTab);
  }, [activeTab, user]);

  async function loadTabData(tab: ProfileTab) {
    if (!user) return;
    setDataLoading(true);
    try {
      if (tab === 'pedidos' || tab === 'recentes') {
        const q = supabase
          .from('food_orders')
          .select('id, order_number, created_at, status, total, payment_method, items')
          .eq('user_id', user.id)
          .order('created_at', { ascending: false });
        if (tab === 'recentes') q.limit(5);
        const { data } = await q;
        setOrders(data || []);
      } else if (tab === 'enderecos') {
        const { data } = await supabase
          .from('food_customer_addresses')
          .select('*')
          .eq('user_id', user.id)
          .order('is_default', { ascending: false });
        setAddresses(data || []);
      } else if (tab === 'cupons') {
        if (company?.id) {
          const { data } = await supabase
            .from('food_promotions')
            .select('id, title, discount_pct, description, day_of_week, valid_until')
            .eq('company_id', company.id)
            .eq('active', true);
          setCoupons(data || []);
        }
      }
    } finally {
      setDataLoading(false);
    }
  }

  async function saveAddress() {
    if (!user || !company?.id) return;
    const { data } = await supabase
      .from('food_customer_addresses')
      .insert({ ...addrForm, user_id: user.id, company_id: company.id })
      .select()
      .single();
    if (data) {
      setAddresses(prev => [...prev, data]);
      setShowAddressForm(false);
      setAddrForm({ label: 'Casa', street: '', number: '', complement: '', city: '', cep: '' });
    }
  }

  async function deleteAddress(id: string) {
    await supabase.from('food_customer_addresses').delete().eq('id', id);
    setAddresses(prev => prev.filter(a => a.id !== id));
  }

  if (loading) return <div className="page-loading">Carregando...</div>;

  if (!user) {
    return (
      <div className="page-container">
        <main className="main-section bg-white-block split-layout">
          <div className="split-left">
            <HeroSection titleMedium="faaala" titleGiant="fulano!" subtitle="faz teu login aí, bora pedir!" />
          </div>
          <div className="split-right login-panel">
            <div className="login-card">
              <div className="f-logo-circle"><span className="f-letter">f</span></div>
              <div className="login-form-section">
                <h2 className="login-title">Entrar</h2>
                <p className="login-subtitle">é bom te ver de volta!</p>
              </div>
              <div className="login-divider"></div>
              <div className="login-form-section">
                <h2 className="login-title">Cadastrar</h2>
                <p className="login-subtitle">nesse caso... Prazer!</p>
              </div>
              <button className="btn-bora-pedir" onClick={() => navigate(`${basePath}/login`)}>
                Booooooora pedir!
              </button>
            </div>
          </div>
        </main>
      </div>
    );
  }

  const getHeroTitles = () => {
    switch (activeTab) {
      case 'enderecos': return { small: 'meus', large: 'endereços', sub: 'gerencie seus locais de entrega' };
      case 'recentes': return { small: 'pedidos', large: 'recentes', sub: 'peça novamente rapidinho' };
      case 'cupons': return { small: 'meus', large: 'cupons', sub: 'seus descontos disponíveis' };
      case 'pedidos': return { small: 'meus', large: 'pedidos', sub: 'acompanhe o histórico' };
      default: return { small: 'oláaaa', large: 'fulano!', sub: 'o que manda hoje? me conta ai...' };
    }
  };

  const t = getHeroTitles();

  return (
    <div className="page-container">
      <main className="main-section bg-white-block split-layout">
        <div className="split-left">
          <HeroSection
            titleMedium={t.small}
            titleGiant={t.large}
            subtitle={t.sub}
            showEyes={activeTab === 'home'}
          />
        </div>

        <div className="split-right profile-right-panel">
          {activeTab !== 'home' && (
            <button className="back-btn" onClick={() => setActiveTab('home')}>
              <ArrowLeft size={24} /><span>Voltar</span>
            </button>
          )}

          {/* ── HOME ── */}
          {activeTab === 'home' && (
            <div className="profile-bento-grid">
              <div className="bento-card card-enderecos" onClick={() => setActiveTab('enderecos')}>
                <div className="enderecos-text">
                  <span className="syl">en</span><span className="syl">de</span>
                  <span className="syl">re</span><span className="syl">ços</span>
                  <span className="enderecos-hint">confirma<br/>certinho né!</span>
                </div>
              </div>
              <div className="bento-card-group-top-right">
                <div className="bento-card card-recentes" onClick={() => setActiveTab('recentes')}>
                  <div className="card-recentes-content">
                    <span className="recentes-line1">pedidos</span>
                    <span className="recentes-line2">recentes</span>
                    <span className="recentes-hint">peça dnv...</span>
                  </div>
                </div>
                <div className="bento-card card-logout" onClick={signOut}>
                  <div className="card-logout-content">
                    <span className="logout-title">Logout</span>
                    <span className="logout-hint">ja vai?</span>
                  </div>
                </div>
              </div>
              <div className="bento-card card-cupons" onClick={() => setActiveTab('cupons')}>
                <div className="card-cupons-content">
                  <span className="cupons-line1">Meus</span>
                  <span className="cupons-line2">Cupons</span>
                  <span className="cupons-hint">vai um desconto aí?</span>
                </div>
              </div>
              <div className="bento-card card-pedidos" onClick={() => setActiveTab('pedidos')}>
                <div className="card-pedidos-content">
                  <span className="pedidos-line1">Meus</span>
                  <span className="pedidos-line2">Pedidos</span>
                  <span className="pedidos-hint">acompanhe seus pedidos.</span>
                </div>
              </div>
            </div>
          )}

          {/* ── PEDIDOS / RECENTES ── */}
          {(activeTab === 'pedidos' || activeTab === 'recentes') && (
            <div className="tab-content-scroll">
              {dataLoading ? <p className="tab-loading">Carregando...</p> :
               orders.length === 0 ? (
                <div className="tab-empty">
                  <span style={{ fontSize: 40 }}>📦</span>
                  <p>Você ainda não fez pedidos aqui.</p>
                </div>
              ) : (
                <div className="orders-list">
                  {orders.map((ord) => (
                    <div key={ord.id} className="order-card">
                      <div className="order-card-top">
                        <span className="order-number">{ord.order_number}</span>
                        <span className="order-status">{STATUS_LABELS[ord.status] || ord.status}</span>
                      </div>
                      <div className="order-items-preview">
                        {Array.isArray(ord.items) && ord.items.slice(0, 3).map((it: any, idx: number) => (
                          <span key={idx} className="order-item-tag">{it.name} ×{it.qty}</span>
                        ))}
                        {Array.isArray(ord.items) && ord.items.length > 3 && (
                          <span className="order-item-tag">+{ord.items.length - 3} mais</span>
                        )}
                      </div>
                      <div className="order-card-bottom">
                        <span className="order-date">{new Date(ord.created_at).toLocaleDateString('pt-BR', { day: '2-digit', month: '2-digit', hour: '2-digit', minute: '2-digit' })}</span>
                        <span className="order-total">R$ {ord.total?.toFixed(2)}</span>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* ── ENDEREÇOS ── */}
          {activeTab === 'enderecos' && (
            <div className="tab-content-scroll">
              {dataLoading ? <p className="tab-loading">Carregando...</p> : (
                <>
                  <div className="addresses-list">
                    {addresses.map((addr) => (
                      <div key={addr.id} className="address-card">
                        <div className="address-info">
                          <span className="address-label">{addr.label}{addr.is_default ? ' ⭐' : ''}</span>
                          <span className="address-street">{addr.street}{addr.number ? `, ${addr.number}` : ''}{addr.complement ? ` - ${addr.complement}` : ''}</span>
                          <span className="address-city">{addr.city}{addr.cep ? ` · ${addr.cep}` : ''}</span>
                        </div>
                        <button className="address-delete" onClick={() => deleteAddress(addr.id)}>
                          <Trash2 size={16} />
                        </button>
                      </div>
                    ))}
                    {addresses.length === 0 && !showAddressForm && (
                      <div className="tab-empty">
                        <span style={{ fontSize: 40 }}>📍</span>
                        <p>Nenhum endereço salvo ainda.</p>
                      </div>
                    )}
                  </div>

                  {showAddressForm ? (
                    <div className="address-form">
                      <h3 className="form-title">Novo endereço</h3>
                      <div className="form-grid">
                        {(['label','street','number','complement','city','cep'] as const).map((field) => (
                          <input
                            key={field}
                            className="form-input"
                            placeholder={{ label:'Apelido (Casa, Trabalho...)', street:'Rua', number:'Número', complement:'Complemento', city:'Cidade', cep:'CEP' }[field]}
                            value={addrForm[field]}
                            onChange={e => setAddrForm(p => ({ ...p, [field]: e.target.value }))}
                          />
                        ))}
                      </div>
                      <div className="form-actions">
                        <button className="btn-save-addr" onClick={saveAddress}>Salvar</button>
                        <button className="btn-cancel-addr" onClick={() => setShowAddressForm(false)}>Cancelar</button>
                      </div>
                    </div>
                  ) : (
                    <button className="btn-add-address" onClick={() => setShowAddressForm(true)}>
                      <Plus size={16} /> Adicionar endereço
                    </button>
                  )}
                </>
              )}
            </div>
          )}

          {/* ── CUPONS ── */}
          {activeTab === 'cupons' && (
            <div className="tab-content-scroll">
              {dataLoading ? <p className="tab-loading">Carregando...</p> :
               coupons.length === 0 ? (
                <div className="tab-empty">
                  <span style={{ fontSize: 40 }}>🎟️</span>
                  <p>Nenhuma promoção ativa no momento.</p>
                </div>
              ) : (
                <div className="cupons-list">
                  {coupons.map((promo) => (
                    <div key={promo.id} className="cupon-card">
                      <div className="cupon-discount">-{promo.discount_pct}%</div>
                      <div className="cupon-info">
                        <span className="cupon-title">{promo.title}</span>
                        {promo.description && <span className="cupon-desc">{promo.description}</span>}
                        {promo.valid_until && (
                          <span className="cupon-validity">
                            Válido até {new Date(promo.valid_until).toLocaleDateString('pt-BR')}
                          </span>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
