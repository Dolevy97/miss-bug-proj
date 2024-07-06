import { TodoFilter } from "../cmps/TodoFilter.jsx"
import { TodoList } from "../cmps/TodoList.jsx"
import { DataTable } from "../cmps/data-table/DataTable.jsx"
import { todoService } from "../services/todo.service.js"
import { showErrorMsg, showSuccessMsg } from "../services/event-bus.service.js"
import { loadTodos, removeTodo, saveTodo, setFilterBy, setSortBy } from "../store/actions/todo.actions.js"
import { updateBalance } from "../store/actions/user.actions.js"
import { utilService } from "../services/util.service.js"
import { TodoSort } from "../cmps/TodoSort.jsx"
import { TodoPagination } from "../cmps/TodoPagination.jsx"

const { useEffect } = React
const { useSelector } = ReactRedux
const { Link, useSearchParams } = ReactRouterDOM

export function TodoIndex() {

    const todos = useSelector(storeState => storeState.todos)
    const filterBy = useSelector(storeState => storeState.filterBy)
    const sortBy = useSelector(storeState => storeState.sortBy)
    const page_size = useSelector(storeState => storeState.page_size)

    // Special hook for accessing search-params:
    const [searchParams, setSearchParams] = useSearchParams()
    const debouncedLoadTodos = utilService.debounce(loadTodos, 300)

    const defaultFilter = todoService.getFilterFromSearchParams(searchParams)
    const defaultSort = todoService.getSortFromSearchParams(searchParams)

    useEffect(() => {
        setSearchParams({ ...filterBy, ...sortBy })
        debouncedLoadTodos(filterBy, sortBy)
    }, [filterBy, sortBy])

    useEffect(() => {
        setFilterBy({ ...defaultFilter, pageSize: page_size })
        setSortBy(defaultSort)
    }, [])
    
    function onRemoveTodo(todoId) {
        const confirmRemove = confirm('Are you sure you want to delete the todo?')
        if (confirmRemove) {
            removeTodo(todoId)
                .then(() => {
                    showSuccessMsg(`Todo removed`)
                })
                .catch(err => {
                    console.log('err:', err)
                    showErrorMsg('Cannot remove todo ' + todoId)
                })
        }
    }

    function onToggleTodo(todo) {
        const todoToSave = { ...todo, isDone: !todo.isDone }
        if (todoToSave.isDone) {
            updateBalance(10)
        }
        saveTodo(todoToSave)
            .then((savedTodo) => {
                showSuccessMsg(`Todo is ${(savedTodo.isDone) ? 'done' : 'back on your list'}`)
            })
            .catch(err => {
                console.log('err:', err)
                showErrorMsg('Cannot toggle todo ' + todo._id)
            })
    }

    function onSetFilterBy(filter) {
        setFilterBy(filter)
    }

    function onSetSortBy(sort) {
        setSortBy(sort)
    }

    if (!todos) return <div>Loading...</div>
    return (
        <section className="todo-index">
            <div className="btn-add">
                <Link to="/todo/edit" className="btn" >Add Todo</Link>
            </div>

            <TodoFilter filterBy={filterBy} onSetFilterBy={onSetFilterBy} />
            <TodoSort sortBy={sortBy} onSetSortBy={onSetSortBy} />
            <TodoPagination filterBy={filterBy} onSetFilterBy={onSetFilterBy} />

            <h2>Todos List</h2>
            <TodoList todos={todos} onRemoveTodo={onRemoveTodo} onToggleTodo={onToggleTodo} />
            <hr />
            <h2>Todos Table</h2>
            <div style={{ width: '60%', margin: 'auto', marginBlockEnd: '100px' }}>
                <DataTable todos={todos} onRemoveTodo={onRemoveTodo} />
            </div>
        </section>
    )
}