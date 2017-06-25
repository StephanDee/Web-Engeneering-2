/**
 * This module defines the mongoose scheme for pin.
 *
 * @author Nessi, Julius, Stephan
 */

// module
var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var enu = {
    values: ['image', 'video', 'website'],
    message: 'image, video, website are the only required values.'
};

// Pins scheme
var pinSchema = new Schema({
    // mongoose does set the following attributes itself:
    // (_id - the ID, __V: - the version or revision after update)

    timestamp: {type: Date, default: Date.now},
    title: {type: String, required: [true, 'title required.']},
    type: {type: String, enum: enu, message: 'image', trim: true, required: [true, 'type required.']},
    src: {type: String, required: [true, 'source required.']},
    description: {type: String, default: ""},
    views: {type: Number, min: 0, default: 0},
    ranking: {type: Number, min: 0, default: 0}
});

module.exports = mongoose.model('Pin', pinSchema);