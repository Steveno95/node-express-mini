// implement your API here
const express = require('express');

const greeter = require('./greeter.js')

const db = require('./data/db.js');

const server = express();
server.get('/', (req, res) => {
    res.json('alive');
});

server.get('/greet', (req, res) => {
    res.json({hello: 'stranger'});
});

server.get('/api/users', (req, res) => {
    db.find()
      .then(users => {
        res.status(200).json(users);
      })
      .catch(err => {
        res
          .status(500)
          .json({ message: "we failed you, can't get the users", error: err });
      });
  });
  
  server.get('/api/users/:id', (req, res) => {
    const { id } = req.params;
  
    db.findById(id)
      .then(user => {
        if (user) {
          res.status(200).json(user);
        } else {
          res.status(404).json({ message: 'user not found' });
        }
      })
      .catch(err => {
        res
          .status(500)
          .json({ message: "we failed you, can't get the user", error: err });
      });
  });

server.get('/greet/:person', greeter);

server.listen(9000, () => console.log('the server is alive'));
