const express = require('express');
const http = require('http');
const cors = require('cors');
const mongoose = require('mongoose');
require('dotenv').config();

const socketServer = require('./socketServer');
const authRoutes = require('./routes/authRoutes');
const friendInvitationRoutes = require('./routes/friendInvitationRoutes');

// PORT is for when app is hosted then API_PORT is for local environment
const PORT = process.env.PORT || process.env.API_PORT;

const app = express();

app.use(express.json());
app.use(cors());

// set auth routes in server
app.use('/api/auth', authRoutes);
app.use('/api/friend-invitation', friendInvitationRoutes);

app.route('/').get((req, res) => {
  res.send('Hi');
});

const server = http.createServer(app);
socketServer.registerSocketServer(server);

mongoose
  .connect(process.env.MONGO_URI)
  .then(() => {
    server.listen(PORT, () => {
      console.log('Server running on port:', PORT);
    });
  })
  .catch((err) => {
    console.log('Database connection failed with error:', err);
  });

module.exports = app;
