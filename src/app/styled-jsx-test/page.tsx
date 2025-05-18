'use client';

import React from 'react';
import Image from 'next/image';
import Link from 'next/link';

export default function StyledJsxTestPage() {
  return (
    <div className="container">
      <h1 className="heading">Styled JSX Test Page</h1>
      
      <div className="card">
        <h2>Testing Styled JSX</h2>
        <p>This page is using styled-jsx which is built into Next.js</p>
        <p>If you can see styling on this page, then styled-jsx is working!</p>
        
        <button className="button">Styled JSX Button</button>
      </div>
      
      <div className="card">
        <h2>Navigation</h2>
        <p>Go back to the <Link href="/">home page</Link> to see CSS modules.</p>
        <p>Or check the <Link href="/global-test">global CSS test page</Link>.</p>
      </div>
      
      <div className="card">
        <h2>Logo Test</h2>
        <Image
          src="/logo.svg"
          alt="Logo"
          width={100}
          height={100}
        />
      </div>

      <style jsx>{`
        .container {
          max-width: 1200px;
          margin: 0 auto;
          padding: 20px;
          font-family: Arial, sans-serif;
        }
        
        .heading {
          color: #d32f2f;
          font-size: 2.5rem;
          text-align: center;
          margin-bottom: 30px;
        }
        
        .card {
          background-color: #f8f8f8;
          border-radius: 8px;
          box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
          padding: 20px;
          margin-bottom: 20px;
          border-left: 5px solid #d32f2f;
        }
        
        .button {
          background-color: #d32f2f;
          color: white;
          border: none;
          border-radius: 4px;
          padding: 10px 20px;
          font-size: 1rem;
          cursor: pointer;
          transition: background-color 0.3s;
        }
        
        .button:hover {
          background-color: #b71c1c;
        }
      `}</style>
    </div>
  );
}
