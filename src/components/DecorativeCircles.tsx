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
        <svg viewBox="0 0 400 400" width="400" height="400" className="arc-svg">
          <path id="curve" d="M 20 380 A 180 180 0 0 1 380 380" fill="transparent" />
          <text width="400">
            <textPath href="#curve" startOffset="50%" textAnchor="middle" className="arc-text">
              tecnologia fluxa
            </textPath>
          </text>
        </svg>
      </div>
    </div>
  );
}
