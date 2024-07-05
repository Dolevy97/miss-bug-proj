import { utilService } from './util.service.js'
import { storageService } from './async-storage.service.js'

const TODO_KEY = 'todoDB'

_createTodos()


export const todoService = {
    query,
    get,
    remove,
    save,
    getEmptyTodo,
    getDefaultFilter,
    getDefaultSort,
    getFilterFromSearchParams,
    getSortFromSearchParams,
    getImportanceStats,
}

function query(filterBy = {}, sortBy = {}) {


    return storageService.query(TODO_KEY)
        .then(todos => {
            // Filtering
            todos = _filter(todos, filterBy)

            // Sorting
            todos = _sort(todos, sortBy)

            // Pagination
            if (filterBy.pageIdx !== undefined) {
                const startIdx = filterBy.pageIdx * filterBy.pageSize
                todos = todos.slice(startIdx, startIdx + filterBy.pageSize)
            }
            return todos
        })
}

function get(todoId) {
    return storageService.get(TODO_KEY, todoId)
        .then(todo => {
            todo = _setNextPrevTodoId(todo)
            return todo
        })
}

function remove(todoId) {
    return storageService.remove(TODO_KEY, todoId)
}

function save(todo) {
    if (todo._id) {
        todo.updatedAt = Date.now()
        return storageService.put(TODO_KEY, todo)
    } else {
        todo.createdAt = todo.updatedAt = Date.now()
        return storageService.post(TODO_KEY, todo)
    }
}

function getEmptyTodo(txt = '', importance = 5) {
    return { txt, importance, isDone: false }
}

function getDefaultFilter() {
    return { txt: '', importance: 0, isDone: '', pageIdx: undefined }
}

function getDefaultSort() {
    return { 'name': 1 }
}

function getFilterFromSearchParams(searchParams) {
    const defaultFilter = getDefaultFilter()
    const filterBy = {}
    for (const field in defaultFilter) {
        if (field === 'pageIdx') {
            filterBy[field] = parseInt(searchParams.get(field))
            if (isNaN(filterBy[field])) filterBy[field] = undefined
        } else {
            filterBy[field] = searchParams.get(field) || ''
        }
    }
    return filterBy
}

function getSortFromSearchParams(searchParams) {
    const defaultSort = getDefaultSort()
    const sortBy = {}
    for (const field in defaultSort) {
        sortBy[field] = searchParams.get(field) || ''
    }
    return sortBy
}


function getImportanceStats() {
    return storageService.query(TODO_KEY)
        .then(todos => {
            const todoCountByImportanceMap = _getTodoCountByImportanceMap(todos)
            const data = Object.keys(todoCountByImportanceMap).map(speedName => ({ title: speedName, value: todoCountByImportanceMap[speedName] }))
            return data
        })

}

function _createTodos() {
    let todos = utilService.loadFromStorage(TODO_KEY)
    if (!todos || !todos.length) {
        todos = []
        const txts = ['Learn React', 'Master CSS', 'Practice Redux']
        for (let i = 0; i < 20; i++) {
            const txt = txts[utilService.getRandomIntInclusive(0, txts.length - 1)]
            todos.push(_createTodo(txt + (i + 1), utilService.getRandomIntInclusive(1, 10)))
        }
        utilService.saveToStorage(TODO_KEY, todos)
    }
}

function _createTodo(txt, importance) {
    const todo = getEmptyTodo(txt, importance)
    todo._id = utilService.makeId()
    todo.color = utilService.getRandomColor()
    todo.createdAt = todo.updatedAt = Date.now() - utilService.getRandomIntInclusive(0, 1000 * 60 * 60 * 24)
    return todo
}

function _setNextPrevTodoId(todo) {
    return storageService.query(TODO_KEY).then((todos) => {
        const todoIdx = todos.findIndex((currTodo) => currTodo._id === todo._id)
        const nextTodo = todos[todoIdx + 1] ? todos[todoIdx + 1] : todos[0]
        const prevTodo = todos[todoIdx - 1] ? todos[todoIdx - 1] : todos[todos.length - 1]
        todo.nextTodoId = nextTodo._id
        todo.prevTodoId = prevTodo._id
        return todo
    })
}

function _getTodoCountByImportanceMap(todos) {
    const todoCountByImportanceMap = todos.reduce((map, todo) => {
        if (todo.importance < 3) map.low++
        else if (todo.importance < 7) map.normal++
        else map.urgent++
        return map
    }, { low: 0, normal: 0, urgent: 0 })
    return todoCountByImportanceMap
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
    return todos
}

function _sort(todos, sortBy) {
    if (sortBy.name) {
        todos = todos.toSorted((t1, t2) => t1.txt.localeCompare(t2.txt) * sortBy.name)
    } else if (sortBy.importance) {
        todos = todos.toSorted((t1, t2) => (t2.importance - t1.importance) * sortBy.importance)
    }
    return todos
}


// Data Model:
// const todo = {
//     _id: "gZ6Nvy",
//     txt: "Master Redux",
//     importance: 9,
//     isDone: false,
//     createdAt: 1711472269690,
//     updatedAt: 1711472269690
// }

