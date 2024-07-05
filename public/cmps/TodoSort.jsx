const { useState, useEffect } = React


export function TodoSort({ sortBy, onSetSortBy }) {

    const [sortByToEdit, setSortByToEdit] = useState({ ...sortBy })
    const [sortDirection, setSortDirection] = useState(1)


    useEffect(() => {
        // Notify parent
        onSetSortBy(sortByToEdit)
    }, [sortByToEdit])

    function onSortBy(value) {
        setSortByToEdit(({ [value]: sortDirection }))
        setSortDirection(sortDirection === 1 ? -1 : 1)
    }

    return (
        <section className="todo-sort">
            <h2>Sort by:</h2>
            <button onClick={() => onSortBy('name')} className="btn sort-btn">Name</button>
            <button onClick={() => onSortBy('importance')} className="btn sort-btn">Importance</button>
        </section>
    )
}