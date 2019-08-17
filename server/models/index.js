var db = require('../db');

module.exports = {
  messages: {
    get: function (callback) {
      var queryString = "SELECT * FROM messages";

      db.dbConnection.query(queryString, function(err, results) {
        if (err) {
          callback(err, null);
        } else {
          callback(null, results);
        }
       });

    }, // a function which produces all the messages

    post: function (message, callback) {
      // get user id (calling users.get)
      module.exports.users.get(function(err, usersResult) {
        if (err) {
          callback(err, null);
        } else {
            var findUserId = function(user) {
              for (var i = 0; i < usersResult.length; i++) {
                if (usersResult[i].username === user) {
                  return usersResult[i].id;
                }
              }
            };
            var queryString = "INSERT INTO messages(message, room_name, user_id) VALUES (?, ?, ?)";
            var queryArgs = [message.message, message.roomname, findUserId(message.username)];
            db.dbConnection.query(queryString, queryArgs, function(err, results) {
              if (err) {
                callback(err, null);
              } else {
                callback(null, results);
              }
            });

        } // a function which can be used to insert a message into the database
      });
    }
  },

  users: {
    // Ditto as above.
    get: function (callback) {
      var queryString = "SELECT * FROM users";
      db.dbConnection.query(queryString, function(err, results) {
        if (err) {
          console.log(err);
          callback(err, null);
        } else {
          console.log(results);
          callback(null, results);
        }
      });

    },
    post: function (user, callback) {
      var queryString = "INSERT IGNORE INTO users(username) VALUES (?)";
      var queryArgs = [user];
      db.dbConnection.query(queryString, queryArgs, function(err, results) {
        if (err) {
          callback(err, null);
        } else {
          callback(null, results);
        }
      });

    }
  }
};
