# AWS-AppSync-Lambda-GraphQL-API
lambda function that interacts with AppSync

# Welcome!

# An example query named "GetUsers" might look like:
#
    query GetUser {
       getUsers {
         firstname
         lastname
         email
         age
       }
    }
#
# An example mutation named "PutUser" might look like:
#
     mutation UpdateUser {
       updateUser(id: 123, firstname: "Morifeoluwa", lastname: "World", email: "daddy@g.com", ) {
         firstname
         lastname
         email
       }
    }

  mutation createUser {
       createUser(id: 123,  firstname:"Morifeoluwa", lastname: "Jebutu", email: "jmorife@yahoo.com", age: "24") {
         firstname
     		lastname
     		email
     		age
       }
    }

 mutation DeleteUser {
      deleteUser(firstname:"Morifeoluwa") {
    		firstname
      }
}