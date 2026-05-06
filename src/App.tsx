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
import { AuthProvider } from './context/AuthContext';
import { CompanyProvider } from './context/CompanyContext';
import { CartProvider } from './context/CartContext';
import CartSidebar from './components/CartSidebar';

function TenantApp() {
  return (
    <CompanyProvider>
      <CartProvider>
        <Navbar />
        <CartSidebar />
        <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/perfil" element={<Profile />} />
        <Route path="/menu" element={<Menu />} />
        <Route path="/pizzas" element={<Pizzas />} />
        <Route path="/promocoes" element={<Promocoes />} />
        <Route path="/produto/:id" element={<ProductDetail />} />
        <Route path="/checkout" element={<Checkout />} />
      </Routes>
      </CartProvider>
    </CompanyProvider>
  );
}

function App() {
  return (
    <AuthProvider>
      <Router>
        <Routes>
          <Route path="/" element={<Navigate to="/quiosque" replace />} />
          <Route path="/:slug/*" element={<TenantApp />} />
        </Routes>
      </Router>
    </AuthProvider>
  );
}

export default App;
