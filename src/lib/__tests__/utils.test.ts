import { describe, it, expect } from 'vitest';
import { cn } from '../utils';

describe('utils', () => {
  describe('cn', () => {
    it('should merge class names correctly', () => {
      const result = cn('px-4', 'py-2');
      expect(result).toBe('px-4 py-2');
    });

    it('should handle conditional classes', () => {
      const result = cn('base-class', false && 'hidden', true && 'visible');
      expect(result).toBe('base-class visible');
    });

    it('should merge tailwind classes correctly', () => {
      const result = cn('p-4', 'p-2');
      expect(result).toBe('p-2');
    });
  });
});
