import { TodoPreview } from "./TodoPreview.jsx"
const { Link } = ReactRouterDOM

export function TodoList({ todos, onRemoveTodo, onToggleTodo }) {

    return (
        <ul className="todo-list">
            {!todos.length && <h2 className="no-todos">No todos to display.</h2>}
            {todos.map(todo =>
                <li key={todo._id} style={{ backgroundColor: `${todo.color}22` }}>
                    <TodoPreview todo={todo} onToggleTodo={()=>onToggleTodo(todo)} />
                    <section>
                        <button onClick={() => onRemoveTodo(todo._id)}>Remove</button>
                        <button><Link to={`/todo/${todo._id}`}>Details</Link></button>
                        <button><Link to={`/todo/edit/${todo._id}`}>Edit</Link></button>

                    </section>
                </li>
            )}
        </ul>
    )
}