import React from 'react';
import styles from './Footer.module.css';
import animationStyles from '../styles/animations.module.css';

export const Footer: React.FC = () => {
    return (
        <footer className={`${styles.footer} ${animationStyles.fadeIn} ${animationStyles.delay600}`}>
            <div className={styles.text}>
                <span className={styles.brand}>MarTree</span>
                <span>© 2026 MarTree. All rights reserved.</span>
            </div>
        </footer>
    );
};
