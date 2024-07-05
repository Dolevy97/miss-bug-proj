const { useSelector } = ReactRedux


export function TodoPagination({ filterBy, onSetFilterBy }) {

    const todos = useSelector(storeState => storeState.todos)
    const page_size = useSelector(storeState => storeState.page_size)

    function onChangePageIdx(diff) {
        if (filterBy.pageIdx === undefined) return
        if (filterBy.pageIdx + diff < 0) return
        else if (todos.length < page_size) onSetFilterBy({ ...filterBy, pageIdx: 0 })
        else onSetFilterBy({ ...filterBy, pageIdx: filterBy.pageIdx + diff })
    }

    function onTogglePagination() {
        onSetFilterBy({ ...filterBy, pageIdx: filterBy.pageIdx === undefined ? 0 : undefined })
    }

    return (
        <div>
            <section className="pagination">
                <button onClick={() => onChangePageIdx(-1)} className="btn btn-prev">{`←`}</button>
                <button className="btn btn-curr-page">{filterBy.pageIdx + 1 || 'No Pagination'}</button>
                <button onClick={() => onChangePageIdx(1)} className="btn btn-next">{`→`}</button>
            </section>
            <div className="toggle-container">
                <button onClick={onTogglePagination} className="btn btn-toggle">Toggle Pagination</button>
            </div>
        </div>
    )
}