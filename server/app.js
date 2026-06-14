const express = require('express');
const cors = require('cors');

require('./config/database');

const authRoutes = require('./routes/authRoutes');

const memberRoutes = require('./routes/memberRoutes');

const app = express();
const PORT = 3000;

app.use(cors());
app.use(express.json());

app.use('/api/auth', authRoutes);

app.use('/api/members', memberRoutes);

app.get('/api/health', (req, res) => {
  res.json({
    success: true,
    message: 'Servidor funcionando'
  });
});

app.listen(PORT, () => {
  console.log(`Servidor iniciado en http://localhost:${PORT}`);
});