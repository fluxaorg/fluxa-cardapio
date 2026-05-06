
import './ProductDetail.css'; // Reusing some layout classes
import './Checkout.css';

export default function Checkout() {
  return (
    <div className="page-container detail-layout">
      {/* Left Area (mocked as previous step for visual reference) */}
      <main className="main-section bg-white-block detail-left" style={{ opacity: 0.5, pointerEvents: 'none' }}>
        <div className="detail-header">
          <h1 className="detail-header-title">Detalhes do produto...</h1>
        </div>
        {/* Placeholder content for left area just to keep layout */}
        <div style={{ height: '400px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <p>Conteúdo anterior...</p>
        </div>
      </main>

      {/* Right Area Sidebar - Checkout Payment */}
      <aside className="main-section bg-white-block detail-sidebar checkout-sidebar">
        <div className="sidebar-header">
          <div>
            <h2 className="sidebar-title">Meu pedido</h2>
            <p className="checkout-subtitle">Forma de pagamento</p>
          </div>
          <span className="sidebar-count">2 Itens</span>
        </div>

        <div className="payment-card">
          <h3 className="payment-card-text">Aqui é os meios, faça no mesmo estilo</h3>
        </div>

        <div className="sidebar-divider"></div>

        <div className="sidebar-coupon">
          <span className="coupon-label">CUPOM</span>
          <span className="coupon-val">PROMO20</span>
        </div>

        <div className="sidebar-summary">
          <div className="summary-row">
            <span>Desconto</span>
            <span>-5%</span>
          </div>
          <div className="summary-row">
            <span>Taxa de entrega</span>
            <span>10$</span>
          </div>
          <div className="summary-row total-row">
            <span>Total</span>
            <span>192$</span>
          </div>
        </div>

        <button className="sidebar-btn-confirm">Confirmar pedido</button>
      </aside>
    </div>
  );
}
