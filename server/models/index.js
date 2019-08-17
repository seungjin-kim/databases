var db = require('../db');

module.exports = {
  messages: {
    get: function (callback) {


      db.messages.sync()
        .then(function () {
          return db.messages.findAll({});
        })
        .then(function (messages) {
          callback(null, messages);
        })
        .catch(function (err) {
          callback(err, null);
          db.dbConnectionSequelize.close();
        });

    }, // a function which produces all the messages

    post: function (message, callback) {
      db.users.sync()
        .then(function () {
          return db.users.findOrCreate({ where: { username: message.username } });
        })
        .then(function ([user, created]) {
          console.log(user.get().id);
          var userId = user.get().id;
          return userId;
        })
        .then(function (userId) {
          return db.messages.create({
            message: message.message,
            room_name: message.roomname,
            user_id: userId
          })
        })
        .then(function (result) {
          console.log('message POST successful');
          callback(null, result);
        })
        .catch(function (err) {
          callback(err, null);
        })
    }
  },

  users: {
    // Ditto as above.
    get: function (callback) {
      db.users.sync()
        .then(function () {
          return db.users.findAll({});
        })
        .then(function (users) {
          callback(null, users);
        })
        .catch(function (err) {
          callback(err, null);
          db.dbConnectionSequelize.close();
        });
    },
    post: function (user, callback) {
      db.users.sync()
        .then(function () {
          return db.users.upsert({ username: user });
        })
        .then(function (result) {
          callback(null, result);
        })
        .catch(function (err) {
          callback(err, null);
          db.dbConnectionSequelize.close();
        });
    }
  }
};
