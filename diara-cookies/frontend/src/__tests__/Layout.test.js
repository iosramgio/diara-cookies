import React from 'react';
import { render, screen } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import Layout from '../components/Layout';

describe('Layout Component', () => {
  test('renders header with logo and navigation', () => {
    render(
      <BrowserRouter>
        <Layout>
          <div>Test Child Component</div>
        </Layout>
      </BrowserRouter>
    );

    // Check if logo is present
    expect(screen.getByRole('heading', { name: /diara cookies/i })).toBeInTheDocument();

    // Check if navigation links are present
    expect(screen.getByRole('link', { name: /beranda/i })).toBeInTheDocument();
    expect(screen.getByRole('link', { name: /produk/i })).toBeInTheDocument();
    expect(screen.getByRole('link', { name: /keranjang/i })).toBeInTheDocument();

    // Check if children are rendered
    expect(screen.getByText(/test child component/i)).toBeInTheDocument();
  });

  test('renders footer', () => {
    render(
      <BrowserRouter>
        <Layout>
          <div>Test Content</div>
        </Layout>
      </BrowserRouter>
    );

    expect(screen.getByText(/hak cipta dilindungi/i)).toBeInTheDocument();
  });
});