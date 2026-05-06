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
        <svg viewBox="0 0 600 600" width="600" height="600" className="arc-svg">
          {/* Radius roughly 230px to sit outside the 450px wide black circle */}
          <path id="curve" d="M 50 300 A 250 250 0 0 1 550 300" fill="transparent" />
          <text width="600">
            <textPath href="#curve" startOffset="50%" textAnchor="middle" className="arc-text">
              tecnologia fluxa
            </textPath>
          </text>
        </svg>
      </div>
    </div>
  );
}
