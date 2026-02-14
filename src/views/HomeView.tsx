
import { Navbar } from '../components/Navbar';
import { HeroSection } from '../components/HeroSection';
import { UsernameSection } from '../components/UsernameSection';
import { Footer } from '../components/Footer';
import styles from './HomeView.module.css';

export default function HomeView() {
  return (
    <div className={styles.container}>
      <div className={styles.overlay} />
      <div className={styles.content}>
        <Navbar />
        <main className={styles.main}>
          <HeroSection />
          <UsernameSection />
        </main>
        <Footer />
      </div>
    </div>
  )
}
