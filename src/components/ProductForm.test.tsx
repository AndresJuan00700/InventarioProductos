import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { ProductProvider } from '../context/ProductContext';
import ProductForm from './ProductForm';

describe('ProductForm', () => {
  const renderProductForm = () => {
    return render(
      <ProductProvider>
        <ProductForm />
      </ProductProvider>
    );
  };

  it('renders all form fields', () => {
    renderProductForm();
    
    expect(screen.getByLabelText(/código/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/nombre/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/descripción/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/cantidad/i)).toBeInTheDocument();
  });

  it('shows validation error when submitting empty form', async () => {
    renderProductForm();
    
    const submitButton = screen.getByRole('button', { name: /agregar producto/i });
    await userEvent.click(submitButton);
    
    expect(await screen.findByText(/campos.*obligatorios/i)).toBeInTheDocument();
  });

  it('successfully submits form with valid data', async () => {
    renderProductForm();
    
    await userEvent.type(screen.getByLabelText(/código/i), '1001');
    await userEvent.type(screen.getByLabelText(/nombre/i), 'Test Product');
    await userEvent.type(screen.getByLabelText(/descripción/i), 'Test Description');
    await userEvent.type(screen.getByLabelText(/cantidad/i), '10');
    
    const submitButton = screen.getByRole('button', { name: /agregar producto/i });
    await userEvent.click(submitButton);
    
    // Form should be reset after successful submission
    await waitFor(() => {
      expect(screen.getByLabelText(/código/i)).toHaveValue('');
      expect(screen.getByLabelText(/nombre/i)).toHaveValue('');
    });
  });

  it('validates numeric fields', async () => {
    renderProductForm();
    
    const codigoInput = screen.getByLabelText(/código/i);
    const cantidadInput = screen.getByLabelText(/cantidad/i);
    
    await userEvent.type(codigoInput, '-1');
    await userEvent.type(cantidadInput, '-5');
    
    const submitButton = screen.getByRole('button', { name: /agregar producto/i });
    await userEvent.click(submitButton);
    
    expect(await screen.findByText(/código debe ser.*positivo/i)).toBeInTheDocument();
    expect(await screen.findByText(/cantidad debe ser.*no negativo/i)).toBeInTheDocument();
  });
});