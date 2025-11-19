import { render, screen, fireEvent, cleanup } from '@testing-library/react';
import { describe, it, expect, vi, afterEach } from 'vitest';
import Breadcrumb from './Breadcrumb';

describe('Breadcrumb', () => {
  afterEach(() => cleanup());

  it('renders breadcrumb items and separators', () => {
    render(
      <Breadcrumb
        items={[
          { title: 'Home', onClick: vi.fn() },
          { title: 'Library', onClick: vi.fn() },
          { title: 'Data' },
        ]}
      />
    );
    // All items
    expect(screen.getAllByText('Home')[0]).toBeTruthy();
    expect(screen.getAllByText('Library')[0]).toBeTruthy();
    expect(screen.getAllByText('Data')[0]).toBeTruthy();
    // Separators
    expect(screen.getAllByText('>')).toHaveLength(2);
  });

  it('calls onClick for clickable items', () => {
    const onHome = vi.fn();
    const onLibrary = vi.fn();
    render(
      <Breadcrumb
        items={[
          { title: 'Home', onClick: onHome },
          { title: 'Library', onClick: onLibrary },
          { title: 'Data' },
        ]}
      />
    );
    fireEvent.click(screen.getAllByText('Home')[0]);
    fireEvent.click(screen.getAllByText('Library')[0]);
    expect(onHome).toHaveBeenCalledTimes(1);
    expect(onLibrary).toHaveBeenCalledTimes(1);
  });

  it('renders the last item as current (not clickable)', () => {
    render(
      <Breadcrumb
        items={[{ title: 'Home', onClick: vi.fn() }, { title: 'Data' }]}
      />
    );
    // There may be multiple 'Data' elements, so check at least one is a SPAN
    const allData = screen.getAllByText('Data');
    expect(allData.some((el) => el.tagName === 'SPAN')).toBe(true);
  });
});
