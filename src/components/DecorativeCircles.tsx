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
          {/* Radius ~170px to accompany the 320px red circle edge */}
          <path id="curve" d="M 40 200 A 160 160 0 0 1 360 200" fill="transparent" />
          <text>
            <textPath href="#curve" startOffset="75%" textAnchor="middle" className="arc-text">
              tecnologia fluxa
            </textPath>
          </text>
        </svg>
      </div>
    </div>
  );
}
