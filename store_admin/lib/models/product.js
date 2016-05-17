'use strict';

var mongoose = require('mongoose'),
  Schema = mongoose.Schema;

var ProductSchema = new Schema({
  title: {
    type: String,
    index: true,
    required: true
  },
  content: {
    type: String,
    default: '',
    trim: true
  },
  price: {
    type: Number,
    default: 0,
    required: true
  },
  slug: {
    type: String,
    lowercase: true,
    trim: true
  },
  created: Date,
  updated: [Date],
  creator: {
    type: Schema.ObjectId,
    ref: 'Store'
  }
});

/**
 * Pre hook.
 */

ProductSchema.pre('save', function(next, done){
  if (this.isNew)
    this.created = Date.now();

  this.updated.push(Date.now());

  next();
});

/**
 * Statics
 */
ProductSchema.statics = {
  load: function(id, cb) {
    this.findOne({
      _id: id
    }).populate('creator', 'storename').exec(cb);
  }
};

/**
 * Methods
 */

ProductSchema.statics.findByTitle = function (title, callback) {
  return this.find({ title: title }, callback);
}

ProductSchema.methods.expressiveQuery = function (creator, date, callback) {
  return this.find('creator', creator).where('date').gte(date).run(callback);
}

/**
 * Plugins
 */

function slugGenerator (options){
  options = options || {};
  var key = options.key || 'title';

  return function slugGenerator(schema){
    schema.path(key).set(function(v){
      this.slug = v.toLowerCase().replace(/[^a-z0-9]/g, '').replace(/-+/g, '');
      return v;
    });
  };
};

ProductSchema.plugin(slugGenerator());

/**
 * Define model.
 */

mongoose.model('Product', ProductSchema);