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
            // Filtering & Pagination
            todos = _filter(todos, filterBy)

            // // Sorting
            todos = _sort(todos, sortBy)

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

function _filter(todos, filterBy) {
    if (filterBy.txt) {
        const regExp = new RegExp(filterBy.txt, 'i')
        todos = todos.filter(todo => regExp.test(todo.txt))
    }
    if (filterBy.importance) {
        todos = todos.filter(todo => todo.importance >= filterBy.importance)
    }
    if (filterBy.isDone === 'done') {
        todos = todos.filter(todo => todo.isDone)
    } else if (filterBy.isDone === 'active') {
        todos = todos.filter(todo => !todo.isDone)
    }
    if (filterBy.pageIdx !== undefined) {
        const startIdx = filterBy.pageIdx * filterBy.pageSize
        todos = todos.slice(startIdx, startIdx + filterBy.pageSize)
    }
    return todos
}

function _sort(todos, sortBy) {
    if (sortBy.field === 'name') {
        todos = todos.toSorted((t1, t2) => t1.txt.localeCompare(t2.txt) * sortBy.dir)
    } else if (sortBy.field === 'importance') {
        todos = todos.toSorted((t1, t2) => (t2.importance - t1.importance) * sortBy.dir)
    }
    return todos
}