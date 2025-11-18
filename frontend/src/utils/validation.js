/**
 * Quy tắc: 3-50 ký tự, chỉ chứa a-z, A-Z, 0-9 [cite: 87]
 */
export const validateUsername = (username) => {
  if (!username || username.trim() === '') {
    return 'Tên đăng nhập không được để trống'; // [cite: 155]
  }
  if (username.length < 3) {
    return 'Tên đăng nhập phải có ít nhất 3 ký tự'; // [cite: 165]
  }
  if (username.length > 50) {
    return 'Tên đăng nhập không được quá 50 ký tự';
  }
  // Yêu cầu chỉ chứa a-z, A-Z, 0-9.
  // (Regex này cũng cấm khoảng trắng và ký tự đặc biệt)
  const regex = /^[a-zA-Z0-9]+$/;
  if (!regex.test(username)) {
    return 'Tên đăng nhập chỉ chứa chữ cái và số';
  }
  return ''; // Hợp lệ [cite: 173]
};

/**
 * Quy tắc: 6-100 ký tự, phải có cả chữ và số [cite: 88]
 */
export const validatePassword = (password) => {
  if (!password || password.trim() === '') {
    return 'Mật khẩu không được để trống';
  }
  if (password.length < 6) {
    return 'Mật khẩu phải có ít nhất 6 ký tự';
  }
  if (password.length > 100) {
    return 'Mật khẩu không được quá 100 ký tự';
  }
  // Phải có cả chữ và số
  const hasLetter = /[a-zA-Z]/.test(password);
  const hasNumber = /[0-9]/.test(password);
  if (!hasLetter || !hasNumber) {
    return 'Mật khẩu phải chứa cả chữ cái và số';
  }
  return ''; // Hợp lệ
};