require('dotenv').config()
require('./mongo')

const express = require('express')
const morgan = require('morgan')
const cors = require('cors')
const app = express()
const Task = require('./models/Task')
const User = require('./models/User')

app.use(express.json())
app.use(cors())
app.use(morgan(function (tokens, req, res) {
    return [
        tokens.method(req, res),
        tokens.url(req, res),
        tokens.status(req, res),
        tokens.res(req, res, 'content-length'), '-',
        tokens['response-time'](req, res), 'ms',
        tokens.res(req, res, 'content-length'), '-',
        JSON.stringify(req.body), 
    ].join(' ')   
}))

app.get('/', (request, response) => {
    response.send('<h1>Hello World!</h1>')
})

app.get('/api/tasks', (request, response) => {
    Task.find({}).then(tasks => {
        response.json(tasks)
    })
})

app.get('/api/tasks/:id', (request, response, next) => {
    const { id } = request.params;
    Task.findById(id).then(task => {
        if (task) {
            return response.json(task)
        } else {
            response.status(404).end()
        }
    }).catch(err => {
        next(err)
    })
})

app.delete('/api/tasks/:id', (request, response, next) => {
    const { id } = request.params;

    Task.findByIdAndDelete(id).then(result => {
        response.status(204).end()
    }).catch(err => {
        next(err)
    })

})

app.post('/api/tasks', (request, response) => {
    const body = request.body
       
    if (!body.titleTask) {
        return response.status(400).json({
            error: "title task missing"
        })
    }
    
    const newTask = new Task({
        titleTask: body.titleTask,
        descriptionTask: body.descriptionTask,
        initialDate: body.initialDate,
        finalDate: body.finalDate,
        closedTask: body.closedTask,
        userTask: body.userTask,
    })

    newTask.save().then(savedTask => {
        response.json(savedTask)
    })
  })

  app.put('/api/tasks/:id', (request, response, next) => {
    const { id } = request.params;
    const body = request.body
    
    const newTaskInfo = {
        titleTask: body.titleTask,
        descriptionTask: body.descriptionTask,
        initialDate: body.initialDate,
        finalDate: body.finalDate,
        closedTask: body.closedTask,
        userTask: body.userTask,
    }

    Task.findByIdAndUpdate(id, newTaskInfo, { new: true })
        .then(result => {
            response.json(result)
        })

})


// Usuaris
app.get('/api/users', (request, response) => {
    User.find({}).then(users => {
        response.json(users)
    })
})

app.get('/api/users/:id', (request, response, next) => {
    const { id } = request.params;
    User.findById(id).then(user => {
        if (user) {
            return response.json(user)
        } else {
            response.status(404).end()
        }
    }).catch(err => {
        next(err)
    })
})

app.delete('/api/users/:id', (request, response, next) => {
    const { id } = request.params;

    User.findByIdAndDelete(id).then(result => {
        response.status(204).end()
    }).catch(err => {
        next(err)
    })

})

app.post('/api/users', (request, response) => {
    const body = request.body
       
    if (!body.userName) {
        return response.status(400).json({
            error: "user name missing"
        })
    }
    
    const newUser = new User({
        userName: body.userName,
        userUser: body.userUser,
        userPassword: body.userPassword,
    })

    newUser.save().then(savedUser => {
        response.json(savedUser)
    })
  })

  // Middleware
  app.use((error, request, response, next) => {
    console.error(error);
    if (error.name == 'CastError') {
        response.status(400).send({error: 'id used is malformed'})
    } else {
        response.status(500).end()
    }
  })
      

const PORT = process.env.PORT
app.listen(PORT, () => {
    console.log(`Servei running on port ${PORT}`);
})

