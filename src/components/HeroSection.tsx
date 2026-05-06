
import DecorativeCircles from './DecorativeCircles';
import './HeroSection.css';

interface HeroSectionProps {
  topLabel?: string;
  titleMedium: string;
  titleGiant: string;
  subtitle: string;
  showUnderline?: boolean;
  showEyes?: boolean;
}

export default function HeroSection({
  topLabel,
  titleMedium,
  titleGiant,
  subtitle,
  showUnderline,
  showEyes,
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
            <svg className="hero-underline" viewBox="0 0 200 20" preserveAspectRatio="none">
              <path d="M 0 10 Q 100 20 200 0" fill="none" stroke="var(--color-red)" strokeWidth="3" strokeLinecap="round" />
            </svg>
          )}
          {showEyes && (
            <div className="hero-eyes">
              <div className="eye-circle-large">
                <svg viewBox="0 0 44 44" width="44" height="44">
                  <path d="M 10 24 Q 15 14 20 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" />
                  <path d="M 24 24 Q 29 14 34 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" />
                </svg>
              </div>
              <div className="eye-circle-small"></div>
            </div>
          )}
        </div>
        <p className="hero-subtitle">{subtitle}</p>

      </div>

      <DecorativeCircles />
    </div>
  );
}
