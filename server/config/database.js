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

  // Tabla Members
  db.run(`
    CREATE TABLE IF NOT EXISTS members (
      id INTEGER PRIMARY KEY AUTOINCREMENT,

      nombre TEXT NOT NULL,
      cedula TEXT NOT NULL UNIQUE,
      celular TEXT NOT NULL,

      numero_recibo TEXT NOT NULL,
      
      fecha_inicio DATE NOT NULL,
      fecha_fin DATE NOT NULL,

      foto TEXT,

      tipo_membresia TEXT,

      observaciones TEXT,

      archivado INTEGER DEFAULT 0,

      created_by INTEGER,

      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,

      FOREIGN KEY(created_by) REFERENCES users(id)
    )
  `);
    // Tabla Tipo de membresias
    db.run(`
  CREATE TABLE IF NOT EXISTS membership_types (
    id INTEGER PRIMARY KEY AUTOINCREMENT,

    nombre TEXT NOT NULL UNIQUE,

    dias INTEGER NOT NULL,

    activo INTEGER DEFAULT 1,

    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
  )
`);

  createAdminUser();

  createDefaultMembershipTypes();

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

function createDefaultMembershipTypes() {

  const defaultTypes = [

    {
      nombre: 'Quincenal',
      dias: 15
    },

    {
      nombre: 'Mensual',
      dias: 30
    },

    {
      nombre: 'Trimestral',
      dias: 90
    },

    {
      nombre: 'Semestral',
      dias: 180
    },

    {
      nombre: 'Anual',
      dias: 365
    }

  ];

  defaultTypes.forEach((type) => {

    db.get(
      `
      SELECT id
      FROM membership_types
      WHERE nombre = ?
      `,
      [type.nombre],
      (err, row) => {

        if (err) {
          console.error(err);
          return;
        }

        if (!row) {

          db.run(
            `
            INSERT INTO membership_types
            (
              nombre,
              dias
            )
            VALUES (?, ?)
            `,
            [
              type.nombre,
              type.dias
            ]
          );

          console.log(
            `Membresía creada: ${type.nombre}`
          );
        }

      }
    );

  });

}
module.exports = db;