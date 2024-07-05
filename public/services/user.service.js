import { storageService } from "./async-storage.service.js"

const STORAGE_KEY_LOGGEDIN = 'user'
const STORAGE_KEY_LOGGEDIN_USER = 'user'
const BASE_URL = '/api/user/'

const STORAGE_KEY = 'userDB'

export const userService = {
    getLoggedinUser,
    login,
    logout,
    signup,
    getById,
    query,
    getEmptyCredentials,
    updateBalance,
    saveUser
}


function query() {
    return axios.get(BASE_URL)
        .then(res => res.data)
}

function getById(userId) {
    return axios.get(BASE_URL + userId)
        .then(res => res.data)
}

function login({ username, password }) {
    return axios.post('/api/auth/login', { username, password })
        .then(res => res.data)
        .then(user => {
            _setLoggedinUser(user)
            return user
        })
}

function signup({ username, password, fullname }) {
    const user = { username, password, fullname, balance: 10000, activities: [], prefs: { color: '#dddddd', bgColor: '#222222' } }
    user.createdAt = user.updatedAt = Date.now()
    return axios.post('/api/auth/signup', user)
        .then(res => res.data)
        .then(user => {
            _setLoggedinUser(user)
            return user
        })
}

function logout() {
    return axios.post('/api/auth/logout')
        .then(() => {
            sessionStorage.removeItem(STORAGE_KEY_LOGGEDIN_USER)
        })
}

function getLoggedinUser() {
    return JSON.parse(sessionStorage.getItem(STORAGE_KEY_LOGGEDIN_USER))
}

function _setLoggedinUser(user) {
    const userToSave = { _id: user._id, fullname: user.fullname, balance: user.balance, activities: user.activities, prefs: user.prefs }
    sessionStorage.setItem(STORAGE_KEY_LOGGEDIN_USER, JSON.stringify(userToSave))
    console.log(userToSave)
    return userToSave
}

function updateBalance(diff) {
    const loggedInUser = getLoggedinUser()
    if (!loggedInUser) return Promise.reject(new Error('User not logged in'));

    return userService.getById(loggedInUser._id)
        .then(user => {
            if (!user) {
                throw new Error('User not found');
            }
            user.balance += diff
            return saveUser(user)
        })
        .then(user => {
            sessionStorage.setItem(STORAGE_KEY_LOGGEDIN, JSON.stringify(user))
            return user.balance
        })
        .catch(error => {
            console.error('Error updating balance:', error)
            throw error
        })
}

function saveUser(userToEdit) {
    return axios.put(BASE_URL + userToEdit._id, userToEdit)
        .then(() => {
            _setLoggedinUser(userToEdit)
            return userToEdit
        })
        .catch(error => {
            console.error('Error saving user:', error)
            throw error
        })
}

function getEmptyCredentials() {
    return {
        fullname: '',
        username: 'muki',
        password: 'muki1',
    }
}

// signup({username: 'muki', password: 'muki1', fullname: 'Muki Ja'})
// login({username: 'muki', password: 'muki1'})

// Data Model:

// const user = {
//     _id: "KAtTl",
//     username: "muki",
//     password: "muki1",
//     fullname: "Muki Ja",
//     createdAt: 1711490430252,
//     updatedAt: 1711490430999
// }