import { BugList } from "../cmps/BugList.jsx"
import { bugService } from "../services/bug.service.js"
import { userService } from "../services/user.service.js"

import { showSuccessMsg, showErrorMsg } from '../services/event-bus.service.js'

const { useState, useEffect } = React

export function UserDetails() {
    const [user, setUser] = useState()
    const [filterBy, setFilterBy] = useState(null)
    const [bugs, setBugs] = useState()

    useEffect(() => {
        setUser(userService.getLoggedinUser())
    }, [])


    useEffect(() => {
        if (user) setFilterBy({ userId: user._id })
    }, [user])

    useEffect(() => {
        loadBugs()
    }, [filterBy])

    function onRemoveBug(bugId) {
        bugService
            .remove(bugId)
            .then(() => {
                console.log('Deleted Successfully!')
                const bugsToUpdate = bugs.filter((bug) => bug._id !== bugId)
                setBugs(bugsToUpdate)
                showSuccessMsg('Bug removed')
            })
            .catch((err) => {
                console.log('Error from onRemoveBug ->', err)
                showErrorMsg('Cannot remove bug')
            })
    }

    function loadBugs() {
        bugService.query(filterBy).then(setBugs)
    }

    if (!user) return <h3>Loading..</h3>

    return (
        <div className="bugs-container">
            <h2>Welcome, {user.fullname}</h2>
            <BugList bugs={bugs} onRemoveBug={onRemoveBug} />
        </div>
    )
}