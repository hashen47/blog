const Joi = require("joi");


// authentication validations
// user input validation 
module.exports.loginValidation = async (obj) => {
    const login_schema = Joi.object({
        username : Joi.string()
            .alphanum()
            .required()

        , password : Joi.string()
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
        return { err : err.details[0].message };
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
        return { err : err.details[0].message };
    }
}


// blog post create validation
module.exports.createValidation = async (obj) => {
    const create_schema = Joi.object({  
        title : Joi.string()
            .required()
            .min(10)
            .max(254)
        
        , content : Joi.string()
            .required()
            .min(10)
            .max(599)
    })
    .with('title', 'content');

    try
    {
        const output = await create_schema.validateAsync(obj);
        return output;
    }
    catch(err)
    {
        return { err : err.details[0].message };
    }
}


// blog post delete validation
module.exports.delValidation = async (obj) => {
    const del_schema = Joi.object({  
        pid : Joi.number().required()
    })

    try
    {
        const output = await del_schema.validateAsync(obj);
        return output;
    }
    catch(err)
    {
        return { err : err.details[0].message };
    }
}


module.exports.updateValidation = async(obj) => {
    const update_schema = Joi.object({  
        title : Joi.string()
            .required()
            .min(10)
            .max(254)
        
        , content : Joi.string()
            .required()
            .min(10)
            .max(599)

        , puid : Joi.number()
            .required()
    })
    .with('title', 'content');

    try
    {
        const output = await update_schema.validateAsync(obj);
        return output;
    }
    catch(err)
    {
        return { err : err.details[0].message };
    }
}


module.exports.commentValidation = async(obj) => {
    const schema = Joi.object({
        pid : Joi.number().required(),
        comment : Joi.string().required()
    })

    try
    {
        const output = await schema.validateAsync(obj);
        return output;
    }
    catch(err)
    {
        return { err : err.details[0].message };
    }
}



