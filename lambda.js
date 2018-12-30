let AWS = require('aws-sdk');
const dotenv = require('dotenv');

dotenv.config();

AWS.config.update({
    region: "us-west-2"
});

let dynamo = new AWS.DynamoDB.DocumentClient();
let table = process.env.TABLE_NAME;

exports.lambdaHandler =  (event, context, callback) => {
    let getParams = {
        TableName: table,
        Key: {
            'id': event.arguments.id
        }
    };

    let putParams = {
        TableName: table,
        Item: {
            'id': event.arguments.id,
            'firstname': event.arguments.firstname,
            'lastname': event.arguments.lastname,
            'email': event.arguments.email,
            'age': event.arguments.age,
            'created_at': Date.now()
        }
    };

    let allParams = {
        TableName: table,
        ProjectionExpression: "firstname, lastname, email, age"
    }

    let deleteParams = {
        TableName: table,
        Key: {
            "id": event.arguments.id
        }
    };
    switch(event.field || event.fields) {
        case "getUsers":
            dynamo.scan(allParams, function(err, data) {
                if (err) {
                    console.error("Unable to fetch user records. Error JSON:", JSON.stringify(err, null, 2));
                } else {
                    console.log("successfully fetched all records", data);
                    let results = data.Items;
                    console.log(data.Items);
                    return callback(results, null);
                }
            });
            break;
        case "getUser":
            dynamo.get(getParams, function(err, data) {
                if (err) {
                    console.error("Error JSON: ", JSON.stringify(err, null, 2));
                    return err;
                } else if (data.Item == undefined) {
                    let result = {
                        "id": "",
                        "firstname": "",
                        "lastname": "",
                        "email": "",
                        "age": ""
                    };
                    return callback(result, null);
                } else {
                    console.log('User Exists: ', JSON.stringify(data, null, 2));
                    let result = {
                        "id": data.Item.id,
                        "firstname": data.Item.firstname,
                        "lastname": data.Item.lastname,
                        "email": data.Item.email,
                        "age": data.Item.age
                    };
                    return callback(result, null);
                }
            });
            break;
        case "updateUser":
            dynamo.get(getParams, function(err, data) {
                if (err) {
                    res = JSON.stringify(err, null, 2)
                    return callback(res, null);
                } else if (data.Item == undefined) {
                    console.log("user does not exist");
                    const result = "user does not exist"
                    return callback(result, null);
                } else {
                    let params = {
                        TableName: table,
                        Key: {
                            "id": event.arguments.id
                        },
                        UpdateExpression: "set firstname = :f, lastname = :l, email = :e, age = :a, updated_at = :u",
                        ExpressionAttributeValues: {
                            ":f": event.arguments.firstname || data.Item.firstname,
                            ":l": event.arguments.lastname || data.Item.lastname,
                            ":e": event.arguments.email || data.Item.email,
                            ":a": event.arguments.age || data.Item.age,
                            ":u": Date.now()
                        },
                        ReturnValues: "UPDATED_NEW"
                    };
                    dynamo.update(params, function(error, updated_data) {
                        if (error) {
                            console.log(error);
                            console.error("Unable to update item. Error JSON:", JSON.stringify(err, null, 2));
                        } else {
                            console.log('Update Operation successful', updated_data);
                            let result = {
                                "id": event.arguments.id,
                                "firstname": updated_data.Attributes.firstname,
                                "lastname": updated_data.Attributes.lastname,
                                "email": updated_data.Attributes.email,
                                "age": updated_data.Attributes.age,
                                // "updated_at": updated_data.Attributes.updated_at
                            };
                            return callback(result, null);
                        }
                    });
                } 
            });
            break;
        case "createUser":
            dynamo.put(putParams, function(err, data) {
                if (err) {
                    console.error("Error JSON: ", JSON.stringify(err, null, 2));
                    const message = err.message;
                    return callback(message, null);
                } else {
                    console.log("User Successfully Added: ", JSON.stringify(data, null, 2));
                    const string = "User Successfully Added";
                    return callback(string, null);
                }
            });
            break;
        case "deleteUser":
            dynamo.get(getParams, (err, res) => {
                if (err) {
                    return callback(err, null);
                } else if (!res.Item){
                    return callback('User does not exist', null);
                } else {
                    dynamo.delete(deleteParams, function(err, data) {
                        if (err) {
                            console.error("Unable to delete user from DB. Error JSON:", JSON.stringify(err, null, 2));
                            return callback('Unable to delete user from DB', null);
                        } else {
                            console.log("Successfully deleted user:", JSON.stringify(data, null, 2));
                            let result = 'successfully deleted user';
                            return callback(result, null);
                        }
                    });
                }
            })
            break;
        default:
            return callback(`Unknown field, unable to resolve ${event.field}`, null);
    }
};