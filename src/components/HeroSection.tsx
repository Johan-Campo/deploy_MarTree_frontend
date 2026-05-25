import React from 'react';
import { Link as LinkIcon, Image, Share } from 'lucide-react';
import styles from './HeroSection.module.css';
import animationStyles from '../styles/animations.module.css';

const features = [
    { icon: LinkIcon, label: 'Todos tus links' },
    { icon: Image,    label: 'Tu foto y bio' },
    { icon: Share,    label: 'Un solo enlace' },
];

export const HeroSection: React.FC = () => {
    return (
        <section className={styles.hero}>
            <div className={`${styles.badge} ${animationStyles.fadeIn} ${animationStyles.delay100}`}>
                <span className={styles.badgeDot} />
                Tu presencia digital, simplificada
            </div>

            <h1 className={`${styles.headline} ${animationStyles.fadeUp} ${animationStyles.delay200}`}>
                one link,<br />
                <span className={styles.accent}>infinite branches</span>
            </h1>

            <p className={`${styles.description} ${animationStyles.fadeUp} ${animationStyles.delay300}`}>
                MarTree te permite compartir todo a través de un enlace potente. Aumenta tu presencia digital y amplía tu red sin esfuerzo.
            </p>

            <div className={`${styles.features} ${animationStyles.fadeUp} ${animationStyles.delay400}`}>
                {features.map(({ icon: Icon, label }, i) => (
                    <div
                        key={label}
                        className={`${styles.featureCard} ${animationStyles.float}`}
                        style={{ animationDelay: `${i * 0.9}s` }}
                    >
                        <Icon className={styles.featureIcon} />
                        <span className={styles.featureLabel}>{label}</span>
                    </div>
                ))}
            </div>
        </section>
    );
};
