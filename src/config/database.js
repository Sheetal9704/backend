const mongoose = require("mongoose");

const connectDB = async () => {
  const url =
    "mongodb://sheetalmahadev97_db_user:9dtYYAYGfPx1UcaD@ac-fdlxpvx-shard-00-00.supopxy.mongodb.net:27017,ac-fdlxpvx-shard-00-01.supopxy.mongodb.net:27017,ac-fdlxpvx-shard-00-02.supopxy.mongodb.net:27017/devTinder?ssl=true&replicaSet=atlas-dvxaw5-shard-0&authSource=admin&appName=Cluster0";
  await mongoose.connect(url);
};

module.exports = connectDB;
