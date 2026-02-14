import React from 'react';
import styles from './HeroSection.module.css';
import animationStyles from '../styles/animations.module.css';

export const HeroSection: React.FC = () => {
    return (
        <section className={styles.hero}>
            <h1 className={`${styles.headline} ${animationStyles.fadeUp} ${animationStyles.delay200}`}>
                one link,<br />
                <span className={styles.accent}>infinite branches</span>
            </h1>
            <p className={`${styles.description} ${animationStyles.fadeUp} ${animationStyles.delay300}`}>
                MarTree te permite compartir todo a través de un enlace potente. Aumenta tu presencia digital, conecta tu contenido y amplía tu red de contactos sin esfuerzo.
            </p>

            {/* Abstract Visual Element */}
            <div className={`${styles.visual} ${animationStyles.fadeUp} ${animationStyles.delay400}`}>
                <svg width="60" height="60" viewBox="0 0 60 60" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <circle cx="30" cy="30" r="4" fill="#00B0FF" />
                    <circle cx="30" cy="10" r="3" fill="#00E676" opacity="0.6" />
                    <circle cx="50" cy="30" r="3" fill="#7C4DFF" opacity="0.6" />
                    <circle cx="30" cy="50" r="3" fill="#00E676" opacity="0.6" />
                    <circle cx="10" cy="30" r="3" fill="#00B0FF" opacity="0.6" />
                    <line x1="30" y1="26" x2="30" y2="13" stroke="#ccc" strokeWidth="1" />
                    <line x1="34" y1="30" x2="47" y2="30" stroke="#ccc" strokeWidth="1" />
                    <line x1="30" y1="34" x2="30" y2="47" stroke="#ccc" strokeWidth="1" />
                    <line x1="26" y1="30" x2="13" y2="30" stroke="#ccc" strokeWidth="1" />
                </svg>
            </div>
        </section>
    );
};
