const db = require('../config/database');

function createMember(req, res) {

  const {
    nombre,
    cedula,
    celular,
    fecha_inicio,
    fecha_fin,
    tipo_membresia,
    observaciones
  } = req.body;

  if (
    !nombre ||
    !cedula ||
    !celular ||
    !fecha_inicio ||
    !fecha_fin
  ) {
    return res.status(400).json({
      success: false,
      message: 'Faltan campos obligatorios'
    });
  }

  db.run(
    `
    INSERT INTO members
    (
      nombre,
      cedula,
      celular,
      fecha_inicio,
      fecha_fin,
      tipo_membresia,
      observaciones,
      created_by
    )
    VALUES (?, ?, ?, ?, ?, ?, ?, ?)
    `,
    [
      nombre,
      cedula,
      celular,
      fecha_inicio,
      fecha_fin,
      tipo_membresia || null,
      observaciones || null,
      req.user.id
    ],
    function(err) {

      if (err) {
        return res.status(500).json({
          success: false,
          message: err.message
        });
      }

      return res.status(201).json({
        success: true,
        message: 'Miembro creado',
        id: this.lastID
      });

    }
  );
}

function getMembers(req, res) {

  db.all(
    `
    SELECT
      id,
      nombre,
      cedula,
      celular,
      fecha_inicio,
      fecha_fin,
      tipo_membresia,
      observaciones,
      created_at
    FROM members
    ORDER BY id DESC
    `,
    [],
    (err, rows) => {

      if (err) {
        return res.status(500).json({
          success: false,
          message: err.message
        });
      }

      return res.json({
        success: true,
        data: rows
      });

    }
  );
}

function getMemberById(req, res) {

  const { id } = req.params;

  db.get(
    `
    SELECT *
    FROM members
    WHERE id = ?
    `,
    [id],
    (err, row) => {

      if (err) {
        return res.status(500).json({
          success: false,
          message: err.message
        });
      }

      if (!row) {
        return res.status(404).json({
          success: false,
          message: 'Miembro no encontrado'
        });
      }

      return res.json({
        success: true,
        data: row
      });

    }
  );
}

function updateMember(req, res) {

  const { id } = req.params;

  const {
    nombre,
    cedula,
    celular,
    fecha_inicio,
    fecha_fin,
    tipo_membresia,
    observaciones
  } = req.body;

  db.run(
    `
    UPDATE members
    SET
      nombre = ?,
      cedula = ?,
      celular = ?,
      fecha_inicio = ?,
      fecha_fin = ?,
      tipo_membresia = ?,
      observaciones = ?,
      updated_at = CURRENT_TIMESTAMP
    WHERE id = ?
    `,
    [
      nombre,
      cedula,
      celular,
      fecha_inicio,
      fecha_fin,
      tipo_membresia,
      observaciones,
      id
    ],
    function(err) {

      if (err) {
        return res.status(500).json({
          success: false,
          message: err.message
        });
      }

      return res.json({
        success: true,
        message: 'Miembro actualizado'
      });

    }
  );
}

function deleteMember(req, res) {

  const { id } = req.params;

  db.run(
    `
    DELETE FROM members
    WHERE id = ?
    `,
    [id],
    function(err) {

      if (err) {
        return res.status(500).json({
          success: false,
          message: err.message
        });
      }

      return res.json({
        success: true,
        message: 'Miembro eliminado'
      });

    }
  );
}

module.exports = {
  createMember,
  getMembers,
  getMemberById,
  updateMember,
  deleteMember
};