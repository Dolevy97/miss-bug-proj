import express from "express"
import cookieParser from "cookie-parser"
import path from 'path'

import { bugService } from "./services/bug.service.js"
import { loggerService } from "./services/logger.service.js"
import { userService } from "./services/user.service.js"

const app = express()
//* Express Config:
app.use(express.static('public'))
app.use(cookieParser())
app.use(express.json())

//* Express Routing:

// Rest API for Bugs

// Bug LIST
app.get('/api/bug', (req, res) => {
    const filterBy = {
        title: req.query.title,
        severity: +req.query.severity,
        labels: req.query.labels,
        pageIdx: req.query.pageIdx,
        userId: req.query.userId
    }
    const sortBy = {
        field: req.query.sortByField || 'createdAt',
        order: req.query.sortByOrder === '1' ? -1 : 1
    }
    bugService.query(filterBy, sortBy)
        .then(bugs => res.send(bugs))
        .catch(err => {
            loggerService.error('cannot get bugs', err)
            res.status(500).send('Cannot get bugs')
        })
})

// Bug READ
app.get('/api/bug/:bugId', (req, res) => {
    const { bugId } = req.params
    let visitedBugs = req.cookies.visitedBugs || []
    if (visitedBugs.length >= 3 && !visitedBugs.includes(bugId)) {
        return res.status(401).send('You have visited too many bugs, please wait a bit.')
    }
    if (!visitedBugs.includes(bugId)) {
        visitedBugs.push(bugId)
        res.cookie('visitedBugs', visitedBugs, { maxAge: 1000 * 7 })
    }
    bugService.getById(bugId)
        .then(bug => res.send(bug))
        .catch((err) => {
            loggerService.error('Cannot get bug', err)
            res.status(500).send('Cannot get bug')
        })
})

// Bug CREATE
app.post('/api/bug', (req, res) => {
    const loggedinUser = userService.validateToken(req.cookies.loginToken)
    if (!loggedinUser) return res.status(401).send('Cannot update bug.')
    const bug = {
        title: req.body.title || '',
        description: req.body.description || '',
        severity: +req.body.severity || '',
        labels: req.body.labels || [],
        createdAt: +req.body.createdAt || Date.now()
    }
    bugService.save(bug, loggedinUser)
        .then(savedBug => res.send(savedBug))
        .catch((err) => {
            loggerService.error('Cannot save bug', err)
            res.status(500).send('Cannot save bug', err)
        })
})

// Bug Update
app.put('/api/bug/', (req, res) => {
    const loggedinUser = userService.validateToken(req.cookies.loginToken)
    if (!loggedinUser) return res.status(401).send('Cannot update bug.')

    const bugToSave = {
        _id: req.query._id,
        title: req.body.title || '',
        description: req.body.description || '',
        labels: req.body.labels || '',
        severity: +req.body.severity || ''
    }
    bugService.save(bugToSave, loggedinUser)
        .then(savedBug => res.send(savedBug))
        .catch((err) => {
            loggerService.error('Cannot save bug', err)
            res.status(500).send('Cannot save bug', err)
        })
})

// Bug DELETE
app.delete('/api/bug/:bugId', (req, res) => {
    const loggedinUser = userService.validateToken(req.cookies.loginToken)
    if (!loggedinUser) return res.status(401).send('Cannot update bug.')

    const { bugId } = req.params
    bugService.remove(bugId, loggedinUser)
        .then(() => {
            loggerService.info(`Bug ${bugId} removed`)
            res.send(`Bug (${bugId}) removed!`)
        })
        .catch((err) => {
            loggerService.error('Cannot get bug', err)
            res.status(500).send('Cannot get bug')
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

app.delete('/api/user/:userId', (req, res) => {
    const loggedinUser = userService.validateToken(req.cookies.loginToken)
    if (!loggedinUser.isAdmin) return res.status(401).send('Cannot remove user.')

    const { userId } = req.params

    userService.remove(userId, loggedinUser)
        .then(() => {
            loggerService.info(`User ${userId} removed`)
            res.send(`User (${userId}) removed!`)
        })
        .catch((err) => {
            loggerService.error('Cannot get user', err)
            res.status(500).send('Cannot get user')
        })

})

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

app.listen(3030, () => console.log('Server ready at 127.0.0.1:3030 !'))
