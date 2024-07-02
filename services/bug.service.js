import { utilService } from "./util.service.js"
import fs from 'fs'

const PAGE_SIZE = 4
const bugs = utilService.readJsonFile('data/bug.json')

export const bugService = {
    query,
    save,
    getById,
    remove,
}

function query(filterBy = {}, sortBy = {}) {
    return Promise.resolve(bugs)
        .then(bugs => {

            // Filtering & Pagination
            bugs = _filter(bugs, filterBy)

            // Sorting
            bugs = _sort(bugs, sortBy)

            return bugs
        })
}

function save(bugToSave) {
    if (bugToSave._id) {
        const bugIdx = bugs.findIndex(bug => bug._id === bugToSave._id)
        bugs[bugIdx] = bugToSave
    } else {
        bugToSave._id = utilService.makeId()
        bugs.unshift(bugToSave)
    }
    return _saveBugsToFile().then(() => bugToSave)
}

function remove(bugId) {
    const bugIdx = bugs.findIndex(bug => bug._id === bugId)
    if (bugIdx < 0) return Promise.reject(`Cannot find bug - ${bugId}`)
    bugs.splice(bugIdx, 1)
    return _saveBugsToFile().then(() => `Bug (${bugId}) removed!`)
}

function getById(bugId) {
    const bug = bugs.find(bug => bug._id === bugId)
    if (!bug) return Promise.reject('Cannot find bug- ' + bugId)
    return Promise.resolve(bug)
}

function _saveBugsToFile() {
    return new Promise((resolve, reject) => {
        const data = JSON.stringify(bugs, null, 4)
        fs.writeFile('data/bug.json', data, (err) => {
            if (err) {
                return reject(err)
            }
            resolve()
        })
    })
}

function _filter(bugs, filterBy) {
    if (filterBy.title) {
        const regExp = new RegExp(filterBy.title, 'i')
        bugs = bugs.filter(bug => regExp.test(bug.title))
    }
    if (filterBy.severity) {
        bugs = bugs.filter(bug => bug.severity >= filterBy.severity)
    }
    if (filterBy.labels) {
        bugs = bugs.filter(bug => bug.labels.some(label => label.includes(filterBy.labels)))
    }
    if (filterBy.pageIdx !== undefined) {
        const startIdx = filterBy.pageIdx * PAGE_SIZE
        bugs = bugs.slice(startIdx, startIdx + PAGE_SIZE)
    }
    return bugs
}

function _sort(bugs, sortBy) {
    if (sortBy.field === 'title') {
        bugs = bugs.toSorted((b1, b2) => b1.title.localeCompare(b2.title) * sortBy.order)
    }
    else if (sortBy.field === 'severity') {
        bugs = bugs.toSorted((b1, b2) => (b2.severity - b1.severity) * sortBy.order)
    }
    else if (sortBy.field === 'createdAt') {
        bugs = bugs.toSorted((b1, b2) => (b2.createdAt - b1.createdAt) * sortBy.order)
    }
    return bugs
}