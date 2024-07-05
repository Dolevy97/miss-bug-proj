import { userService } from "../services/user.service.js"

const { createStore } = Redux


// Filter By
export const SET_FILTER_BY = 'SET_FILTER_BY'
export const SET_SORT_BY = 'SET_SORT_BY'

// User
export const SET_USER = 'SET_USER'
export const SET_USER_BALANCE = 'SET_USER_BALANCE'

// Todos
export const SET_TODOS = 'SET_TODOS'
export const SET_TOTAL_TODOS = 'SET_TOTAL_TODOS'
export const REMOVE_TODO = 'REMOVE_TODO'
export const ADD_TODO = 'ADD_TODO'
export const UPDATE_TODO = 'UPDATE_TODO'

// Misc
export const SET_IS_LOADING = 'SET_IS_LOADING'


const initialState = {
    filterBy: {},
    sortBy: {},
    todos: [],
    totalTodos: [],
    isLoading: false,
    loggedInUser: userService.getLoggedinUser(),
    page_size: 4,
}


function appReducer(state = initialState, cmd = {}) {
    switch (cmd.type) {
        // Filter & Sort
        case SET_FILTER_BY:
            return {
                ...state,
                filterBy: cmd.filterBy
            }

        case SET_SORT_BY:
            return {
                ...state,
                sortBy: cmd.sortBy
            }
        // Todos
        case SET_TODOS:
            return {
                ...state,
                todos: cmd.todos
            }
        case SET_TOTAL_TODOS:
            return {
                ...state,
                totalTodos: cmd.todos
            }
        case REMOVE_TODO:
            return {
                ...state,
                todos: state.todos.filter(todo => todo._id !== cmd.todoId),
                totalTodos: state.todos
            }
        case ADD_TODO:
            return {
                ...state,
                todos: [...state.todos, cmd.todo],
                totalTodos: state.todos
            }
        case UPDATE_TODO:
            return {
                ...state,
                todos: state.todos.map(todo => todo._id === cmd.todo._id ? cmd.todo : todo)
            }

        // User
        case SET_USER:
            return { ...state, loggedInUser: cmd.user }

        case SET_USER_BALANCE:
            const loggedInUser = { ...state.loggedInUser, balance: cmd.balance }
            return { ...state, loggedInUser }

        // Misc
        case SET_IS_LOADING:
            return {
                ...state,
                isLoading: cmd.isLoading
            }

        default:
            return state
    }
}


export const store = createStore(appReducer)