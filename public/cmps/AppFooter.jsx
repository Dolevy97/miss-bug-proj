import { ProgressBar } from "./ProgressBar.jsx";
const { useSelector } = ReactRedux


export function AppFooter() {

    const user = useSelector(storeState => storeState.loggedInUser)

    return (
        <section className="footer-container full" style={user && { backgroundColor: user.prefs.bgColor, color: user.prefs.color }}>
            <ProgressBar />
        </section>
    )
}