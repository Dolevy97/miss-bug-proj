const { useState, useEffect } = React

export function TodoFilter({ filterBy, onSetFilterBy }) {

    const [filterByToEdit, setFilterByToEdit] = useState({ ...filterBy })

    useEffect(() => {
        // Notify parent
        onSetFilterBy(filterByToEdit)
    }, [filterByToEdit])

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
        setFilterByToEdit(prevFilter => ({ ...prevFilter, [field]: value }))
    }

    function onSubmitFilter(ev) {
        ev.preventDefault()
    }

    const { txt, importance, isDone } = filterBy

    return (
        <section className="todo-filter">
            <h2>Filter Todos</h2>
            <form className="todo-filter-form" onSubmit={onSubmitFilter} >
                <input value={txt || ''} onChange={handleChange}
                    type="search" placeholder="By Txt" id="txt" name="txt"
                />
                <label htmlFor="importance">Importance: </label>
                <input value={importance || 0} onChange={handleChange}
                    type="number" placeholder="By Importance" min={0} id="importance" name="importance"
                />

                <select value={isDone} onChange={handleChange} name="isDone">
                    <option value="all" >All Todos</option>
                    <option value="active">Active Todos</option>
                    <option value="done">Done Todos</option>
                </select>

                <button hidden>Set Filter</button>
            </form>
        </section>
    )
}