const { Link } = ReactRouterDOM

export function AdminHeader() {
    return (
        <section className="user-index-container">
            <h2>Hey admin!</h2>
            <button><Link to={`/users`}>Access User Index</Link></button>
        </section>
    )
}