# `/users/register` Endpoint

## Description

The `/users/register` endpoint registers a new user. It accepts user details, validates input using `express-validator`, hashes the user's password, and creates the user in the database. On successful registration, it returns a JSON Web Token along with the newly created user data.

## Method

`POST`

## URL

`/users/register`

## Request Body

The request must be in JSON format and include the following fields:

- **fullname**: An object containing:
  - **firstname**: (string, minimum 3 characters) - The user's first name.
  - **lastname**: (string) - The user's last name.
- **email**: (string, valid email format) - The user's email address.
- **password**: (string, minimum 6 characters) - The user's password.

### Example

```json
{
  "fullname": {
    "firstname": "John",
    "lastname": "Doe"
  },
  "email": "johndoe@example.com",
  "password": "password123"
}

{
  "token": "your_jwt_token_here",
  "user": {
    "_id": "6097a8662b3e2f1d5c15c5b3",
    "fullname": {
      "firstname": "John",
      "lastname": "Doe"
    },
    "email": "johndoe@example.com",
    "password": "hashed_password"
  }
}


{
  "errors": [
    {
      "msg": "Invalid Email",
      "param": "email",
      "location": "body"
    },
    {
      "msg": "First name must be atlest 3 characters long",
      "param": "fullname.firstname",
      "location": "body"
    },
    {
      "msg": "Password must be atleast 6 characters long",
      "param": "password",
      "location": "body"
    }
  ]
}