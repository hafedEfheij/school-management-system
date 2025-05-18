'use client';

import React from 'react';
import Link from 'next/link';

const TestNavigation = () => {
  return (
    <div style={{
      position: 'fixed',
      bottom: '20px',
      right: '20px',
      backgroundColor: '#333',
      color: 'white',
      padding: '15px',
      borderRadius: '10px',
      boxShadow: '0 4px 8px rgba(0,0,0,0.2)',
      zIndex: 1000
    }}>
      <h3 style={{ marginTop: 0, marginBottom: '10px' }}>Test Navigation</h3>
      <ul style={{ listStyle: 'none', padding: 0, margin: 0 }}>
        <li style={{ marginBottom: '8px' }}>
          <Link href="/" style={{ color: 'white', textDecoration: 'none' }}>
            Home (CSS Modules)
          </Link>
        </li>
        <li style={{ marginBottom: '8px' }}>
          <Link href="/global-test" style={{ color: 'white', textDecoration: 'none' }}>
            Global CSS Test
          </Link>
        </li>
        <li style={{ marginBottom: '8px' }}>
          <Link href="/styled-jsx-test" style={{ color: 'white', textDecoration: 'none' }}>
            Styled JSX Test
          </Link>
        </li>
        <li style={{ marginBottom: '8px' }}>
          <Link href="/emotion-test" style={{ color: 'white', textDecoration: 'none' }}>
            Emotion CSS Test
          </Link>
        </li>
      </ul>
    </div>
  );
};

export default TestNavigation;
