const jwt = require('jsonwebtoken');

const JWT_SECRET = 'gym-secret-key';

function verifyToken(req, res, next) {

  const authHeader = req.headers.authorization;

  if (!authHeader) {
    return res.status(401).json({
      success: false,
      message: 'Token requerido'
    });
  }

  const token = authHeader.split(' ')[1];

  try {

    const decoded = jwt.verify(
      token,
      JWT_SECRET
    );

    req.user = decoded;

    next();

  } catch {

    return res.status(401).json({
      success: false,
      message: 'Token inválido'
    });
  }
}

module.exports = verifyToken;