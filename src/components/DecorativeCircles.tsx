import './DecorativeCircles.css';

export default function DecorativeCircles() {
  return (
    <div className="decorative-circles-container">
      <div className="circle circle-1"></div>
      <div className="circle circle-2"></div>
      <div className="circle circle-3"></div>

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
