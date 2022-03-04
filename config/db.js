var mongoose = require("mongoose");
require("dotenv").config();

const db = {
  connect : process.env.DB_CONNECTION || 'mongodb',
  host : process.env.DB_HOST || 'localhost',
  port : process.env.DB_PORT || '27017',
  database : process.env.DB_DATABASE || 'gaming_social',
  user : process.env.DB_USER || '',
  password : process.env.DB_PASSWORD || '',
}

const auth = (db.user && db.password) ? `${db.user}:${db.password}@` : '';

async function connect() {
  try {
    await mongoose.connect(`${db.connect}://${auth}${db.host}:${db.port}/${db.database}`);
    console.log("Connected to mongodb");
  } catch (err) {
    console.log(err);
  }
}

module.exports = { connect };
