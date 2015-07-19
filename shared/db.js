var mongoose = require('mongoose'),
    config = require('./config'),
    bus = require('./bus'),
    logger = require('./logger'),
    async = require('async'),
    _ = require('underscore');

//mongoose.set('debug', true);

var db = {};

_.each(config.mongo, function(connectionString, name) {
  
  function connect() {
    db[name] = mongoose.createConnection(connectionString,
      { server: { auto_reconnect: true } },
      function(err) {
        if (err) {
          logger.error('DB', name, 'failed to connect to database');
        }
      });
  }

  connect();

  db[name].on('error', function(err) {
    logger.error('DB', name, 'connection Error: ' + err);
  });

  db[name].on('connected', function() {
    logger.info('DB', name, 'connected');
  });

  db[name].on('reconnected', function() {
    logger.info('DB', name, 'reconnected');
  });

  db[name].on('disconnected', function() {
    logger.warn('DB', name, 'disconnected');
  });
});

var dropCollections = function(db, callback) {
  var collections = _.keys(db.collections);
  async.forEach(collections, function(collectionName, done) {
    var collection = db.collections[collectionName];
    collection.drop(function(err) {
      if (err && err.message !== 'ns not found'){
        done(err);
        return;
      }
      done(null);
    });
  }, callback);
};

var dropCollection = function(db, name, callback) {
  db.collections[name].drop(callback);
};

var PostSchema = require('./db/post');

module.exports = {
  Post: db.dbase.model('Post', PostSchema),
  parseId: function(id){
    return mongoose.Types.ObjectId(id);
  },
  close : function(callback) {
    mongoose.disconnect(function(err) {
      if (callback) {
        callback(err);
      }
    });
  },
  dropRead: function(callback){
    dropCollections(db.read, callback);
  },
  dropStaticColection: function(name, callback){
    dropCollection(db.static, name, callback);
  },
  drop: function(callback){
    async.waterfall([
      function(callback){
        dropCollections(db.write, callback);
      },
      function(callback){
        dropCollections(db.read, callback);
      }
    ], function(err){
      if(err){
        callback(err);
        return;
      }

      callback(null);
    });
  }
};
