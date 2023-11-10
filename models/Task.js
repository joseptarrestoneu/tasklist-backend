const mongoose = require('mongoose')
const { model, Schema } = mongoose

const taskSchema = new Schema({
    titleTask: String,
    descriptionTask: String,
    initialDate: Date,
    finalDate: Date,
    closedTask: Boolean,
    userTask: String,
})

taskSchema.set('toJSON', {
    transform: (document, returnedObject) => {
        returnedObject.id = returnedObject._id
        delete returnedObject._id
        delete returnedObject.__v
    }
})

const Task = model('Task', taskSchema)

module.exports = Task