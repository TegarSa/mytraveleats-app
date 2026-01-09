const express = require('express');
const cors = require('cors');

let authRoutes;
try {
  authRoutes = require('./routes/auth.routes');
} catch (err) {
  console.error(' Error loading auth routes:', err);
  authRoutes = require('express').Router(); 
}

const app = express();

app.use(cors());
app.use(express.json());

app.get('/', (req, res) => {
  res.json({ status: 'SERVER OK' });
});

app.use((req, res, next) => {
  console.log('', req.method, req.url);
  next();
});

app.use('/api/auth', authRoutes);

module.exports = app;
