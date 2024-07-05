import express from "express"
import cookieParser from "cookie-parser"
import path from 'path'

import { loggerService } from "./services/logger.service.js"
import { userService } from "./services/user.service.js"
import { todoService } from "./services/todo.service.js"

const app = express()
//* Express Config:
app.use(express.static('public'))
app.use(cookieParser())
app.use(express.json())

//* Express Routing:

// Rest API for Todos

// Todo LIST
app.get('/api/todo', (req, res) => {
    const filterBy = {
        txt: req.query.txt,
        importance: +req.query.importance,
        isDone: req.query.isDone,
        pageIdx: req.query.pageIdx,
        userId: req.query.userId
    }
    const sortBy = {
        field: req.query.sortByField || 'name',
        order: req.query.sortByOrder === '1' ? -1 : 1
    }
    console.log(filterBy, sortBy)
    // todoService.query(filterBy, sortBy)
    todoService.query()
        .then(todos => res.send(todos))
        .catch(err => {
            loggerService.error('cannot get todos', err)
            res.status(500).send('Cannot get todos')
        })
})

// Todo READ
app.get('/api/todo/:todoId', (req, res) => {
    const { todoId } = req.params
    let visitedTodos = req.cookies.visitedTodos || []
    if (visitedTodos.length >= 3 && !visitedTodos.includes(todoId)) {
        return res.status(401).send('You have visited too many todos, please wait a bit.')
    }
    if (!visitedTodos.includes(todoId)) {
        visitedTodos.push(todoId)
        res.cookie('visitedTodos', visitedTodos, { maxAge: 1000 * 7 })
    }
    todoService.getById(todoId)
        .then(todo => res.send(todo))
        .catch((err) => {
            loggerService.error('Cannot get todo', err)
            res.status(500).send('Cannot get todo')
        })
})

// Todo CREATE
app.post('/api/todo', (req, res) => {

    const todo = {
        txt: req.body.txt || '',
        isDone: req.body.isDone || false,
        importance: +req.body.importance || '',
        color: req.body.color || '',
        createdAt: Date.now(),
        updatedAt: Date.now()
    }
    todoService.save(todo)
        .then(savedTodo => res.send(savedTodo))
        .catch((err) => {
            loggerService.error('Cannot save todo', err)
            res.status(500).send('Cannot save todo', err)
        })
})

// Todo Update
app.put('/api/todo/', (req, res) => {
    todoService.getById(req.query._id)
        .then(todo => {
            const todoToSave = {
                _id: req.query._id,
                txt: req.body.txt || todo.txt,
                isDone: req.body.isDone || todo.isDone,
                importance: +req.body.importance || todo.importance,
                color: req.body.color || todo.color,
                createdAt: +req.body.createdAt || todo.createdAt,
                updatedAt: Date.now()
            }
            todoService.save(todoToSave)
                .then(savedTodo => res.send(savedTodo))
                .catch((err) => {
                    loggerService.error('Cannot save todo', err)
                    res.status(500).send('Cannot save todo', err)
                })
        })

})

// Todo DELETE
app.delete('/api/todo/:todoId', (req, res) => {
    const { todoId } = req.params
    todoService.remove(todoId)
        .then(() => {
            loggerService.info(`Todo ${todoId} removed`)
            res.send(`Todo (${todoId}) removed!`)
        })
        .catch((err) => {
            loggerService.error('Cannot get todo', err)
            res.status(500).send('Cannot get todo')
        })
})

// User API

app.get('/api/user', (req, res) => {
    userService.query()
        .then(users => res.send(users))
        .catch(err => {
            loggerService.error('Cannot load users', err)
            res.status(400).send('Cannot load users')
        })
})

// Add this only if you plan to implement admin

// app.delete('/api/user/:userId', (req, res) => {
//     const { userId } = req.params
//     userService.remove(userId)
//         .then(() => {
//             loggerService.info(`User ${userId} removed`)
//             res.send(`User (${userId}) removed!`)
//         })
//         .catch((err) => {
//             loggerService.error('Cannot get user', err)
//             res.status(500).send('Cannot get user')
//         })
// })

app.get('/api/user/:userId', (req, res) => {
    const { userId } = req.params

    userService.getById(userId)
        .then(user => res.send(user))
        .catch(err => {
            loggerService.error('Cannot load user', err)
            res.status(400).send('Cannot load user')
        })
})

// Auth API

app.post('/api/auth/login', (req, res) => {
    const credentials = req.body

    userService.checkLogin(credentials)
        .then(user => {
            if (user) {
                const loginToken = userService.getLoginToken(user)
                res.cookie('loginToken', loginToken)
                res.send(user)
            } else {
                res.status(401).send('Invalid Credentials')
            }
        })
})

app.post('/api/auth/signup', (req, res) => {
    const credentials = req.body
    userService.save(credentials)
        .then(user => {
            if (user) {
                const loginToken = userService.getLoginToken(user)
                res.cookie('loginToken', loginToken)
                res.send(user)
            } else {
                res.status(400).send('Cannot signup')
            }
        })
})

app.post('/api/auth/logout', (req, res) => {
    res.clearCookie('loginToken')
    res.send('logged-out!')
})

// Default path / Fallback route

app.get('/**', (req, res) => {
    res.sendFile(path.resolve('public/index.html'))
})

// Listen

app.listen(3030, () => console.log('Server ready at http://127.0.0.1:3030 !'))
