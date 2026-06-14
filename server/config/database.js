const sqlite3 = require('sqlite3').verbose();
const path = require('path');
const bcrypt = require('bcryptjs');

const dbPath = path.join(__dirname, '../database/gym.db');

const db = new sqlite3.Database(dbPath, async (err) => {
  if (err) {
    console.error('Error conectando SQLite:', err.message);
    return;
  }

  console.log('SQLite conectado');

  initializeDatabase();
});

function initializeDatabase() {

  // Tabla usuarios
  db.run(`
    CREATE TABLE IF NOT EXISTS users (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      username TEXT UNIQUE NOT NULL,
      nombre TEXT NOT NULL,
      email TEXT UNIQUE NOT NULL,
      password_hash TEXT NOT NULL,
      role TEXT NOT NULL,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
    )
  `);

  // Tabla miembros
  db.run(`
    CREATE TABLE IF NOT EXISTS members (
      id INTEGER PRIMARY KEY AUTOINCREMENT,

      nombre TEXT NOT NULL,
      cedula TEXT NOT NULL,
      celular TEXT NOT NULL,

      fecha_inicio DATE NOT NULL,
      fecha_fin DATE NOT NULL,

      foto TEXT,

      tipo_membresia TEXT,

      observaciones TEXT,

      created_by INTEGER,

      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,

      FOREIGN KEY(created_by) REFERENCES users(id)
    )
  `);

  createAdminUser();
}

async function createAdminUser() {

  db.get(
    'SELECT id FROM users WHERE username = ?',
    ['admin'],
    async (err, row) => {

      if (err) {
        console.error(err);
        return;
      }

      if (!row) {

        const hash = await bcrypt.hash('admin123', 10);

        db.run(
          `
          INSERT INTO users
          (
            username,
            nombre,
            email,
            password_hash,
            role
          )
          VALUES (?, ?, ?, ?, ?)
          `,
          [
            'admin',
            'Administrador',
            'admin@gym.local',
            hash,
            'admin'
          ]
        );

        console.log('Usuario administrador creado');
      }
    }
  );
}

module.exports = db;