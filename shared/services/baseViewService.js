var Q = require('q'),
    logger = require('../logger'),
    async = require('async'),
    util = require('util'),
    mongoose = require('mongoose'),
    bus = require('../bus'),
    _ = require('underscore');

var BaseViewService = function(model, options){
  this.__Model = model;
  options = options || {};

  _.defaults(options, {
      guardAppId: true
  });

  this.options = options;
};

BaseViewService.prototype.create = function(entity){
  var deferred = Q.defer(),
      self = this,
      evtName = util.format("read.%sCreated", self.__Model.modelName);
  if(!entity._id){
    entity._id = mongoose.Types.ObjectId().toString();
  }

  var model = new this.__Model(entity);

  model.save(function(err, doc){
    if(err){
      logger.error("Unable to create entity of type [%s]. Err: [%s]", self.__Model.modelName, JSON.stringify(err));
      deferred.reject(err);
    } else {
      doc = doc.toObject();
      bus.emit(evtName, doc);
      deferred.resolve(doc);
    }
  });

  return deferred.promise;
};

BaseViewService.prototype.update = function(query, updateFn){
  var deferred = Q.defer(),
      self = this,
      evtName = util.format("read.%sUpdated", self.__Model.modelName),
      before, after;

  async.waterfall([
    function(callback){
      self.__Model.findOne(query).exec(callback);
    },
    function(item, callback){
      if(!item){
        var message = util.format("Entity from model [%s] was not found by query [%s]", self.__Model.modelName, JSON.stringify(query));
        callback(message);
        return;
      }

      before = item.toObject();

      updateFn(item);
      item.save(callback);
    },
    function(item, numberAffected, callback){
      after = item.toObject();
      item = item.toObject();

      callback(null, item);
    }
  ], function(err, doc){
    if (err) {
      logger.error('Failed to update entity from [%s] model. Error: [%s].', self.__Model.modelName, err);
      deferred.reject(err);
    } else {
      var result = {
        doc: doc,
        changedFields: {}
      }, key;
      // Temporary solution. It gets diff of simple fields only
      for (key in before) {
        if (before.hasOwnProperty(key) && before[key] !== after[key]) {
          result.changedFields[key] = {
            before: before[key],
            after: after[key]
          };
        }
      }

      bus.emit(evtName, result);
      deferred.resolve(doc);
    }
  });

  return deferred.promise;
};

BaseViewService.prototype.createOrUpdate = function(query, updateFn){
  var deferred = Q.defer(),
    self = this;

  async.waterfall([
    function(callback){
      self.__Model.findOne(query).exec(callback);
    },
    function(item, callback){
      if(!item){
        item = new self.__Model({
          _id: mongoose.Types.ObjectId().toString()
        });
      }

      updateFn(item);
      item.save(callback);
    },
    function(item, numberAffected, callback){
      item = item.toObject();

      callback(null, item);
    }
  ], function(err, doc){
    if (err) {
      logger.error('Failed to createOrUpdate entity from [%s] model. Error: [%s].', self.__Model.modelName, err);
      deferred.reject(err);
    } else {
      deferred.resolve(doc);
    }
  });

  return deferred.promise;
};

BaseViewService.prototype.delete = function(query){
  var self = this,
    evtName = util.format("read.%sDeleted", self.__Model.modelName),
    deferred = Q.defer();

  self.__Model.findOne(query, function(err, doc){
    if(err || !doc){
      if(!doc){
        err = "Query does not return document.";
      }
      logger.error('Unable to find to delete entity of model [%s]. Error: [%s]. Query: [%s]', self.__Model.modelName, err,
        JSON.stringify(query, null, 4));

      deferred.reject(err);
    } else {

      doc.remove(function(err){
        if(err){
          logger.error('Unable to delete entity of model [%s]. Error: [%s]. Entity: [%s]', self.__Model.modelName, err,
            JSON.stringify(doc, null, 4));
        }

        doc = doc.toObject();
        bus.emit(evtName, doc);
        deferred.resolve(doc);
      });
    }
  });

  return deferred.promise;
};

