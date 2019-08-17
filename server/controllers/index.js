var models = require('../models');

module.exports = {
  messages: {
    get: function (req, res) {
      models.messages.get(function (err, messages) {
        if (err) {
          res.writeHead(404, {
            "access-control-allow-origin": "*",
            "access-control-allow-methods": "GET, POST, PUT, DELETE, OPTIONS",
            "access-control-allow-headers": "content-type, accept",
            "access-control-max-age": 10
          });
          res.end();
        } else {
          res.writeHead(200, {
            "access-control-allow-origin": "*",
            "access-control-allow-methods": "GET, POST, PUT, DELETE, OPTIONS",
            "access-control-allow-headers": "content-type, accept",
            "access-control-max-age": 10
          });
          res.end(JSON.stringify(messages));
        }
      })
    }, // a function which handles a get request for all messages
    post: function (req, res) {
      var message = req.body;
      console.log(message);
      // get the user from body
      var userFromMsg = message.username;
      models.users.post(userFromMsg, function (err, users) {
        if (err) {
          console.log(err);
        } else {
          models.messages.post(message, function (err) {
            if (err) {
              res.writeHead(404, {
                "access-control-allow-origin": "*",
                "access-control-allow-methods": "GET, POST, PUT, DELETE, OPTIONS",
                "access-control-allow-headers": "content-type, accept",
                "access-control-max-age": 10
              });
              res.end();
            } else {
              res.send('message post success');
            }
          });
        }
      })
    } // a function which handles posting a message to the database
  },

  users: {
    // Ditto as above
    get: function (req, res) {
      models.users.get(function (err, users) {
        if (err) {
          res.writeHead(404, {
            "access-control-allow-origin": "*",
            "access-control-allow-methods": "GET, POST, PUT, DELETE, OPTIONS",
            "access-control-allow-headers": "content-type, accept",
            "access-control-max-age": 10
          });
          res.end();
        } else {
          res.writeHead(200, {
            "access-control-allow-origin": "*",
            "access-control-allow-methods": "GET, POST, PUT, DELETE, OPTIONS",
            "access-control-allow-headers": "content-type, accept",
            "access-control-max-age": 10
          });
          res.end(JSON.stringify(users));
        }
      });
    },
    post: function (req, res) {
      console.log(req.body);
      var username = req.body.username;
      models.users.post(username, function (err) {
        if (err) {
          res.writeHead(404, {
            "access-control-allow-origin": "*",
            "access-control-allow-methods": "GET, POST, PUT, DELETE, OPTIONS",
            "access-control-allow-headers": "content-type, accept",
            "access-control-max-age": 10
          });
          res.end();
        } else {
          console.log('users POST success');
          res.writeHead(200, {
            "access-control-allow-origin": "*",
            "access-control-allow-methods": "GET, POST, PUT, DELETE, OPTIONS",
            "access-control-allow-headers": "content-type, accept",
            "access-control-max-age": 10
          });
          res.end();
        }
      })
    }
  }
};

