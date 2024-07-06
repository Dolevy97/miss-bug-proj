const { useSelector } = ReactRedux
const { useEffect } = React


export function ProgressBar() {

    const user = useSelector(storeState => storeState.loggedInUser)
    const totalTodos = useSelector(storeState => storeState.totalTodos)
    const todos = useSelector(storeState => storeState.todos)


    useEffect(() => {
        getTodosPercent()
    }, [todos])

    function getTodosPercent() {
        if (!totalTodos.length) return
        const doneTodos = totalTodos.filter(todo => todo.isDone)
        const doneTodosPercent = (doneTodos.length / totalTodos.length * 100)
        return doneTodosPercent
    }

    return (
        <article className="progress-bar-container">
            <h3>Progress:</h3>
            <div className="progress-bar">
                <div className="progress" style={user && { width: `${getTodosPercent()}%`, backgroundColor: user.prefs.bgColor, color: user.prefs.color }}></div>
            </div>
        </article>
    )
}