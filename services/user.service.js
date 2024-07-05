import fs from 'fs'
import Cryptr from 'cryptr'

import { utilService } from './util.service.js'

const cryptr = new Cryptr(process.env.SECRET1)
const users = utilService.readJsonFile('data/user.json')

export const userService = {
	query,
	getById,
	remove,
	save,
	checkLogin,
	getLoginToken,
	validateToken,
	updateUser
}

function getLoginToken(user) {
	const str = JSON.stringify(user)
	const encryptedStr = cryptr.encrypt(str)
	return encryptedStr
}

function validateToken(token) {
	if (!token) return null

	const str = cryptr.decrypt(token)
	const user = JSON.parse(str)
	return user
}

function checkLogin({ username, password }) {
	var user = users.find(user => user.username === username && user.password === password)
	if (user) {
		user = {
			_id: user._id,
			fullname: user.fullname,
			isAdmin: user.isAdmin,
			activities: user.activities,
			balance: user.balance,
			prefs: user.prefs
		}
	}
	return Promise.resolve(user)
}

function query() {
	const usersToReturn = users.map(user => ({ _id: user._id, fullname: user.fullname }))
	return Promise.resolve(usersToReturn)
}

function getById(userId) {
	var user = users.find(user => user._id === userId)
	if (!user) return Promise.reject('User not found!')

	user = {
		_id: user._id,
		username: user.username,
		fullname: user.fullname,
	}

	return Promise.resolve(user)
}

function remove(userId, loggedInUser) {
	if (!loggedInUser.isAdmin) return Promise.reject('Cannot delete a user!')
	else {
		const userIdx = users.findIndex(user => user._id === userId)
		if (userIdx < 0) return Promise.reject(`Cannot find user - ${userId}`)
		users.splice(userIdx, 1)
		return _saveUsersToFile()
	}
}

function updateUser(userId, userToSave) {
	const userIdx = users.findIndex(user => user._id === userToSave._id)
	const user = users[userIdx]

	const updatedActivities = [...user.activities, ...userToSave.activities]

	const newUser = { ...user, ...userToSave, activities: updatedActivities }
	users[userIdx] = newUser
	return _saveUsersToFile()
}

function save(user) {
	user._id = utilService.makeId()
	user = { ...user, isAdmin: false, _id: utilService.makeId(), balance: 10000, activities: [], prefs: { color: '#dddddd', bgColor: '#222222' } }
	users.push(user)

	return _saveUsersToFile()
		.then(() => ({
			_id: user._id,
			fullname: user.fullname,
			isAdmin: user.isAdmin,
			activities: user.activities,
			balance: user.balance,
			prefs: user.prefs
		}))
}

function _saveUsersToFile() {
	return new Promise((resolve, reject) => {
		const usersStr = JSON.stringify(users, null, 2)
		fs.writeFile('data/user.json', usersStr, err => {
			if (err) {
				return console.log(err)
			}
			resolve()
		})
	})
}