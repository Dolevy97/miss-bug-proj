const BASE_URL = '/api/todo/'


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
    const filterAndSort = {
        ...filterBy,
        ...sortBy
    }
    return axios.get(BASE_URL, { params: filterAndSort })
        .then(res => res.data)
}

function get(todoId) {
    return axios.get(BASE_URL + todoId)
        .then(res => {
            res.data = _setNextPrevTodoId(res.data)
            return res.data
        })
}

function remove(todoId) {
    return axios.delete(BASE_URL + todoId)
        .then(res => res.data)
}

function save(todo) {
    const method = todo._id ? 'put' : 'post'
    return axios[method](BASE_URL, todo).then(res => res.data)
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
    return axios.get(BASE_URL)
        .then(res => {
            const todos = res.data
            const todoCountByImportanceMap = _getTodoCountByImportanceMap(todos)
            const data = Object.keys(todoCountByImportanceMap).map(speedName => ({ title: speedName, value: todoCountByImportanceMap[speedName] }))
            return data
        })

}

function _setNextPrevTodoId(todo) {
    return axios.get(BASE_URL).then(res => {
        const todos = res.data
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

