import { utilService } from "./util.service.js"
import fs from 'fs'

const todos = utilService.readJsonFile('data/todo.json')

export const todoService = {
    query,
    save,
    getById,
    remove,
}

function query(filterBy = {}, sortBy = {}) {
    return Promise.resolve(todos)
        .then(todos => {

            // // Filtering & Pagination
            // todos = _filter(todos, filterBy)

            // // Sorting
            // todos = _sort(todos, sortBy)

            return todos
        })
}

function save(todoToSave) {
    if (todoToSave._id) {
        const todoIdx = todos.findIndex(todo => todo._id === todoToSave._id)
        todos[todoIdx] = todoToSave
    } else {
        todoToSave._id = utilService.makeId()
        todos.unshift(todoToSave)
    }
    return _saveTodosToFile().then(() => todoToSave)
}

function getById(todoId) {
    // console.log(todoId)
    const todo = todos.find(todo => todo._id === todoId)
    if (!todo) return Promise.reject('Cannot find todo to update - ' + todoId)
    return Promise.resolve(todo)
}

function remove(todoId) {
    const todoIdx = todos.findIndex(todo => todo._id === todoId)
    if (todoIdx < 0) return Promise.reject(`Cannot find todo - ${todoId}`)
    todos.splice(todoIdx, 1)
    return _saveTodosToFile().then(() => `Todo (${todoId}) removed!`)
}



function _saveTodosToFile() {
    return new Promise((resolve, reject) => {
        const data = JSON.stringify(todos, null, 4)
        fs.writeFile('data/todo.json', data, (err) => {
            if (err) {
                return reject(err)
            }
            resolve()
        })
    })
}

// function _filter(todos, filterBy) {
//     if (filterBy.title) {
//         const regExp = new RegExp(filterBy.title, 'i')
//         todos = todos.filter(todo => regExp.test(todo.title))
//     }
//     if (filterBy.importance) {
//         todos = todos.filter(todo => todo.importance >= filterBy.importance)
//     }
//     if (filterBy.userId) {
//         todos = todos.filter(todo => todo.creator._id === filterBy.userId)
//     }
//     return todos
// }

// function _sort(todos, sortBy) {
//     if (sortBy.field === 'title') {
//         todos = todos.toSorted((b1, b2) => b1.title.localeCompare(b2.title) * sortBy.order)
//     }
//     else if (sortBy.field === 'importance') {
//         todos = todos.toSorted((b1, b2) => (b2.importance - b1.importance) * sortBy.order)
//     }
//     else if (sortBy.field === 'createdAt') {
//         todos = todos.toSorted((b1, b2) => (b2.createdAt - b1.createdAt) * sortBy.order)
//     }
//     return todos
// }