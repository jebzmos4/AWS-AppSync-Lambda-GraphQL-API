let AWS = require('aws-sdk');
let dynamo = new AWS.DynamoDB.DocumentClient();
let table = process.env.TABLE_NAME;

exports.lambdaHandler =  (event, context, callback) => {
    let getParams = {
        TableName: table,
        Key: {
            'firstname': event.arguments.firstname
        }
    };

    let putParams = {
        TableName: table,
        Item: {
            'firstname': event.arguments.firstname,
            'lastname': event.arguments.lastname,
            'email': event.arguments.email,
            'age': event.arguments.age
        }
    };

    let allParams = {
        TableName: table,
        ProjectionExpression: "firstname, lastname, email, age"
    }

    let deleteParams = {
        TableName: table,
        Key: {
            "firstname": event.arguments.firstname
        }
    };
    
    console.log("Received the following event ==>", event);
    switch(event.field) {
        case "getUsers":
            dynamo.scan(allParams, function(err, data) {
                if (err) {
                    console.error("Unable to fetch user records. Error JSON:", JSON.stringify(err, null, 2));
                } else {
                    let results = data.Items;
                    callback(null, results);
                }
            });
            break;
        case "getUser":
            dynamo.get(getParams, function(err, data) {
                if (err) {
                    console.error("Error JSON: ", JSON.stringify(err, null, 2));
                    callback(err)
                } else if (data.Item == undefined) {
                    let result = {
                        "id": "",
                        "firstname": "",
                        "lastname": "",
                        "email": "",
                        "age": ""
                    };
                    callback(null, result);
                } else {
                    console.log('User Exists: ', JSON.stringify(data, null, 2));
                    console.log(data.Item.age);
                    let result = {
                        "id": data.Item.id,
                        "firstname": data.Item.firstname,
                        "lastname": data.Item.lastname,
                        "email": data.Item.email,
                        "age": data.Item.age
                    };
                    callback(null, result);
                }
            });
            break;
        case "updateUser":
            dynamo.get(getParams, function(err, data) {
                if (err) {
                    console.error("Error JSON: ", JSON.stringify(err, null, 2));
                    callback(err)
                } else if (data.Item == undefined) {
                    console.log("user does not exist");
                    let result = {
                                "firstname": "user does not exist",
                                "lastname": "",
                                "email": "",
                                "age": ""
                            };
                    callback(null, result);
                } else {
                    let params = {
                        TableName: table,
                        Key: {
                            "firstname": event.arguments.firstname
                        },
                        UpdateExpression: "set lastname = :l, email = :e, age = :a",
                        ExpressionAttributeValues: {
                            ":l": event.arguments.lastname || data.Item.lastname,
                            ":e": event.arguments.email || data.Item.email,
                            ":a": event.arguments.age || data.Item.age,
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
                                "firstname": event.arguments.name || data.Item.firstname,
                                "lastname": event.arguments.name || data.Item.lastname,
                                "email": event.arguments.email || data.Item.email,
                                "age": event.arguments.age || data.Item.age
                            };
                            callback(null, result);
                        }
                    });
                } 
            });
            break;
        case "createUser":
            dynamo.put(putParams, function(err, data) {
                if (err) {
                    console.error("Error JSON: ", JSON.stringify(err, null, 2));
                    callback(err)
                } else {
                    console.log("User Successfully Added: ", JSON.stringify(data, null, 2));
                    let result = putParams.Item;
                    callback(null, result);
                }
            });
            break;
        case "deleteArticle":
            dynamo.delete(deleteParams, function(err, data) {
                if (err) {
                    console.error("Unable to delete user from DB. Error JSON:", JSON.stringify(err, null, 2));
                } else {
                    console.log("Successfully DeleteItem succeeded:", JSON.stringify(data, null, 2));
                    let result = true;
                    callback(null, result)
                }
            });
            break;
        default:
            callback("Unknown field, unable to resolve" + event.field, null);
    }
};