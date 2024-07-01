import express from "express"
import cookieParser from "cookie-parser"
import path from 'path'

import { bugService } from "./services/bug.service.js"
import { loggerService } from "./services/logger.service.js"
import { fileURLToPath } from 'url';

const app = express()
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

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
        pageIdx: req.query.pageIdx
    }
    bugService.query(filterBy)
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
    const bug = {
        title: req.body.title || '',
        description: req.body.description || '',
        severity: +req.body.severity || '',
        createdAt: +req.body.createdAt || Date.now()
    }
    bugService.save(bug)
        .then(savedBug => res.send(savedBug))
        .catch((err) => {
            loggerService.error('Cannot save bug', err)
            res.status(500).send('Cannot save bug', err)
        })
})

// Bug Update

app.put('/api/bug/:bugId', (req, res) => {
    const bugToSave = {
        _id: req.body._id,
        title: req.body.title || '',
        description: req.body.description || '',
        severity: +req.body.severity || ''
    }
    bugService.save(bugToSave)
        .then(savedBug => res.send(savedBug))
        .catch((err) => {
            loggerService.error('Cannot save bug', err)
            res.status(500).send('Cannot save bug', err)
        })
})


// Bug DELETE
app.delete('/api/bug/:bugId', (req, res) => {
    const { bugId } = req.params
    console.log(bugId)
    bugService.remove(bugId)
        .then(() => {
            loggerService.info(`Bug ${bugId} removed`)
            res.send(`Bug (${bugId}) removed!`)
        })
        .catch((err) => {
            loggerService.error('Cannot get bug', err)
            res.status(500).send('Cannot get bug')
        })
})

app.get('/**', (req, res) => {
    res.sendFile(path.resolve(__dirname, 'public', 'index.html'))
})

app.listen(3030, () => console.log('Server ready at 127.0.0.1:3030 !'))
