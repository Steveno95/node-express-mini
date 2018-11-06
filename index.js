// implement your API here
const express = require('express');

const greeter = require('./greeter.js')

const db = require('./data/db.js');

const server = express();

//express middleware
server.use(express.json());

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

  server.post('/api/users', async (req, res) => {
    console.log('body', req.body);
    try {
      const userData = req.body;
      const userId = await db.insert(userData);
      const user = await db.findById(userId.id);
      res.status(201).json(user);
    } catch (error) {
      let message = 'error creating the user';
  
      if (error.errno === 19) {
        message = 'please provide both the name and the bio';
      }
  
      res.status(500).json({ message, error });
    }
  });

/*server.post('/api/users', async (req, res) => {
  try {
    const userData = req.body;
    const userId = await db.insert(userData);
    res.status(201).json(userId);
  } catch (error) {
    res.status(500).json({ message: 'error creating user', error });
  }
});*/

/*
server.post('/api/users', (req, res) => {
  const userData = req.body;
  db.insert(req.body)
    .then(userId => {
      res.status(201).json(userId);
      db.getById(userId.id).then(user => {

      })
      .catch(err => {
        // error getting one user by id
      })
    })
    .catch(error => {
      res.status(500).json({ message: 'error creating user', error });
    });
});
*/

server.put('/api/users/:id', (req, res) => {
  const { id } = req.params;
  const changes = req.body;
  db.update(id, changes)
  .then(count => {
    if (count) {
      res.status(200).json({ message: `${count} users updated` });
    } else {
      res.status(404).json({ message: 'User not found' })
    }
    
  })
  .catch(err => {
    res.status(500).json({ message: 'error deleting user', err });
  })
});

server.delete('/api/users/:id', (req, res) => {
  db.remove(req.params.id)
    .then(count => {
      res.status(200).json(count);
    })
    .catch(err => {
      res.status(500).json({ message: 'error deleting user', err });
    });
});

server.get('/users', (req, res) => {
  console.dir(req, { depth: 1 });
  const { id } = req.query;

  if (id) {
    db.findById(id).then(users => res.send(users));
  } else {
    db.find().then(users => res.send(users));
  }
});

server.get('/greet/:person', greeter);

// google.com/search ? q = timer & tbs=qdr & tbo=1
server.listen(9000, () => console.log('the server is alive'));
