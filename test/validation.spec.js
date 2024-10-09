import { throws, doesNotThrow } from "assert";
import Runtype from "../index.js";

class TestClass {}

class User extends Runtype {

    static scheme = {
        id:    Number,
        name:  String,
        email: String,
        verified: Boolean,
        myFunction: Function,
        myClass:   TestClass,
        contacts:  Object,
        strings:   [String],
        numbers:   [Number],
        booleans:  [Boolean],
        functions: [Function],
        nestedObjectValidation: { int: Number, str: String },

        arrayOfInstances: [TestClass],
        arrayScheme: [{
            prop1: TestClass,
            prop2: Boolean,
        }]
    };


    constructor(data){
        super(data);
    }

}

const id = 5,
      name = "Test",
      email = "test@example.com",
      verified = false,
      myFunction = () => {},
      myClass = new TestClass(),
      contacts = { aaa: 555 },
      strings = [],
      numbers = [],
      booleans = [],
      functions = [],
      nestedObjectValidation = { int: 1, str: "s" },
      nestedObjectValidationInvalidNumber = { int: '1', str: "s" },
      nestedObjectValidationInvalidString = { int: 1,   str: 5   },
      arrayOfInstances = [new TestClass(), new TestClass() ],
      arrayOfInstancesInvalid = [new TestClass(), new TestClass(), {}, new TestClass() ],

      arrayScheme = [
        { prop1: new TestClass(), prop2: true  },
        { prop1: new TestClass(), prop2: false },
      ],

      arraySchemeInvalid = [
        { prop1: new TestClass(), prop2: true },
        { prop1: {}, prop2: true },
        { prop1: new TestClass(), prop2: false },
      ]

      ;

describe('Runtime validation', () => {


    for(let invalidParam of [ 1, "", ()=>{}, true, [], null ])
        it(`Throws < '.' should be plain object > (${invalidParam})`, () => throws( () => {
            new User(invalidParam)
        }, { name: 'ValidationError', message: "'.' should be plain object" }));

    it(`Throws < 'id' should be number >`,               () => throws( () => new User({}),                                                                                       { name: 'ValidationError', message: "'id' should be number" }));
    it(`Throws < 'name' should be string >`,             () => throws( () => new User({ id }),                                                                                   { name: 'ValidationError', message: "'name' should be string" }));
    it(`Throws < 'email' should be string >`,            () => throws( () => new User({ id, name }),                                                                             { name: 'ValidationError', message: "'email' should be string" }));
    it(`Throws < 'verified' should be boolean >`,        () => throws( () => new User({ id, name, email }),                                                                      { name: 'ValidationError', message: "'verified' should be boolean" }));
    it(`Throws < 'myFunction' should be function >`,     () => throws( () => new User({ id, name, email, verified }),                                                            { name: 'ValidationError', message: "'myFunction' should be function" }));
    it(`Throws < 'Value of 'myClass' is not instance of ${TestClass.name} >`, () => throws( () => new User({ id, name, email, verified, myFunction }),                           { name: 'ValidationError', message: `Value of 'myClass' is not instance of ${TestClass.name}` }));
    
    
    // Arrays and objects
    it(`Throws < 'contacts' should be plain object >`,   () => throws( () => new User({ id, name, email, verified, myFunction, myClass }),                                       { name: 'ValidationError', message: "'contacts' should be plain object" }));
    it(`Throws < 'strings' should be array >`,           () => throws( () => new User({ id, name, email, verified, myFunction, myClass, contacts }),                             { name: 'ValidationError', message: "'strings' should be array" }));
    it(`Throws < 'numbers' should be array >`,           () => throws( () => new User({ id, name, email, verified, myFunction, myClass, contacts, strings }),                    { name: 'ValidationError', message: "'numbers' should be array" }));
    it(`Throws < 'booleans' should be array >`,          () => throws( () => new User({ id, name, email, verified, myFunction, myClass, contacts, strings, numbers }),           { name: 'ValidationError', message: "'booleans' should be array" }));
    it(`Throws < 'functions' should be array >`,         () => throws( () => new User({ id, name, email, verified, myFunction, myClass, contacts, strings, numbers, booleans }), { name: 'ValidationError', message: "'functions' should be array" }));
    
    
    
    
    
    it(`Throws < 'nestedObjectValidation' should be array >`,      () => throws( () => new User({ id, name, email, verified, myFunction, myClass, contacts, strings, numbers, booleans, functions }),
                            { name: 'ValidationError', message: "'nestedObjectValidation' should be plain object" }));

    it(`Throws < 'nestedObjectValidation.int' should be number >`, () => throws( () => new User({ id, name, email, verified, myFunction, myClass, contacts, strings, numbers, booleans, functions,
        nestedObjectValidation: nestedObjectValidationInvalidNumber 
    }),
    { name: 'ValidationError', message: "'nestedObjectValidation.int' should be number" }));

    it(`Throws < 'nestedObjectValidation.str' should be string >`, () => throws( () => new User({ id, name, email, verified, myFunction, myClass, contacts, strings, numbers, booleans, functions,
        nestedObjectValidation: nestedObjectValidationInvalidString
    }),
    { name: 'ValidationError', message: "'nestedObjectValidation.str' should be string" }));

    it(`Throws < 'arrayOfInstances' should be array >`, () => throws( () => new User({  id, name, email, verified, myFunction, myClass, contacts, strings, numbers, booleans, functions, nestedObjectValidation 
    }),
    { name: 'ValidationError', message: "'arrayOfInstances' should be array" }));

    it("Throws < Value of 'arrayOfInstances[2]' is not instance of TestClass >", () => throws( () => new User({  id, name, email, verified, myFunction, myClass, contacts,
        strings, numbers, booleans, functions, nestedObjectValidation, arrayOfInstances: arrayOfInstancesInvalid}),
    { name: 'ValidationError', message: "Value of 'arrayOfInstances[2]' is not instance of TestClass" }));

    it("Throws < 'arrayScheme' should be array >", () => throws( () => new User({ 
        id, name, email, verified, myFunction, myClass, contacts, strings, numbers, booleans, functions, nestedObjectValidation, arrayOfInstances
    }), { name: 'ValidationError', message: "'arrayScheme' should be array" }));

    it("Throws < Value of 'arrayScheme[1].prop1' is not instance of TestClass >", () => throws( () => new User({
        id, name, email, verified, myFunction, myClass, contacts, strings, numbers, booleans, functions, nestedObjectValidation, arrayOfInstances, arrayScheme: arraySchemeInvalid
    }), { name: 'ValidationError', message: "Value of 'arrayScheme[1].prop1' is not instance of TestClass" }));


    it(`Fully valid, not throws any error`, () => doesNotThrow( () => {
        new User({ id, name, email, verified, myFunction, myClass, contacts, strings, numbers, booleans, functions, nestedObjectValidation, arrayOfInstances, arrayScheme });
    }));

    
});