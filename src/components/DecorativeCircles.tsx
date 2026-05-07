import './DecorativeCircles.css';

export default function DecorativeCircles() {
  return (
    <div className="decorative-circles-container">
      <div className="circle circle-1"></div>
      <div className="circle circle-2"></div>
      <div className="circle circle-3"></div>

      <div className="arc-text-container">
        <svg viewBox="0 0 320 150" width="320" height="150">
          <path id="arcPath" d="M 20 130 A 150 150 0 0 1 300 130" fill="transparent" />
          <text>
            <textPath
              href="#arcPath"
              startOffset="50%"
              textAnchor="middle"
              className="arc-text"
            >
              tecnologia fluxa
            </textPath>
          </text>
        </svg>
      </div>
    </div>
  );
}
