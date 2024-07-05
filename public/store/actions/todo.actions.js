import { todoService } from "../../services/todo.service.js";
import { userService } from "../../services/user.service.js";
import { utilService } from "../../services/util.service.js";
import { saveUser } from "../../store/actions/user.actions.js"

import {
    REMOVE_TODO, SET_FILTER_BY, SET_IS_LOADING,
    SET_TODOS, SET_TOTAL_TODOS, store, UPDATE_TODO, ADD_TODO,
    SET_SORT_BY
} from "../store.js";

export function loadTodos(filterBy, sortBy) {
    store.dispatch({ type: SET_IS_LOADING, isLoading: true })

    todoService.query()
        .then(todos => {
            store.dispatch({ type: SET_TOTAL_TODOS, todos })
        })
        .catch(err => {
            console.log('todo action -> Cannot load todos', err)
            throw err
        })

    return todoService.query(filterBy, sortBy)
        .then(todos => {
            store.dispatch({ type: SET_TODOS, todos })
        })
        .catch(err => {
            console.log('todo action -> Cannot load todos', err)
            throw err
        })
        .finally(() => {
            store.dispatch({ type: SET_IS_LOADING, isLoading: false })
        })
}

export function removeTodo(todoId) {
    // console.log('todoId from actions:', todoId)
    return todoService.get(todoId)
        .then(removedTodo => {
            if (!removedTodo) throw new Error(`Todo with ID ${todoId} not found`)

            return todoService.remove(todoId)
                .then(() => {
                    let currUser = userService.getLoggedinUser()
                    if (!currUser) throw new Error('No logged-in user found')

                    const newActivity = {
                        txt: `Removed a Todo: '${removedTodo.txt}'`,
                        at: Date.now(),
                        _id: utilService.makeId()
                    };

                    currUser.activities.unshift(newActivity)
                    saveUser(currUser)
                    store.dispatch({ type: REMOVE_TODO, todoId })
                });
        })
        .catch(err => {
            console.error('Todo action -> Cannot remove todo', err)
            throw err;
        })
}

export function saveTodo(todo) {
    // console.log('todo from actions:', todo)
    const type = todo._id ? UPDATE_TODO : ADD_TODO
    return todoService.save(todo)
        .then(savedTodo => {
            if (type === ADD_TODO) {
                let currUser = userService.getLoggedinUser()
                const newActivity = { txt: `Added a Todo: '${todo.txt}'`, at: Date.now(), _id: utilService.makeId() }
                currUser.activities.unshift(newActivity)
                saveUser(currUser)
            }
            store.dispatch({ type, todo })
            return savedTodo
        })
        .catch(err => {
            console.log('Todo action -> Cannot save todo', err)
            throw err
        })
}

export function setFilterBy(filterBy) {
    store.dispatch({ type: SET_FILTER_BY, filterBy })
}

export function setSortBy(sortBy) {
    store.dispatch({ type: SET_SORT_BY, sortBy })
}