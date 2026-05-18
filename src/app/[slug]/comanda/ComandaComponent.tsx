"use client";
import { useState, useEffect, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { useCompany } from '@/context/CompanyContext';
import { useMesa } from '@/context/MesaContext';
import { useBasePath } from '@/hooks/useBasePath';
import { supabase } from '@/lib/supabase';
import './Comanda.css';

const STATUS_STAGES: Record<string, number> = {
  recebido: 0, preparo: 1, em_preparo: 1, pronto: 2, entregue: 3,
};

const STATUS_LABELS: Record<string, string> = {
  recebido: 'Recebido', preparo: 'Em preparo', em_preparo: 'Em preparo',
  pronto: '✅ Pronto!', entregue: 'Entregue',
};

const STAGE_NAMES = ['Recebido', 'Em preparo', 'Pronto'];

interface Order {
  id: string;
  order_number: string;
  status: string;
  total: number;
  created_at: string;
  items: any[];
}

export default function Comanda() {
  const { company } = useCompany();
  const { isMesaMode, mesaNumber } = useMesa();
  const router = useRouter();
  const basePath = useBasePath();

  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [mesaStatus, setMesaStatus] = useState<string>('ocupada');
  const [pedindoConta, setPedindoConta] = useState(false);
  const [contaSolicitada, setContaSolicitada] = useState(false);

  const fetchOrders = useCallback(async () => {
    if (!company?.id || !mesaNumber) return;
    const { data } = await supabase
      .from('food_orders')
      .select('id, order_number, status, total, created_at, items')
      .eq('company_id', company.id)
      .eq('mesa_numero', parseInt(mesaNumber))
      .neq('status', 'cancelado')
      .order('created_at', { ascending: false });
    setOrders(data || []);
    setLoading(false);
  }, [company?.id, mesaNumber]);

  const fetchMesaStatus = useCallback(async () => {
    if (!company?.id || !mesaNumber) return;
    const { data } = await supabase
      .from('food_tables')
      .select('status')
      .eq('company_id', company.id)
      .eq('numero', parseInt(mesaNumber))
      .maybeSingle();
    if (data) {
      setMesaStatus(data.status);
      if (['livre', 'disponivel', 'liberada'].includes(data.status)) {
        setContaSolicitada(false);
      }
    }
  }, [company?.id, mesaNumber]);

  useEffect(() => {
    if (!isMesaMode) { router.push(`${basePath}/menu`); return; }
    fetchOrders();
    fetchMesaStatus();
  }, [isMesaMode, fetchOrders, fetchMesaStatus, router, basePath]);

  // Realtime: atualiza pedidos e status da mesa
  useEffect(() => {
    if (!company?.id || !mesaNumber) return;

    const channel = supabase
      .channel(`comanda_${company.id}_mesa_${mesaNumber}`)
      .on('postgres_changes', { event: '*', schema: 'public', table: 'food_orders', filter: `company_id=eq.${company.id}` },
        () => fetchOrders())
      .on('postgres_changes', { event: '*', schema: 'public', table: 'food_tables', filter: `company_id=eq.${company.id}` },
        () => fetchMesaStatus())
      .subscribe();

    return () => { supabase.removeChannel(channel); };
  }, [company?.id, mesaNumber, fetchOrders, fetchMesaStatus]);

  const handlePedirConta = async () => {
    if (!company?.id || !mesaNumber) return;
    setPedindoConta(true);
    await supabase.from('food_tables')
      .update({ status: 'conta_solicitada' })
      .eq('company_id', company.id)
      .eq('numero', parseInt(mesaNumber));
    setContaSolicitada(true);
    setPedindoConta(false);
  };

  const grandTotal = orders.reduce((s, o) => s + (o.total || 0), 0);
  const mesaLiberada = ['livre', 'disponivel', 'liberada'].includes(mesaStatus);

  if (!isMesaMode) return null;

  if (mesaLiberada) {
    return (
      <div className="page-container">
        <div className="comanda-liberada-screen">
          <div className="comanda-liberada-icon" aria-hidden="true">
            <svg viewBox="0 0 24 24" width="28" height="28" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
              <polyline points="20 6 9 17 4 12" />
            </svg>
          </div>
          <span className="comanda-liberada-eyebrow">Atendimento finalizado</span>
          <h1 className="comanda-liberada-title">Mesa encerrada</h1>
          <p className="comanda-liberada-sub">
            Obrigado pela visita. Esperamos te ver de novo em breve.
          </p>
          <button
            type="button"
            className="comanda-btn-novo"
            onClick={() => router.push(`${basePath}/menu`)}
          >
            Voltar ao cardápio
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="page-container">
      <main className="comanda-page bg-white-block">
        {/* Header */}
        <div className="comanda-header">
          <div>
            <h1 className="comanda-title">Comanda</h1>
            <p className="comanda-mesa-label">Mesa {mesaNumber}</p>
          </div>
          <div className="comanda-total-badge">
            R$ {grandTotal.toFixed(2)}
          </div>
        </div>

        {loading ? (
          <p className="comanda-loading">Carregando pedidos...</p>
        ) : orders.length === 0 ? (
          <div className="comanda-empty">
            <span style={{ fontSize: 48 }}>🍽️</span>
            <p>Nenhum pedido ainda.</p>
            <button className="comanda-btn-pedir" onClick={() => router.push(`${basePath}/menu`)}>
              Fazer pedido
            </button>
          </div>
        ) : (
          <div className="comanda-orders">
            {orders.map(order => {
              const stage = STATUS_STAGES[order.status] ?? 0;
              const its = Array.isArray(order.items) ? order.items : [];
              return (
                <div key={order.id} className={`comanda-order-card status-${order.status}`}>
                  <div className="comanda-order-top">
                    <span className="comanda-order-num">{order.order_number}</span>
                    <span className={`comanda-status-badge s-${order.status}`}>
                      {STATUS_LABELS[order.status] || order.status}
                    </span>
                  </div>

                  {/* Progress bar 3 etapas */}
                  <div className="comanda-progress">
                    {STAGE_NAMES.map((name, i) => (
                      <div key={i} className={`comanda-step ${i <= stage ? 'done' : ''} ${i === stage ? 'active' : ''}`}>
                        <div className="comanda-step-dot" />
                        <span className="comanda-step-label">{name}</span>
                        {i < STAGE_NAMES.length - 1 && <div className={`comanda-step-line ${i < stage ? 'done' : ''}`} />}
                      </div>
                    ))}
                  </div>

                  {/* Itens */}
                  <div className="comanda-items">
                    {its.map((it: any, idx: number) => (
                      <div key={idx} className="comanda-item-row">
                        <span>{it.qty}× {it.name}</span>
                        <span>R$ {(it.price * it.qty).toFixed(2)}</span>
                      </div>
                    ))}
                  </div>

                  <div className="comanda-order-total">
                    <span>Total do pedido</span>
                    <strong>R$ {order.total?.toFixed(2)}</strong>
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {/* Footer: pedir conta */}
        {orders.length > 0 && !mesaLiberada && (
          <div className="comanda-footer">
            <div className="comanda-grand-total">
              <span>Total da mesa</span>
              <strong>R$ {grandTotal.toFixed(2)}</strong>
            </div>
            {contaSolicitada ? (
              <div className="comanda-conta-solicitada">
                🔔 Conta solicitada — o garçom já sabe!
              </div>
            ) : (
              <button
                className="comanda-btn-conta"
                onClick={handlePedirConta}
                disabled={pedindoConta}
              >
                {pedindoConta ? 'Solicitando...' : '💳 Pedir a conta'}
              </button>
            )}
          </div>
        )}
      </main>
    </div>
  );
}
