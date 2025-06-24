import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import LandingPage from '@/components/LandingPage';

describe('LandingPage', () => {
  it('renders the main heading correctly', () => {
    const mockOnShowAuth = vi.fn();
    
    render(<LandingPage onShowAuth={mockOnShowAuth} />);
    
    expect(screen.getByText('Find Your Perfect')).toBeInTheDocument();
    expect(screen.getByText('Student Home')).toBeInTheDocument();
  });

  it('renders the StudyNest brand name', () => {
    const mockOnShowAuth = vi.fn();
    
    render(<LandingPage onShowAuth={mockOnShowAuth} />);
    
    expect(screen.getByText('StudyNest')).toBeInTheDocument();
  });

  it('renders all three feature cards', () => {
    const mockOnShowAuth = vi.fn();
    
    render(<LandingPage onShowAuth={mockOnShowAuth} />);
    
    expect(screen.getByText('Find Properties')).toBeInTheDocument();
    expect(screen.getByText('Connect Directly')).toBeInTheDocument();
    expect(screen.getByText('Safe & Secure')).toBeInTheDocument();
  });

  it('calls onShowAuth when Sign In button is clicked', () => {
    const mockOnShowAuth = vi.fn();
    
    render(<LandingPage onShowAuth={mockOnShowAuth} />);
    
    const signInButton = screen.getByRole('button', { name: /sign in/i });
    fireEvent.click(signInButton);
    
    expect(mockOnShowAuth).toHaveBeenCalledTimes(1);
  });

  it('calls onShowAuth when Get Started button is clicked', () => {
    const mockOnShowAuth = vi.fn();
    
    render(<LandingPage onShowAuth={mockOnShowAuth} />);
    
    const getStartedButton = screen.getByRole('button', { name: /get started/i });
    fireEvent.click(getStartedButton);
    
    expect(mockOnShowAuth).toHaveBeenCalledTimes(1);
  });

  it('calls onShowAuth when Sign Up Now button is clicked', () => {
    const mockOnShowAuth = vi.fn();
    
    render(<LandingPage onShowAuth={mockOnShowAuth} />);
    
    const signUpButton = screen.getByRole('button', { name: /sign up now/i });
    fireEvent.click(signUpButton);
    
    expect(mockOnShowAuth).toHaveBeenCalledTimes(1);
  });

  it('renders the description text', () => {
    const mockOnShowAuth = vi.fn();
    
    render(<LandingPage onShowAuth={mockOnShowAuth} />);
    
    expect(screen.getByText(/Connect with trusted property owners and discover affordable/)).toBeInTheDocument();
  });

  it('renders the call-to-action section', () => {
    const mockOnShowAuth = vi.fn();
    
    render(<LandingPage onShowAuth={mockOnShowAuth} />);
    
    expect(screen.getByText('Ready to Find Your Home?')).toBeInTheDocument();
    expect(screen.getByText(/Join thousands of students who have found their perfect accommodation/)).toBeInTheDocument();
  });
}); 