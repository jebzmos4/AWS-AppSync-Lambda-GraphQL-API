const lambda = require('./lambda');
require('dotenv').config();

const handler = lambda.lambdaHandler;

describe('Describe Invalid Event', () => {

  test('Event field must be valid', done => {
    const event = {
      field: 'crudUser',
      arguments: { 
        id: '123',
        firstname: 'Morifeoluwa',
        lastname: 'JEyt',
        email: 'daddy@g.com' 
      } 
    }
    const context = {};
    function callback(data) {
      expect(data).toBe(`Unknown field, unable to resolve ${event.field}`);
      done();
    }
    handler(event, context, callback);
  })
});

describe('Create User Event', () => {

  test('Should Successfully create a user', done => {
    const event = {
      field: 'createUser',
      arguments: { 
        id: '1234',
        firstname: 'Mofe',
        lastname: 'Jebz',
        email: 'Mofe@g.com' 
      } 
    }
    const context = {};
    function callback(data) {
      expect(data).toBe('User Successfully Added');
      done();
    }
    handler(event, context, callback);
  });

  test('Should not create a user without id', done => {
    const event = {
      field: 'createUser',
      arguments: {
        firstname: 'Mofe',
        lastname: 'Jebz',
        email: 'mofe@g.com',
        age: 24
      } 
    }
    const context = {};
    function callback(data) {
      expect(data).toBe('One or more parameter values were invalid: Missing the key id in the item');
      done();
    }
    handler(event, context, callback);
  });
});

describe('Get User Event', () => {

  test('Should Successfully fetch all users', done => {
    const event = {
      field: 'getUsers',
      arguments: {}
    }
    const context = {};
    function callback(data) {
      expect(typeof(data)).toBe("object");
      expect(data[0]).toEqual({ email: "Mofe@g.com", firstname: "Mofe", lastname: "Jebz"});
      done();
    }
    handler(event, context, callback);
  });

  test('Should return empty response for an invalid id', done => {
    const event = {
      field: 'getUser',
      arguments: {
        id: 'morife'
      } 
    }
    const context = {};
    function callback(data) {
      expect(data).toEqual({"age": "", "email": "", "firstname": "", "id": "", "lastname": ""});
      done();
    }
    handler(event, context, callback);
  });

  test('Should fetch a user with a valid ID', done => {
    const event = {
      field: 'getUser',
      arguments: {
        id: '1234'
      } 
    }
    const context = {};
    function callback(data) {
      expect(data).toEqual({"age": undefined, "email": "Mofe@g.com", "firstname": "Mofe", "id": "1234", "lastname": "Jebz"});
      done();
    }
    handler(event, context, callback);
  });

});


describe('Update User Event', () => {
  
  test('Should not update a user with invalid id', done => {
    const event = {
      field: 'updateUser',
      arguments: { 
        id: '1',
        firstname: 'Mofehintola',
        lastname: 'Jebutu',
        email: 'mofe@j.com',
        age: '24'
      } 
    }
    const context = {};
    function callback(data) {
      expect(data).toBe('user does not exist');
      done();
    }
    handler(event, context, callback);
  });

  test('Should Successfully update a user', done => {
    const event = {
      field: 'updateUser',
      arguments: { 
        id: '1234',
        firstname: 'Mofehintola',
        lastname: 'Jebutu',
        email: 'mofe@j.com',
        age: '24'
      } 
    }
    const context = {};
    function callback(data) {
      expect(data).toEqual({"age": "24", "email": "mofe@j.com", "firstname": "Mofehintola", "id": "1234", "lastname": "Jebutu"});
      done();
    }
    handler(event, context, callback);
  });
});

describe('Delete User Event', () => {

  test('Should not delete a user with invalid id', done => {
    const event = {
      field: 'deleteUser',
      arguments: { 
        id: 'pastor' 
      } 
    }
    const context = {};
    function callback(data) {
      expect(data).toBe('User does not exist');
      done();
    }
    handler(event, context, callback);
  });

  test('Should successfully delete a user', done => {
    const event = {
      field: 'deleteUser',
      arguments: {
        id: '1234' 
      } 
    }
    const context = {};
    function callback(data) {
      expect(data).toBe('successfully deleted user');
      done();
    }
    handler(event, context, callback);
  });
});