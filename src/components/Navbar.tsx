import React from 'react';
import { Link } from 'react-router-dom';
import styles from './Navbar.module.css';
import animationStyles from '../styles/animations.module.css';

export const Navbar: React.FC = () => {
    return (
        <nav className={`${styles.navbar} ${animationStyles.fadeIn}`}>
            <div className={styles.logoContainer}>
                <img 
                    src="/logo_MarTree.svg" 
                    alt="MarTree Logo" 
                    className={styles.logo} 
                />
            </div>

            <div className={styles.actions}>
                <Link to="/auth/login" className={styles.loginBtn}>
                    Iniciar sesión
                </Link>

                <Link to="/auth/register" className={styles.registerBtn}>
                    Registrarse
                </Link>
            </div>
        </nav>
    );
};