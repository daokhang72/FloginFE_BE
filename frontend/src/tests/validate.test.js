// src/utils/validate.test.js
import { validateLoginForm } from './validate';

describe('validateLoginForm', () => {

  test('should return errors when username and password are empty', () => {
    const result = validateLoginForm({ username: '', password: '' });
    expect(result).toEqual({
      username: 'Username không được để trống',
      password: 'Password không được để trống',
    });
  });

  test('should return error when password violates regex (too short)', () => {
    const result = validateLoginForm({ username: 'user', password: '123' });
    expect(result).toEqual({
      password: 'Password phải có ít nhất 6 ký tự, gồm cả chữ và số',
    });
  });

  test('should return empty object when username and password are valid', () => {
    const result = validateLoginForm({ username: 'user', password: 'password123' });
    expect(result).toEqual({});
  });

  test('should return errors for whitespace input', () => {
    const result = validateLoginForm({ username: '   ', password: '   ' });
    expect(result).toEqual({
      username: 'Username không được để trống',
      password: 'Password không được để trống',
    });
  });

  test('should return error for invalid username format (regex)', () => {
    const result = validateLoginForm({ username: 'a!', password: 'password123' });
    expect(result).toEqual({
      username: 'Username phải từ 3-50 ký tự và chỉ chứa a-z, A-Z, 0-9, -, ., _',
    });
  });

  test('should return error when password has no number (regex)', () => {
    const result = validateLoginForm({ username: 'user', password: 'password' });
    expect(result).toEqual({
      password: 'Password phải có ít nhất 6 ký tự, gồm cả chữ và số',
    });
  });
  
  test('should return error when password has no letter (regex)', () => {
    const result = validateLoginForm({ username: 'user', password: '1234567' });
    expect(result).toEqual({
      password: 'Password phải có ít nhất 6 ký tự, gồm cả chữ và số',
    });
  });

  test('should return empty object for another valid input', () => {
    const result = validateLoginForm({ username: 'user.name_01', password: 'myPass1' });
    expect(result).toEqual({});
  });
});