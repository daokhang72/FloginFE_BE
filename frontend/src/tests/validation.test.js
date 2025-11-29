import { validateUsername, validatePassword } from '../utils/validation';

describe('Login Validation Tests (Frontend)', () => {

    // --- TEST CHO USERNAME ---
    describe('validateUsername', () => {
        test('TC_LOGIN_001: Username rỗng hoặc khoảng trắng', () => {
            expect(validateUsername('')).toBe('Tên đăng nhập không được để trống');
            expect(validateUsername('   ')).toBe('Tên đăng nhập không được để trống');
        });

        test('TC_LOGIN_002: Username quá ngắn (< 3 ký tự)', () => {
            expect(validateUsername('ab')).toBe('Tên đăng nhập phải có ít nhất 3 ký tự');
        });

        test('TC_LOGIN_003: Username quá dài (> 50 ký tự)', () => {
            const longName = 'a'.repeat(51);
            expect(validateUsername(longName)).toBe('Tên đăng nhập không được quá 50 ký tự');
        });

        test('TC_LOGIN_004: Username chứa ký tự đặc biệt hoặc khoảng trắng', () => {
            expect(validateUsername('user@123')).toBe('Tên đăng nhập chỉ chứa chữ cái và số');
            expect(validateUsername('user 123')).toBe('Tên đăng nhập chỉ chứa chữ cái và số');
        });

        test('TC_LOGIN_005: Username hợp lệ', () => {
            expect(validateUsername('testuser1')).toBe('');
            expect(validateUsername('ADMIN')).toBe('');
        });
    });

    // --- TEST CHO PASSWORD ---
    describe('validatePassword', () => {
        test('TC_LOGIN_006: Password rỗng hoặc khoảng trắng', () => {
            expect(validatePassword('')).toBe('Mật khẩu không được để trống');
            expect(validatePassword('   ')).toBe('Mật khẩu không được để trống');
        });

        test('TC_LOGIN_007: Password quá ngắn (< 6 ký tự)', () => {
            expect(validatePassword('12345')).toBe('Mật khẩu phải có ít nhất 6 ký tự');
        });

        test('TC_LOGIN_008: Password quá dài (> 100 ký tự)', () => {
            const longPass = 'a'.repeat(101);
            expect(validatePassword(longPass)).toBe('Mật khẩu không được quá 100 ký tự');
        });

        test('TC_LOGIN_009: Password thiếu chữ cái (Chỉ có số)', () => {
            expect(validatePassword('12345678')).toBe('Mật khẩu phải chứa cả chữ cái và số');
        });

        test('TC_LOGIN_010: Password thiếu số (Chỉ có chữ)', () => {
            expect(validatePassword('abcdefgh')).toBe('Mật khẩu phải chứa cả chữ cái và số');
        });

        test('TC_LOGIN_011: Password hợp lệ (Có cả chữ và số)', () => {
            expect(validatePassword('Test1234')).toBe('');
        });
    });
});