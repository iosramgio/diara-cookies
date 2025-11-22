import React from 'react';
import { render, screen } from '@testing-library/react';
import SEO from '../components/SEO';

describe('SEO Component', () => {
  test('renders SEO meta tags correctly', () => {
    render(
      <SEO 
        title="Test Title"
        description="Test Description"
        url="https://www.diaracookies.com/test"
        image="https://www.diaracookies.com/image.jpg"
        keywords="test, seo, cookies"
      />
    );

    // The SEO component doesn't render anything visible, 
    // but it updates the document head, which we can't easily test in this setup
    expect(document.title).toBe('Test Title | Diara Cookies');
    
    const metaDescription = document.querySelector('meta[name="description"]');
    expect(metaDescription).toBeInTheDocument();
    expect(metaDescription.content).toBe('Test Description');
  });
});