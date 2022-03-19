const mongoose = require('mongoose')

const Schema = mongoose.Schema

const UserSchema = new Schema({
    username: {
        type: String, unique: true, required: true, trim: true
    },
    email: {
        type: String, unique: true, required: true, trim: true
    },
    birthday: {
        type: Date, required: true
    },
})

module.exports = mongoose.model('users', UserSchema)