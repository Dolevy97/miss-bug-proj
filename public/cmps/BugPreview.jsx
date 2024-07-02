

export function BugPreview({ bug }) {
    const time = new Date(Math.floor(bug.createdAt)).toDateString()
    return <article>
        <h4>{bug.title}</h4>
        <h1>🐛</h1>
        <p>Severity: <span>{bug.severity}</span></p>
        <p>Labels: {bug.labels.join(', ')}</p>
        <p>Created at: {time}</p>
    </article>
}