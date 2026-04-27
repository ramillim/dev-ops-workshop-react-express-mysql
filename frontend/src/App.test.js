import React from 'react';
import { render } from '@testing-library/react';
import App from './App';

test('renders the TODO list page header', () => {
  const { getByText } = render(<App />);
  const headerElement = getByText(/Trivial TODO List/i);
  expect(headerElement).toBeInTheDocument();
});
