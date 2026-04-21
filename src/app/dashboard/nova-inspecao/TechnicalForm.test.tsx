/**
 * @jest-environment jsdom
 */
import { render, screen, fireEvent } from '@testing-library/react';
import NovaInspecaoPage from './page';
import { useRouter } from 'next/navigation';

// Mock localStorage
const localStorageMock = (function() {
  let store: Record<string, string> = {};
  return {
    getItem: (key: string) => store[key] || null,
    setItem: (key: string, value: string) => { store[key] = value.toString(); },
    clear: () => { store = {}; },
    removeItem: (key: string) => { delete store[key]; }
  };
})();
Object.defineProperty(window, 'localStorage', { value: localStorageMock });

// Mock dependencies
jest.mock('next/navigation', () => ({
  useRouter: jest.fn()
}));

jest.mock('@/contexts/BrandContext', () => ({
  useBrand: () => ({ brand: { primaryColor: '#000', name: 'Test' } })
}));

describe('NovaInspecao Technical Form', () => {
  const mockPush = jest.fn();
  
  beforeEach(() => {
    (useRouter as jest.Mock).mockReturnValue({ push: mockPush });
    // Clear localStorage
    window.localStorage.clear();
  });

  it('renders technical form sections instead of dropzone', () => {
    render(<NovaInspecaoPage />);
    
    expect(screen.getByText(/Condições Ambientais/i)).toBeInTheDocument();
    expect(screen.getByText(/Equipamentos Utilizados/i)).toBeInTheDocument();
    expect(screen.getByText(/Procedimento de Inspeção/i)).toBeInTheDocument();
  });

  it('validates mandatory fields before allowing registration', () => {
    render(<NovaInspecaoPage />);
    
    const submitBtn = screen.getByRole('button', { name: /Registrar Inspeção/i });
    expect(submitBtn).toBeDisabled();
    
    const tempInput = screen.getByLabelText(/Temperatura/i);
    expect(tempInput).toBeRequired();
    
    const droneInput = screen.getByLabelText(/Drone/i);
    expect(droneInput).toBeRequired();
  });

  it('handles field changes correctly', () => {
    render(<NovaInspecaoPage />);
    
    const tempInput = screen.getByLabelText(/Temperatura/i) as HTMLInputElement;
    fireEvent.change(tempInput, { target: { value: '35' } });
    expect(tempInput.value).toBe('35');
    
    const droneInput = screen.getByLabelText(/Drone/i) as HTMLInputElement;
    fireEvent.change(droneInput, { target: { value: 'DJI M300' } });
    expect(droneInput.value).toBe('DJI M300');
  });
});
