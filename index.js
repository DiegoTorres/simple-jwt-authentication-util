const jsonwebtoken = require('jsonwebtoken');
const { Unauthorized } = require('@diegoti/simple-error-handler-for-express');

const getBasicCredentialsFromAuthorizationHeader = (headers) => {
  const { authorization } = headers;
  if (!authorization) throw new Unauthorized('Missing authorization header.');

  const base64Credentials = authorization.split(' ')[1];
  const credentials = Buffer.from(base64Credentials, 'base64').toString('ascii');
  const [username, password] = credentials.split(':');
  return { username, password };
};

const getBearerTokenFromAuthorizationHeader = function (headers) {
  const { authorization } = headers;
  if (!authorization) throw new Unauthorized('Missing authorization header.');

  if (!authorization.startsWith('Bearer')) throw new Unauthorized('Invalid token.');

  const token = authorization ? (authorization.split(' ')[1])?.trim() : undefined;
  if (!token) throw new Unauthorized('Unauthorized! Token not provided!');

  return token;
};

const createToken = (payload) => {
  const TOKEN_SECRET_KEY = (process.env.TOKEN_SECRET_KEY).trim();
  const { TOKEN_EXPIRES_IN } = process.env;

  return jsonwebtoken.sign(
    payload,
    TOKEN_SECRET_KEY,
    { expiresIn: TOKEN_EXPIRES_IN || '5m' },
  );
};

const checkTokenAndSetDataToRequest = function (req, res, next) {
  const token = getBearerTokenFromAuthorizationHeader(req.headers);
  const TOKEN_SECRET_KEY = (process.env.TOKEN_SECRET_KEY || '').trim();

  jsonwebtoken.verify(token, TOKEN_SECRET_KEY, (err, decoded) => {
    if (err) throw new Unauthorized(err.message);
    req.authenticatedUser = decoded;
    next();
  });
};

module.exports = {
  getBasicCredentialsFromAuthorizationHeader,
  getBearerTokenFromAuthorizationHeader,
  createToken,
  checkTokenAndSetDataToRequest,
};