import Loading from '@/lib/components/Loading/Loading';
import { render, screen, cleanup } from '@testing-library/react';
import { describe, it, expect, afterEach } from 'vitest';

describe('Loading', () => {
  afterEach(() => cleanup());

  it('renders the loading spinner', () => {
    render(<Loading />);
    const spinner = screen.getByTestId('loading-spinner');
    expect(spinner).toBeTruthy();
    expect(spinner.querySelectorAll('div').length).toBe(4);
  });

  it('applies custom style', () => {
    render(<Loading style={{ color: 'red' }} />);
    const spinner = screen.getByTestId('loading-spinner');
    expect(spinner).toBeTruthy();
    expect(spinner.style.color).toBe('red');
  });
});
