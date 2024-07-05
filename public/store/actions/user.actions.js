import { userService } from "../../services/user.service.js"
import { SET_USER, SET_USER_BALANCE, store } from "../store.js"

export function login(credentials) {
    return userService.login(credentials)
        .then((user) => {
            store.dispatch({ type: SET_USER, user })
        })
        .catch((err) => {
            console.log('user actions -> Cannot login', err)
            throw err
        })
}

export function signup(credentials) {
    return userService.signup(credentials)
        .then((user) => {
            store.dispatch({ type: SET_USER, user })
        })
        .catch((err) => {
            console.log('user actions -> Cannot signup', err)
            throw err
        })
}

export function logout() {
    return userService.logout()
        .then(() => {
            store.dispatch({ type: SET_USER, user: null })
        })
        .catch((err) => {
            console.log('user actions -> Cannot logout', err)
            throw err
        })
}

export function saveUser(user) {
    return userService.saveUser(user)
        .then(updatedUser => {
            store.dispatch({ type: SET_USER, user: updatedUser })
        })
        .catch((err) => {
            console.log('user actions -> Cannot update user', err)
            throw err
        })
}

export function updateBalance(diff) {
    return userService.updateBalance(diff)
        .then((newBalance) => {
            store.dispatch({ type: SET_USER_BALANCE, balance: newBalance })
        })
        .catch((err) => {
            console.log('user actions -> Cannot update balance', err)
            throw err
        })
}