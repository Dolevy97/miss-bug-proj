const { useSelector } = ReactRedux
const { Link, NavLink, useNavigate } = ReactRouterDOM

import { UserMsg } from "./UserMsg.jsx"
import { LoginSignup } from './LoginSignup.jsx'
import { showErrorMsg, showSuccessMsg } from '../services/event-bus.service.js'
import { logout } from '../store/actions/user.actions.js'
import { ProgressBar } from "./ProgressBar.jsx"


export function AppHeader() {
    const navigate = useNavigate()
    const user = useSelector(storeState => storeState.loggedInUser)


    function onLogout() {
        logout()
            .then(() => {
                showSuccessMsg('Adios')
                navigate('/')
            })
            .catch((err) => {
                showErrorMsg('Oops try again')
            })
    }


    return (
        <header className="app-header full main-layout" style={user && { backgroundColor: user.prefs.bgColor, color: user.prefs.color }}>
            <section className="header-container">
                <h1>React Todo App</h1>
                {user &&
                    <ProgressBar />
                }
                {user ? (
                    <section className="header-user" >
                        <Link to={`/user/${user._id}`}>Hello {user.fullname}!</Link>
                        <p>Current Balance: {user.balance}</p>
                        <button onClick={onLogout}>Logout</button>
                    </section >
                ) : (
                    <section className="header-user-login-signup" >
                        <LoginSignup />
                    </section>
                )}
                <nav className="app-nav">
                    <NavLink to="/" >Home</NavLink>
                    <NavLink to="/about" >About</NavLink>
                    <NavLink to="/todo" >Todos</NavLink>
                    <NavLink to="/dashboard" >Dashboard</NavLink>
                </nav>
            </section>
            <UserMsg />
        </header >
    )
}
