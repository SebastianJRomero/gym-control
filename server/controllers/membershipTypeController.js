const db = require('../config/database');

function getMembershipTypes(req, res) {

  db.all(
    `
    SELECT
      id,
      nombre,
      dias
    FROM membership_types
    WHERE activo = 1
    ORDER BY dias ASC
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

module.exports = {
  getMembershipTypes
};