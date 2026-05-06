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
          {/* Radius 225px to match the 450px wide black circle center to edge */}
          <path id="curve" d="M 75 300 A 225 225 0 0 1 525 300" fill="transparent" />
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
