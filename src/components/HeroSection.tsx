import DecorativeCircles from './DecorativeCircles';
import './HeroSection.css';

interface HeroSectionProps {
  topLabel?: string;
  titleMedium: string;
  titleGiant: string;
  subtitle: string;
  showUnderline?: boolean;
  showEyes?: boolean;
  showLanches?: boolean;
}

export default function HeroSection({
  topLabel,
  titleMedium,
  titleGiant,
  subtitle,
  showUnderline,
  showEyes,
  showLanches,
}: HeroSectionProps) {
  return (
    <div className="hero-section">
      <div className="hero-content">
        {topLabel && (
          <p className="hero-top-label">
            <span className="hero-bullet">•</span> {topLabel} <span className="hero-bullet">•</span>
          </p>
        )}
        <h2 className="hero-title-medium">{titleMedium}</h2>
        <div className="hero-giant-wrapper">
          <h1 className="hero-title-giant">{titleGiant}</h1>
          {showUnderline && (
            <svg className="hero-underline" viewBox="0 0 300 20" preserveAspectRatio="none">
              <path
                d="M 0 12 Q 150 20 300 4"
                fill="none"
                stroke="#C41C3B"
                strokeWidth="3.5"
                strokeLinecap="round"
              />
            </svg>
          )}
          {showEyes && (
            <div className="hero-eyes">
              <div className="eye-circle-large">
                <svg viewBox="0 0 44 44" width="44" height="44">
                  <path d="M 10 26 Q 15 18 21 26" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" />
                  <path d="M 23 26 Q 28 18 34 26" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" />
                </svg>
              </div>
              <div className="eye-circle-small"></div>
            </div>
          )}
        </div>
        <p className="hero-subtitle">{subtitle}</p>

        {showLanches && (
          <div className="stacked-lanches">
            <span className="l-1">LANCHES</span>
            <span className="l-2">LANCHES</span>
            <span className="l-3">LANCHES</span>
            <span className="l-4">LANCHES</span>
            <span className="l-5">LANCHES</span>
          </div>
        )}
      </div>

      <DecorativeCircles />
    </div>
  );
}
