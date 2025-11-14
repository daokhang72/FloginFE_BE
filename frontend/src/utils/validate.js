const USERNAME_REGEX = /^[a-zA-Z0-9._-]{3,50}$/;
const PASSWPRD_REGEX = /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{6,100}$/;

export const validateUsername = (username) => {
    const trimUsername = username ? username.trim(): '';
    if(trimUsername === ''){
        return 'Username khong duoc de trong';
    }
    if(!USERNAME_REGEX.test(trimUsername)){
        return 'Username phai tu 3 - 50 ky tu va chi chua (a-z, A-Z, 0-9, ., _, -, ...';
    }
    return null;
};

export const validatePassword = (password) => {
    if(!password){
        return 'Password khong duoc de trong';
    }
    if(!PASSWPRD_REGEX.test(password)){
        return 'Password phai co it nhat 6-100 ky tu, gom ca chu va so';
    }
    return null;
};

export const validateLoginForm = (values) => {
    const error = {};
    const usernameError = validateUsername(values.username);
    if(usernameError){
        error.username = usernameError;
    }  
    const passwordError = validatePassword(values.password);
    if(passwordError){
        error.password = passwordError;
    }
    return error;
};
