'use client';

import Image from "next/image";
import styles from './styles.module.css';

export default function Home() {
  return (
    <div className={styles.container}>
      <h1 className={styles.heading}>Testing CSS Modules</h1>
      <p className={styles.paragraph}>This is a test to see if CSS modules are working properly.</p>
      <div style={{ backgroundColor: 'green', color: 'white', padding: '20px', marginBottom: '20px' }}>
        This div has inline styles to test if React styling is working.
      </div>
      <button className={styles.button}>CSS Module Button</button>
      <div style={{ marginTop: '20px' }}>
        <Image
          src="/logo.svg"
          alt="Logo"
          width={100}
          height={100}
        />
      </div>
    </div>
  );
}
