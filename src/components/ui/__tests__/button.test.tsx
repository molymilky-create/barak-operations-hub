import { describe, it, expect } from 'vitest';
import { render } from '@testing-library/react';
import { Button } from '../button';

describe('Button', () => {
  it('should render button with text', () => {
    const { getByRole } = render(<Button>Click me</Button>);
    expect(getByRole('button', { name: /click me/i })).toBeInTheDocument();
  });

  it('should apply default variant', () => {
    const { getByRole } = render(<Button>Default</Button>);
    const button = getByRole('button');
    expect(button).toHaveClass('bg-primary');
  });

  it('should apply secondary variant', () => {
    const { getByRole } = render(<Button variant="secondary">Secondary</Button>);
    const button = getByRole('button');
    expect(button).toHaveClass('bg-secondary');
  });

  it('should be disabled when disabled prop is true', () => {
    const { getByRole } = render(<Button disabled>Disabled</Button>);
    const button = getByRole('button');
    expect(button).toBeDisabled();
  });
});
