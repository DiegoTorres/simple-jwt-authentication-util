# simple-jwt-authentication-util

## Getting Started

Install it using [`npm`](https://www.npmjs.com/package/@diegoti/simple-jwt-authentication-util):

```bash
npm i @diegoti/simple-jwt-authentication-util
```
## USAGE

Before use, set these two environment variables.\
This package uses [`jsonwebtoken`](https://www.npmjs.com/package/jsonwebtoken), see the [`docs`](https://github.com/auth0/node-jsonwebtoken#readme) here.

```javascript
process.env.TOKEN_SECRET_KEY = "SOME SECRETE KEY";
process.env.TOKEN_EXPIRES_IN = "10m"; // default is 5m
```

There are four functions, import as it follows .

```javascript
const {
  getBasicCredentialsFromAuthorizationHeader,
  getBearerTokenFromAuthorizationHeader,
  createToken,
  checkTokenAndSetDataToRequest
} = require('@diegoti/simple-jwt-authentication-util');
```

You can use getBasicCredentialsFromAuthorizationHeader to get credentials that are inside authorization header [Basic YWRtaW758QGFkbWluQB==], check the credentials, if credentials are valid, you can call createToken. See example bellow

```javascript
router.post('/login', function (req, res, next) {
  
  let token;
  const { username, password } = getBasicCredentialsFromAuthorizationHeader(req.headers);

  if (validateCredentials(username, password)) {
    token = createToken({ username });
  }

  res.status(200).json({ token });
});
```

Add checkTokenAndSetDataToRequest to your route, this function will validates bearer token and if it is valid, the decoded data will be add to express req object as 'authenticatedUser' .
Example of route

```javascript
router.post('/users', checkTokenAndSetDataToRequest, function (req, res, next) {
  console.log('User data from token ', req.authenticatedUser);

  res.status(200).json({ message: 'ok' });
});
```