import { showErrorMsg, showSuccessMsg } from "../services/event-bus.service.js"
import { userService } from "../services/user.service.js"
import { utilService } from "../services/util.service.js"
import { saveUser } from "../store/actions/user.actions.js"
const { useState, useEffect } = React
const { useSelector } = ReactRedux
const { useParams } = ReactRouterDOM

export function UserDetails() {
    const [userProfile, setUserProfile] = useState(null)
    const user = useSelector(storeState => storeState.loggedInUser)
    const [userToEdit, setUserToEdit] = useState(user)
    const { userId } = useParams()

    useEffect(() => {
        if (userId !== user._id) {
            userService.getById(userId)
                .then(user => {
                    setUserProfile(user)
                    setUserToEdit(user)
                })
        } else {
            setUserProfile(user)
        }
    }, [user])

    function handleChange({ target }) {
        const field = target.name
        let value = target.value

        switch (target.type) {
            case 'number':
            case 'range':
                value = +value || ''
                break
            case 'checkbox':
                value = target.checked
                break

            default: break
        }
        if (target.type === 'color') {
            setUserToEdit(prevUser =>
            (
                {
                    ...prevUser, prefs: { ...prevUser.prefs, [field]: value }
                }
            ))
        }
        else setUserToEdit(prevUser => ({ ...prevUser, [field]: value }))
    }

    function onChangeUserDetails(ev) {
        ev.preventDefault()
        const userToSave = { ...userToEdit, fullname: userToEdit.fullname.trim() }
        saveUser(userToSave)
            .then(() => {
                showSuccessMsg('User updated successfully!')
            })
            .catch(() => {
                showErrorMsg('User not updated')
            })
    }

    if (!userProfile) return <h3>Loading..</h3>

    const isCurrUserProfile = userId === user._id
    const { fullname, prefs } = userToEdit
    const { color = '#000000', bgColor = '#ffffff' } = prefs

    return (
        <section className="user-details">
            <h1>Hello {user.fullname}!</h1>
            <h2>Welcome to {isCurrUserProfile ? 'your' : `${userProfile.fullname}'s`} profile!</h2>

            {isCurrUserProfile &&
                <form className="user-details-form" onSubmit={onChangeUserDetails} style={{ backgroundColor: user.prefs.bgColor, color: user.prefs.color }}>
                    <label htmlFor="fullname">Full Name:</label>
                    <input type="text" value={fullname} name="fullname" onChange={handleChange} />

                    <label htmlFor="color">Text Color:</label>
                    <input type="color" value={color} name="color" onChange={handleChange} />

                    <label htmlFor="bgcolor">Background Color:</label>
                    <input type="color" value={bgColor} name="bgColor" onChange={handleChange} />

                    <button>Submit</button>
                </form>
            }

            <section className="activities-container">
                <h2>User Activities</h2>
                <ul>
                    {userProfile.activities.map(activity =>
                        <li key={activity._id} className="activity-container">
                            <span className="activity-time">{utilService.getFormattedTime(activity.at)}: </span>{activity.txt}</li>
                    )}
                </ul>
            </section>
        </section>
    )
}