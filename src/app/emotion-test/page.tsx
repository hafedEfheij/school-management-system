'use client';

import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import styled from '@emotion/styled';

// Styled components using emotion
const Container = styled.div`
  max-width: 1200px;
  margin: 0 auto;
  padding: 20px;
  font-family: Arial, sans-serif;
`;

const Heading = styled.h1`
  color: #6200ea;
  font-size: 2.5rem;
  text-align: center;
  margin-bottom: 30px;
`;

const Card = styled.div`
  background-color: #f8f8f8;
  border-radius: 8px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  padding: 20px;
  margin-bottom: 20px;
  border-left: 5px solid #6200ea;
`;

const Button = styled.button`
  background-color: #6200ea;
  color: white;
  border: none;
  border-radius: 4px;
  padding: 10px 20px;
  font-size: 1rem;
  cursor: pointer;
  transition: background-color 0.3s;
  
  &:hover {
    background-color: #3700b3;
  }
`;

export default function EmotionTestPage() {
  return (
    <Container>
      <Heading>Emotion CSS-in-JS Test Page</Heading>
      
      <Card>
        <h2>Testing Emotion CSS-in-JS</h2>
        <p>This page is using @emotion/styled for CSS-in-JS styling</p>
        <p>If you can see styling on this page, then Emotion is working!</p>
        
        <Button>Emotion Button</Button>
      </Card>
      
      <Card>
        <h2>Navigation</h2>
        <p>Go back to the <Link href="/">home page</Link> to see CSS modules.</p>
        <p>Or check the <Link href="/global-test">global CSS test page</Link>.</p>
        <p>Or check the <Link href="/styled-jsx-test">styled-jsx test page</Link>.</p>
      </Card>
      
      <Card>
        <h2>Logo Test</h2>
        <Image
          src="/logo.svg"
          alt="Logo"
          width={100}
          height={100}
        />
      </Card>
    </Container>
  );
}
