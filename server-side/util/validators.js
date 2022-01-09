const validateRegisterInput = (
    username,email,password,confirmPassword
) => {
    const errors = {};
    if(username.trim() === ''){
        errors.username = 'username must not be empty';
    }
    if(email.trim() === ''){
        errors.email = 'email must not be empty';
    }else{
        const regEx = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
        if(!email.match(regEx)){
            errors.email = "email must be a valid email address";
        }
    }
    if(password === ''){
        errors.password = 'password must not be empty';
    }else{
        var minNumberofChars = 6;
        var maxNumberofChars = 16;
        var regEx  = /^(?=.*[0-9])(?=.*[!@#$%^&*])[a-zA-Z0-9!@#$%^&*]{6,16}$/;
        if(password.length < minNumberofChars || password.length > maxNumberofChars){
            errors.password = 'password must be 6-15 charactors long';
        }else if(!password.match(regEx)){
            errors.password = "password should contain atleast one number and one special character";
        }else{
            if(password !== confirmPassword){
                errors.password = "password must match";
            }
        }       
    }
    return {
        errors,
        valid: Object.keys(errors).length <1
    }
}
const validateLoginInput = (username,password)=>{
    const errors = {};
    if(username.trim() === ''){
        errors.username = 'username must not be empty';
    }
    if(password === ''){
        errors.password = 'password must not be empty';
    }else{
        var minNumberofChars = 6;
        var maxNumberofChars = 16;
        var regEx  = /^(?=.*[0-9])(?=.*[!@#$%^&*])[a-zA-Z0-9!@#$%^&*]{6,16}$/;
        if(password.length < minNumberofChars || password.length > maxNumberofChars){
            errors.password = 'password must be 6-15 charactors long';
        }else if(!password.match(regEx)){
            errors.password = "password should contain atleast one number and one special character";
        }
    }
    return {
        errors,
        valid: Object.keys(errors).length <1
    }
}
module.exports = {validateRegisterInput,validateLoginInput};