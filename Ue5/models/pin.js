/**
 * This module defines the mongoose scheme for pin.
 *
 * @author Nessi, Julius, Stephan
 */

// module
var mongoose = require('mongoose');
var Schema = mongoose.Schema;

// Pins scheme
var PinSchema = new Schema({
    _id: { type: Schema.Types.ObjectId, unique: [true, '_id must be unique']},
    timestamp: { type : Date, default: Date.now },
    title: { type: String, required: [true, 'title required.']},
    type: { type: String, ref: ["image", "video", "website"], required: [true, 'type required.']},
    src: { type: String, required: [true, 'source required.']},
    description: { type: String, default: ""},
    views: { type: Number, min: 0, default: 0},
    ranking: { type: Number, min: 0, default: 0}
});

mongoose.model('PinSchema', PinSchema);

module.exports = mongoose.model('pins', PinSchema);