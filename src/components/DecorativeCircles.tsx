import './DecorativeCircles.css';

export default function DecorativeCircles() {
  return (
    <div className="decorative-circles-container">
      {/* Círculo 1 (maior) */}
      <div className="circle circle-1"></div>
      
      {/* Círculo 2 (menor) */}
      <div className="circle circle-2"></div>
      
      {/* Círculo 3 (vermelho) */}
      <div className="circle circle-3"></div>

      {/* Texto em arco: tecnologia fluxa */}
      <div className="arc-text-container">
        <svg viewBox="0 0 240 120" width="240" height="120" className="arc-svg">
          {/* O arco é aproximadamente 180° côncavo para cima. */}
          <path id="curve" d="M 20 100 A 100 100 0 0 1 220 100" fill="transparent" />
          <text width="240">
            <textPath href="#curve" startOffset="50%" textAnchor="middle" className="arc-text">
              tecnologia fluxa
            </textPath>
          </text>
        </svg>
      </div>
    </div>
  );
}
