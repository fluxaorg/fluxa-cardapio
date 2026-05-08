import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Navbar from './components/Navbar';
import Home from './pages/Home';
import Login from './pages/Login';
import Profile from './pages/Profile';
import Menu from './pages/Menu';
import ProductDetail from './pages/ProductDetail';
import Checkout from './pages/Checkout';
import Pizzas from './pages/Pizzas';
import Promocoes from './pages/Promocoes';
import Comanda from './pages/Comanda';
import { AuthProvider } from './context/AuthContext';
import { CompanyProvider } from './context/CompanyContext';
import { CartProvider } from './context/CartContext';
import { MesaProvider } from './context/MesaContext';
import CartSidebar from './components/CartSidebar';
import BottomNav from './components/BottomNav';

function TenantApp() {
  return (
    <CompanyProvider>
      <MesaProvider>
        <CartProvider>
          <Navbar />
          <CartSidebar />
          <BottomNav />
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/login" element={<Login />} />
            <Route path="/perfil" element={<Profile />} />
            <Route path="/menu" element={<Menu />} />
            <Route path="/pizzas" element={<Pizzas />} />
            <Route path="/promocoes" element={<Promocoes />} />
            <Route path="/produto/:id" element={<ProductDetail />} />
            <Route path="/checkout" element={<Checkout />} />
            <Route path="/comanda" element={<Comanda />} />
          </Routes>
        </CartProvider>
      </MesaProvider>
    </CompanyProvider>
  );
}

function App() {
  return (
    <AuthProvider>
      <Router>
        <Routes>
          <Route path="/" element={<Navigate to="/quiosque" replace />} />
          {/* Mesa routes — mesaNumber available via useMesa() hook */}
          <Route path="/:slug/mesa/:mesaNumber/*" element={<TenantApp />} />
          {/* Standard routes */}
          <Route path="/:slug/*" element={<TenantApp />} />
        </Routes>
      </Router>
    </AuthProvider>
  );
}

export default App;
