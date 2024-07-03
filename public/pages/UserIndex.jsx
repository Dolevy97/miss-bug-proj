import { bugService } from "../services/bug.service.js"
import { userService } from "../services/user.service.js"
import { showSuccessMsg, showErrorMsg } from '../services/event-bus.service.js'

const { useState, useEffect } = React

export function UserIndex() {

    const [users, setUsers] = useState(null)
    const [admin, setAdmin] = useState(null)
    const [bugs, setBugs] = useState(null)

    useEffect
        (() => {
            userService.query().then(setUsers)
            setAdmin(userService.getLoggedinUser())
            bugService.query().then(setBugs)
        }, [])


    if (!users || !admin || !bugs) return <h3>Loading..</h3>

    function onDeleteUser(userToDelete) {
        const isSure = confirm(`Are you sure you want to delete user ${userToDelete._id}?`)
        if (isSure) {
            const bugsByUser = bugs.filter(bug => bug.creator._id === userToDelete._id)
            if (bugsByUser.length) {
                return showErrorMsg('Cannot delete user')
            } else {
                userService.remove(userToDelete._id).then(() => {
                    const usersToUpdate = users.filter((user) => user._id !== userToDelete._id)
                    setUsers(usersToUpdate)
                    showSuccessMsg('User Deleted!')
                })
            }
        }
    }

    return (
        <section className="user-index-container">
            <h2>Users!</h2>

            {users.map(user =>
                admin._id !== user._id &&
                <article className="user-container" key={user._id}>
                    <h3>Name: {user.fullname}</h3>
                    <h3>Id: {user._id}</h3>
                    <button onClick={() => { onDeleteUser(user) }} className="delete">Delete</button>
                </article>
            )}
        </section>
    )
}