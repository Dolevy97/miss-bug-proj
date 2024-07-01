import express from "express"
import cookieParser from "cookie-parser"
import { bugService } from "./services/bug.service.js"
import { loggerService } from "./services/logger.service.js"

const app = express()


//* Express Config:
app.use(cookieParser())
app.use(express.static('public'))

//* Express Routing:

app.get('/api/bug', (req, res) => {
    const filterBy = {
        title: req.query.title,
        severity: +req.query.severity
    }
    bugService.query(filterBy)
        .then(bugs => res.send(bugs))
        .catch(err => {
            loggerService.error('cannot get bugs', err)
            res.status(500).send('Cannot get bugs')
        })
})


app.get('/api/bug/save', (req, res) => {
    const bugToSave = {
        _id: req.query._id,
        title: req.query.title || '',
        description: req.query.description || '',
        severity: +req.query.severity || '',
        createdAt: Date.now()
    }
    bugService.save(bugToSave)
        .then(bug => res.send(bug))
        .catch((err) => {
            loggerService.error('Cannot save bug', err)
            res.status(500).send('Cannot save bug', err)
        })
})

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

app.get('/api/bug/:bugId/remove', (req, res) => {
    const { bugId } = req.params
    bugService.remove(bugId)
        .then(() => res.send(`Bug (${bugId}) removed!`))
        .catch((err) => {
            loggerService.error('Cannot get bug', err)
            res.status(500).send('Cannot get bug')
        })
})



app.listen(3030, () => console.log('Server ready at port 3030!'))
