const Joi = require("joi");


// user input validation 
module.exports.loginValidation = async (obj) => {
    const login_schema = Joi.object({
        username : Joi.string()
            .alphanum()
            .required()

        , password : Joi.string()
            .alphanum() 
            .required()

        , remember : Joi.boolean().required()
    })
    .with('username', 'password');


    try  // validate
    {
        const output = await login_schema.validateAsync(obj);
        return output; 
    }
    catch(err)
    {
        return { err : err };
    }
}


module.exports.registerValidation = async (obj) => {
    const register_schema = Joi.object({
        username : Joi.string()
            .alphanum()
            .min(5)
            .required()

        , email : Joi.string()
            .email()
            .required()

        , password : Joi.string()
            .alphanum() 
            .min(8)
            .required()

        , re_password : Joi.ref('password') 
    })
    .with('password', 're_password');


    try  // validate
    {
        const output = await register_schema.validateAsync(obj);
        return output; 
    }
    catch(err)
    {
        return { err : err };
    }
}