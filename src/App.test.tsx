import React from 'react';
import { render, screen } from '@testing-library/react';
import FieldElement from './model/FieldElement';
import App from './App';

test('renders learn react link', () => {
  render(<App />);
  const linkElement = screen.getByText(/learn react/i);
  expect(linkElement).toBeInTheDocument();
});

// test('Can multiply', () => {
//   var a = new FiniteElement(3,13)
//   var b = new FiniteElement(12,13)
//   var c = new FiniteElement(10,13)
//   expect(a.multiply(b)).toBe(c)
// });
