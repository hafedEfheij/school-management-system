'use client';

import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import '../../styles/global.css';

export default function GlobalTestPage() {
  return (
    <div className="global-container">
      <h1 className="global-heading">Global CSS Test Page</h1>
      
      <div className="global-card">
        <h2>Testing Global CSS</h2>
        <p>This page is using global CSS imported from src/styles/global.css</p>
        <p>If you can see styling on this page, then global CSS is working!</p>
        
        <button className="global-button">Global CSS Button</button>
      </div>
      
      <div className="global-card">
        <h2>Navigation</h2>
        <p>Go back to the <Link href="/">home page</Link> to see CSS modules.</p>
      </div>
      
      <div className="global-card">
        <h2>Logo Test</h2>
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
