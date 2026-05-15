import './DecorativeCircles.css';

interface DecorativeCirclesProps {
  /** Quando passado, exibe "Bem-vindo ao {welcomeName}" sobre os círculos. */
  welcomeName?: string | null;
}

export default function DecorativeCircles({ welcomeName }: DecorativeCirclesProps) {
  return (
    <div className="decorative-circles-container">
      <div className="circle circle-1"></div>
      <div className="circle circle-2"></div>
      <div className="circle circle-3"></div>

      {welcomeName && (
        <div className="circles-welcome">
          <span className="circles-welcome-eyebrow">Bem-vindo ao</span>
          <span className="circles-welcome-name">{welcomeName}</span>
        </div>
      )}

      <div className="arc-text-container">
        <svg viewBox="0 0 400 400" width="400" height="400" className="arc-svg">
          <path id="curve" d="M 35 200 A 165 165 0 0 1 365 200" fill="transparent" />
          <text>
            <textPath href="#curve" startOffset="50%" textAnchor="middle" className="arc-text">
              tecnologia fluxa
            </textPath>
          </text>
        </svg>
      </div>
    </div>
  );
}
