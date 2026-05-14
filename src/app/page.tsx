import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Fluxa Cardápio Digital",
  description: "Acesse o cardápio do seu restaurante favorito.",
};

export default function RootPage() {
  return (
    <div
      style={{
        minHeight: "100dvh",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        background: "#F4F4F4",
        fontFamily: "'Urbanist', sans-serif",
        padding: "24px",
        textAlign: "center",
      }}
    >
      <div
        style={{
          width: 64,
          height: 64,
          background: "#2D2D2D",
          borderRadius: "50%",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          marginBottom: 24,
        }}
      >
        <span style={{ color: "#fff", fontSize: 32, fontWeight: 900 }}>f</span>
      </div>

      <h1
        style={{
          fontSize: "clamp(28px, 8vw, 52px)",
          fontWeight: 900,
          color: "#2D2D2D",
          letterSpacing: "-0.04em",
          lineHeight: 1,
          marginBottom: 12,
        }}
      >
        Fluxa Cardápio
      </h1>

      <p
        style={{
          fontSize: 16,
          color: "#888",
          fontWeight: 500,
          maxWidth: 320,
          lineHeight: 1.5,
          marginBottom: 32,
        }}
      >
        Escaneie o QR Code do seu restaurante ou acesse o link direto do cardápio para fazer seu pedido.
      </p>

      <div
        style={{
          background: "#fff",
          border: "1px solid #E5E5E5",
          borderRadius: 16,
          padding: "16px 24px",
          fontSize: 13,
          color: "#888",
          maxWidth: 300,
        }}
      >
        <strong style={{ color: "#2D2D2D" }}>Formato do link:</strong>
        <br />
        <code style={{ color: "#D91E36", fontSize: 14 }}>
          seusite.com/<strong>nome-do-restaurante</strong>
        </code>
      </div>
    </div>
  );
}
