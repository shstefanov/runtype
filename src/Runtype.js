
const utils = {
    isObject:   value => value?.constructor === Object,
    isArray:    value => Array.isArray(value),
    isClass:    value => typeof value === 'function' && /^class\s/.test(Function.prototype.toString.call(value)),
    isFunction: value => typeof value === 'function',
    isNumber:   value => typeof value === "number",
    isString:   value => typeof value === "string",
    isBoolean:  value => typeof value === "boolean",
    isRegExp:   value => value instanceof RegExp,
};





class ValidationError extends Error { get name(){ return "ValidationError" }}



export default class Model {

    static types = utils;

    #data = null;
    #setData(data){ this.#data = this.#validate(data, this.constructor.scheme); }
    #classes = new Set();
    constructor(data){
        this.#setData(data);
        const checkClasses = (scheme) => {
            for(let key of scheme){
                if(utils.isClass(scheme[key])) this.#classes.add(scheme[key]);
                else if(utils.isObject(scheme[key])) checkClasses(scheme[key]);
                else if(utils.isArray(scheme[key])) checkClasses({test: scheme[key][0]});
            }
        }
    }

    isClass(value){ return this.#classes.has(value); }

    #validate(data, scheme = this.constructor.scheme, error_subject){

        if(scheme === Number) {
            if(utils.isNumber(data)) return data;
            throw new ValidationError( `'${ error_subject || "."}' should be number`);
        }

        else if(scheme === String) {
            if(utils.isString(data)) return data;
            throw new ValidationError( `'${ error_subject || "."}' should be string`); 
        }

        else if(scheme === Boolean) {
            if(utils.isBoolean(data)) return data;
            throw new ValidationError( `'${ error_subject || "."}' should be boolean`); 
        }

        else if(utils.isClass(scheme)) {
            if(data instanceof scheme) return data;
            throw new ValidationError( `Value of '${ error_subject || "."}' is not instance of ${scheme.name}`);
        }

        else if(scheme === Function) {
            if(utils.isFunction(data)) return data;
            throw new ValidationError( `'${ error_subject || "."}' should be function`);
        }

        else if(scheme === Object) {
            if(utils.isObject(data)) return data;
            throw new ValidationError( `'${ error_subject || "."}' should be plain object`);
        }

        else if(utils.isFunction(scheme)) {
            if(scheme(data)) return data;
            throw new ValidationError( `Invalid value for '${ error_subject || "."}'`);
        }

        else if(utils.isRegExp(scheme)){
            if(!utils.isString(data)) throw new ValidationError( `'${ error_subject || "."}' should be string`);
            if(!scheme.test(data)) throw new ValidationError( `Invalid value for '${ error_subject || "."}'`);
            return data;            
        }

        // Recursive operations
        else if(utils.isObject(scheme)){
            if(!utils.isObject(data)) throw new ValidationError( `'${ error_subject || "."}' should be plain object`);
            const result = {};
            for(let key in scheme){
                result[key] = this.#validate(data[key], scheme[key], error_subject ? `${error_subject}.${key}` : key);
            }
            return result;
        }

        else if(utils.isArray(scheme) && scheme.length === 1){
            if(!utils.isArray(data)) throw new ValidationError( `'${ error_subject || "."}' should be array`);
            return data.map( (item, i) => this.#validate(item, scheme[0], error_subject ? `${error_subject}[${i}]` : `[${i}]`) );
        }

        else if(utils.isArray(scheme) && scheme.length > 1){
            let value;
            for(let s of scheme) value = this.#validate(data, scheme, error_subject);
            return value;
        }

        // Fallback
        else {
            throw new ValidationError(`Unsupported validator for ${error_subject || "."}`);
        }

    }

    
    getData(){ return this.#data; }


}