BaseViewService.prototype.find = function(query, options){
  options = options || {};

  var deferred = Q.defer(),
    self = this,
    mQuery = self.__Model.find(query),
    skip,
    hasPaging,
    pagesCount;

  _.defaults(options, {
    itemsPerPage: 20,
    pageNumber: 0
  });

  hasPaging = options.pageNumber > 0;

  if(options.pick){
    mQuery =  mQuery.select(options.pick);
  }

  if(hasPaging){
    skip = (options.pageNumber - 1) * options.itemsPerPage;

    mQuery =  mQuery.skip(skip).limit(options.itemsPerPage);
  }

  if(options.sort){
    mQuery =  mQuery.sort(options.sort);
  }

  if(options.fields){
    var includeFields = {};
    _.each(options.fields, function(item){
      includeFields[item] = 1;
    });

    mQuery = mQuery.select(includeFields);
  }

  mQuery.lean().exec(function(err, results){
    if(err){
      logger.error('Failed to perform query on [%s] model. Error: [%s].', self.__Model.modelName, err);
      deferred.reject(err);
    } else {
      if(hasPaging){
        self.__Model.count(query, function(error, count) {
          if (error) {
            logger.error('Failed to get count of entities for [%s] model. Error: [%s].', self.__Model.modelName, err);
            deferred.reject(err);
          } else {

            pagesCount = Math.ceil(count / options.itemsPerPage) || 1;
            deferred.resolve({
              pagesCount: pagesCount,
              results: results,
              totalCount: count
            });
          }
        });
      } else {
        deferred.resolve(results)
      }
    }
  });

  return deferred.promise;
};

BaseViewService.prototype.findOne = function(query, options){
  var deferred = Q.defer();

  this.find(query, options)
    .then(function(results){
      if(results.length === 1){
        deferred.resolve(results[0]);
      } else {
        deferred.resolve(null);
      }
    })
    .fail(function(err){
      deferred.reject(err);
    });

  return deferred.promise;
};

//This is a temporary method to wait until data is persisted in read db
//It will be removed as soon as we will have sockets pushing notifications directly to client
/**
 * This method will wait until number of documents return by query will be greater then 0 with one exception
 * when countZero option is true (see options param)
 *
 * @param query
 * @param options
 *   - countZero -- wait until number of documents by query is equal to 0 (good to use to wait until entity is deleted)
 * @returns {Promise.promise|*}
 */
BaseViewService.prototype.wait = function(query, options){
  options = options || {};
  var deferred = Q.defer(),
      self = this,
      timeout = options.timeout || 30000,
      tick = 500,
      totalTicked,
      intervalId,
      countZero = options.countZero || false;

  intervalId = setInterval(function(){
    self.count(query)
      .then(function(count){
        if(countZero && count === 0){
          clearInterval(intervalId);
          deferred.resolve();
        }
        else if(!countZero && count > 0){
          clearInterval(intervalId);
          deferred.resolve();
        }

        if(totalTicked > timeout){
          clearInterval(intervalId);
          deferred.reject("Timeout while waiting for query: " + JSON.stringify(query));
        }

        totalTicked += tick;
      })
      .fail(function(err){
        deferred.reject(err);
      })
  },tick);

  return deferred.promise;
};

BaseViewService.prototype.count = function(query){
  var deferred = Q.defer();

  this.__Model.count(query, function(err, count) {
    if(err){
      deferred.reject(err);
    } else {
      deferred.resolve(count);
    }
  });

  return deferred.promise;
};

BaseViewService.prototype.exists = function(query){
  var deferred = Q.defer();

  this.count(query)
    .then(function(count){
      deferred.resolve((count > 0) ? true : false);
    })
    .fail(function(err){
      deferred.reject(err);
    });

  return deferred.promise;
};

BaseViewService.prototype.aggregate = function(pipeline){
  var deferred = Q.defer();

  this.__Model.aggregate(pipeline).exec(function(err, result){
    if(err){
      deferred.reject(err);
    } else {
      deferred.resolve(result);
    }
  });

  return deferred.promise;
};

BaseViewService.prototype.deleteIfAny = function(query){
  var self = this,
    deferred = Q.defer();

  self.__Model.findOne(query, function(err, doc){
    if(err){

      deferred.reject(err);
    } else if(doc) {
      doc.remove(function(err){
        if(err){
          logger.error('Unable to delete entity of model [%s]. Error: [%s]. Entity: [%s]', self.__Model.modelName, err,
            JSON.stringify(doc, null, 4));
        }

        doc = doc.toObject();
        deferred.resolve(doc);
      });
    } else {
      deferred.resolve({});
    }
  });

  return deferred.promise;
};

module.exports = BaseViewService;
