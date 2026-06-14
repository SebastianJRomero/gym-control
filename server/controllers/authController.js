const db = require('../config/database');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const JWT_SECRET = 'gym-secret-key';

async function login(req, res) {

  const { identifier, password } = req.body;

  if (!identifier || !password) {
    return res.status(400).json({
      success: false,
      message: 'Datos incompletos'
    });
  }

  db.get(
    `
    SELECT *
    FROM users
    WHERE username = ?
       OR email = ?
    `,
    [identifier, identifier],

    async (err, user) => {

      if (err) {
        return res.status(500).json({
          success: false,
          message: 'Error interno'
        });
      }

      if (!user) {
        return res.status(401).json({
          success: false,
          message: 'Credenciales inválidas'
        });
      }

      const validPassword = await bcrypt.compare(
        password,
        user.password_hash
      );

      if (!validPassword) {
        return res.status(401).json({
          success: false,
          message: 'Credenciales inválidas'
        });
      }

      const token = jwt.sign(
        {
          id: user.id,
          username: user.username,
          role: user.role
        },
        JWT_SECRET,
        {
          expiresIn: '8h'
        }
      );

      return res.json({
        success: true,
        token,
        user: {
          id: user.id,
          nombre: user.nombre,
          username: user.username,
          email: user.email,
          role: user.role
        }
      });
    }
  );
}

module.exports = {
  login
};