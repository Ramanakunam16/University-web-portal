const { intersection } = require('lodash');
const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const SavedPostSchema = new Schema({
  title: {
    type: String,
    required: true,
  },
  body: {
    type: String,
    required: true,
  },
  createdAt: {
    type: Date,
    default: Date.now(),
  },
  createdBy: {
    type: String,
    required: true,
  },
  savedBy: {
    type: Number,
    required: true,
  },
});

module.exports = mongoose.model('savedPost', SavedPostSchema);
