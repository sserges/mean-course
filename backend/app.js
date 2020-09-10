const path = require('path');

const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');

const postsRoutes = require('./routes/posts');
const usersRoutes = require('./routes/users');

const app = express();

mongoose.connect(`mongodb+srv://will:${process.env.MONGO_ATLAS_PW}@cluster0-p34fz.mongodb.net/mean-course?retryWrites=true&w=majority`, {
  useNewUrlParser: true,
  useCreateIndex: true,
  useFindAndModify: false,
  useUnifiedTopology: true
}).then(() => {
  console.log('Connected to database');
}).catch(() => {
  console.log('Connection failed');
});

app.use(bodyParser.json());
app.use('/images', express.static(path.join('backend/images')));
app.use('/', express.static(path.join(__dirname, 'angular')));

app.use((req, res, next) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept, Authorization');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PATCH, PUT, DELETE, OPTIONS');
  next();
});

app.use('/api/posts', postsRoutes);
app.use('/api/users', usersRoutes);

app.use((req, res, next) => {
  res.sendFile(path.join(__dirname, 'angular', 'index.html'));
});


module.exports = app;
