"use client";
import { AuthProvider } from "@/context/AuthContext";
import { CompanyProvider } from "@/context/CompanyContext";
import { CartProvider } from "@/context/CartContext";
import { MesaProvider } from "@/context/MesaContext";
import Navbar from "@/components/Navbar";
import CartSidebar from "@/components/CartSidebar";
import BottomNav from "@/components/BottomNav";

export default function TenantLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <AuthProvider>
      <CompanyProvider>
        <MesaProvider>
          <CartProvider>
            <Navbar />
            <CartSidebar />
            <BottomNav />
            {children}
          </CartProvider>
        </MesaProvider>
      </CompanyProvider>
    </AuthProvider>
  );
}
