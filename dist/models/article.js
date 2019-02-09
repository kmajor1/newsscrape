'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _mongoose = require('mongoose');

var _mongoose2 = _interopRequireDefault(_mongoose);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var Schema = _mongoose2.default.Schema;

var articleSchema = new Schema({
  headline: {
    type: String,
    required: true
  },
  summary: {
    type: String,
    required: true
  },
  URL: {
    type: String,
    required: true
  },
  comment: {
    type: Schema.Types.ObjectId,
    ref: 'Article'
  }
});

var Article = _mongoose2.default.model('Article', articleSchema);

exports.default = Article;