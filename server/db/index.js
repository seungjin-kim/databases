var mysql = require('mysql');

// Create a database connection and export it from this file.
// You will need to connect with the user "root", no password,
// and to the database "chat".
var dbConnection;
dbConnection = mysql.createConnection({
  user: 'root',
  password: '',
  database: 'chat'
});
dbConnection.connect();

// module.exports.dbConnection = dbConnection;



////// ORM Refactor

var Sequelize = require('sequelize');
var dbConnectionSequelize = new Sequelize('chat', 'root', '', {
  define: {
    timestamps: false
  }
});

var User = dbConnectionSequelize.define('users', {
  username: Sequelize.STRING
});

var Message = dbConnectionSequelize.define('messages', {
  user_id: Sequelize.INTEGER,
  message: Sequelize.STRING,
  createdAt: Sequelize.DATE,
  room_name: Sequelize.STRING
});

// module.exports.users = User;
// module.exports.mesages = Message;
module.exports = {
  dbConnection: dbConnection,
  users: User,
  messages: Message,
  dbConnectionSequelize: dbConnectionSequelize
}