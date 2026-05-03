/**
 * Example test for AddCandidateForm component
 * Demuestra las mejores prácticas para testing de componentes React
 */

import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import '@testing-library/jest-dom';

// Mock del componente (reemplazar con la importación real)
const AddCandidateForm = ({ onSubmit }: { onSubmit: (data: any) => void }) => (
  <form data-testid="add-candidate-form">
    <input
      data-testid="firstname-input"
      placeholder="First Name"
      defaultValue=""
    />
    <input
      data-testid="email-input"
      type="email"
      placeholder="Email"
      defaultValue=""
    />
    <button type="submit">Add Candidate</button>
  </form>
);

describe('AddCandidateForm Component', () => {
  describe('Rendering', () => {
    it('should render the form with all required fields', () => {
      const mockSubmit = jest.fn();
      render(<AddCandidateForm onSubmit={mockSubmit} />);

      expect(screen.getByTestId('add-candidate-form')).toBeInTheDocument();
      expect(screen.getByTestId('firstname-input')).toBeInTheDocument();
      expect(screen.getByTestId('email-input')).toBeInTheDocument();
      expect(screen.getByRole('button', { name: /add candidate/i })).toBeInTheDocument();
    });
  });

  describe('User Interactions', () => {
    it('should update input values when user types', async () => {
      const mockSubmit = jest.fn();
      const user = userEvent.setup();
      render(<AddCandidateForm onSubmit={mockSubmit} />);

      const firstNameInput = screen.getByTestId('firstname-input') as HTMLInputElement;
      const emailInput = screen.getByTestId('email-input') as HTMLInputElement;

      await user.type(firstNameInput, 'Juan');
      await user.type(emailInput, 'juan@example.com');

      expect(firstNameInput.value).toBe('Juan');
      expect(emailInput.value).toBe('juan@example.com');
    });

    it('should call onSubmit when form is submitted', async () => {
      const mockSubmit = jest.fn();
      const user = userEvent.setup();
      render(<AddCandidateForm onSubmit={mockSubmit} />);

      const submitButton = screen.getByRole('button', { name: /add candidate/i });
      await user.click(submitButton);

      expect(mockSubmit).toHaveBeenCalled();
    });
  });
});
