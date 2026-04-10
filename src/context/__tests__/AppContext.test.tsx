import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, act } from '@testing-library/react';
import { AppProvider, useAppContext } from '../AppContext';
import React from 'react';

// Help component to access context
const TestComponent = () => {
  const { currentUser, handleLogin } = useAppContext();
  return (
    <div>
      <div data-testid="user">{currentUser ? currentUser.name : 'no user'}</div>
      <button onClick={() => handleLogin('test', 'pass')}>Login</button>
    </div>
  );
};

describe('AppContext', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    localStorage.clear();
  });

  it('should start with no user', () => {
    const { getByTestId } = render(
      <AppProvider>
        <TestComponent />
      </AppProvider>
    );
    expect(getByTestId('user').textContent).toBe('no user');
  });

  it('should update user after login', async () => {
    const mockUser = { id: '1', name: 'Test', login: 'test', role: 'ELEVE' };
    (global.fetch as any).mockResolvedValue({
      ok: true,
      json: async () => mockUser,
    });

    const { getByTestId, getByText } = render(
      <AppProvider>
        <TestComponent />
      </AppProvider>
    );

    await act(async () => {
      getByText('Login').click();
    });

    expect(getByTestId('user').textContent).toBe('Test');
    expect(localStorage.getItem('currentUser')).toContain('Test');
  });
});
