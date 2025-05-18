'use client';

import Image from "next/image";
import './test.css';

export default function Home() {
  return (
    <div className="test-class">
      <h1>Testing CSS</h1>
      <p>This is a test to see if CSS is working properly.</p>
      <div style={{ backgroundColor: 'green', color: 'white', padding: '20px' }}>
        This div has inline styles to test if React styling is working.
      </div>
      <Image
        src="/logo.svg"
        alt="Logo"
        width={100}
        height={100}
      />
    </div>
  );
}
