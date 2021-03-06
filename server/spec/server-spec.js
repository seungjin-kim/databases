/* You'll need to have MySQL running and your Node server running
 * for these tests to pass. */

var mysql = require('mysql');
var request = require('request'); // You might need to npm install the request module!
var expect = require('chai').expect;

describe('Persistent Node Chat Server', function() {
  var dbConnection;

  beforeEach(function(done) {
    dbConnection = mysql.createConnection({
      user: 'root',
      password: '',
      database: 'chat'
    });
    dbConnection.connect();

    var tablename = "messages"; // TODO: fill this out // Changed to messages

    /* Empty the db table before each test so that multiple tests
     * (or repeated runs of the tests) won't screw each other up: */
    dbConnection.query('truncate ' + tablename, done);
  });

  afterEach(function() {
    dbConnection.end();
  });

  it('Should insert posted messages to the DB', function(done) {
    // Post the user to the chat server.
    request({
      method: 'POST',
      uri: 'http://127.0.0.1:3000/classes/users',
      json: { username: 'testuser10' }
    }, function () {
      // Post a message to the node chat server:
      request({
        method: 'POST',
        uri: 'http://127.0.0.1:3000/classes/messages',
        json: {
          username: 'testuser10',
          message: 'In mercy\'s name, three days is all I need.',
          roomname: 'Hello'
        }
      }, function () {
        // Now if we look in the database, we should find the
        // posted message there.

        // TODO: You might have to change this test to get all the data from
        // your message table, since this is schema-dependent.
        var queryString = 'SELECT * FROM messages WHERE `user_id`= (SELECT `id` FROM users WHERE username = ?)';
        var queryArgs = ['testuser10'];

        dbConnection.query(queryString, queryArgs, function(err, results) {
          // Should have one result:
          console.log(results);
          expect(results.length).to.equal(1);

          // TODO: If you don't have a column named text, change this test. ** changed to message
          expect(results[0].message).to.equal('In mercy\'s name, three days is all I need.');

          done();
        });
      });
    });
  });

  it('Should output all messages from the DB', function(done) {
    // Let's insert a message into the db
    var queryString = "INSERT INTO messages(message, room_name, user_id) VALUES (?, ?, ?)";
    var queryArgs = ['Men like you can never change!', 'main', 1];
    // TODO - The exact query string and query args to use
    // here depend on the schema you design, so I'll leave
    // them up to you. */

    dbConnection.query(queryString, queryArgs, function(err) {
      if (err) { throw err; }

      // Now query the Node chat server and see if it returns
      // the message we just inserted:
      request('http://127.0.0.1:3000/classes/messages', function(error, response, body) {
        var messageLog = JSON.parse(body);
        expect(messageLog[0].message).to.equal('Men like you can never change!');
        expect(messageLog[0].room_name).to.equal('main');
        done();
      });
    });
  });

  it('Should not insert duplicate users', function(done) {
    // insert a user using post, twice
    // get users list, the user posted should appear just once
    request({
      method: 'POST',
      uri: 'http://127.0.0.1:3000/classes/users',
      json: {username: 'nonduplicateduser'}
    }, function(err, response, body) {
      if (err) {
        console.log(error);
      } else {
        request({
          method: 'POST',
          uri: 'http://127.0.0.1:3000/classes/users',
          json: {username: 'nonduplicateduser'}
        }, function (err, response, body) {
          if (err) {
            console.log(err);
          } else {
            request('http://127.0.0.1:3000/classes/users', function(err, response, body) {
              var users = JSON.parse(body);
              var count = 0;
              for (var i = 0; i < users.length; i++) {
                if (users[i].username === 'nonduplicateduser') {
                  count++;
                }
              }
              expect(count).to.equal(1);
              done();
            })
          }
        })
      }
    });
  });

  it('Should create a message if the user does not exist', function(done) {
    var username = 'testuser' + Math.floor(Math.random() * 1000);
    var messageText = `test message from ${username}`;
    request({
      method: 'POST',
      uri: 'http://127.0.0.1:3000/classes/messages',
      json: {
        username: username,
        message: messageText,
        roomname: 'random'
      }
    }, function() {
      var queryString = 'SELECT * from messages WHERE message = ?';
      var queryArgs = [messageText];
      dbConnection.query(queryString, queryArgs, function(err, results) {
        if (err) {
          console.log(err);
        } else {
          expect(results.length).to.equal(1);
          done();
        }
      });
    });
  });
});
