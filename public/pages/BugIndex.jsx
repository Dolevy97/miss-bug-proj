import { bugService } from '../services/bug.service.js'
import { showSuccessMsg, showErrorMsg } from '../services/event-bus.service.js'
import { BugList } from '../cmps/BugList.jsx'
import { BugFilter } from '../cmps/BugFilter.jsx'

const { useState, useEffect } = React
const { Link } = ReactRouterDOM

export function BugIndex() {
    const [bugs, setBugs] = useState(null)
    const [filterBy, setFilterBy] = useState(bugService.getDefaultFilter())
    const [sortDirection, setSortDirection] = useState({ sortByOrder: 1 })
    const [sortBy, setSortBy] = useState({ sortByField: 'createdAt', ...sortDirection })

    useEffect(() => {
        loadBugs()
    }, [filterBy, sortBy])

    function loadBugs() {
        bugService.query(filterBy, sortBy).then(setBugs)
    }

    function onRemoveBug(bugId) {
        bugService
            .remove(bugId)
            .then(() => {
                console.log('Deleted Successfully!')
                const bugsToUpdate = bugs.filter((bug) => bug._id !== bugId)
                setBugs(bugsToUpdate)
                showSuccessMsg('Bug removed')
            })
            .catch((err) => {
                console.log('Error from onRemoveBug ->', err)
                showErrorMsg('Cannot remove bug')
            })
    }

    function onChangePageIdx(diff) {
        if (filterBy.pageIdx === undefined) return
        if (filterBy.pageIdx + diff < 0) return
        else if (bugs.length < 4) setFilterBy(prevFilter => ({ ...prevFilter, pageIdx: 0 }))
        else setFilterBy(prevFilter => ({ ...prevFilter, pageIdx: prevFilter.pageIdx + diff }))
    }

    function toggleSortDirection() {
        setSortDirection(sortDirection.sortByOrder === 1 ? { sortByOrder: -1 } : { sortByOrder: 1 })
    }

    function onSetSort(sort) {
        setSortBy({ ...sort, ...sortDirection })
    }

    function onSetFilter(filter) {
        setFilterBy(prevFilter => ({ ...prevFilter, ...filter }))
    }

    function onTogglePagination() {
        setFilterBy(prevFilter => ({ ...prevFilter, pageIdx: prevFilter.pageIdx === undefined ? 0 : undefined }))
    }

    if (!bugs) return <h3>Loading..</h3>

    function getLabelList() {
        let labels = []
        bugs.map(bug => {
            bug.labels.map(label => {
                if (!labels.includes(label)) labels.push(label)
            })
        })
        return labels
    }

    return (
        <main>
            <section className='info-actions'>
                <h3>Bugs App</h3>
                <button><Link to="/bug/edit">Add Bug</Link></button>
            </section>
            <BugFilter getLabelList={getLabelList} onSetFilter={onSetFilter} filterBy={filterBy} />
            <section className="sorting">
                <h3>Sort by:</h3>
                <div className="sort-container">
                    <button onClick={() => {
                        onSetSort({ sortByField: 'title' })
                        toggleSortDirection()
                    }} className="btn sort-btn">Title</button>
                    <button onClick={() => {
                        onSetSort({ sortByField: 'severity' })
                        toggleSortDirection()
                    }} className="btn sort-btn">Severity</button>
                    <button onClick={() => {
                        onSetSort({ sortByField: 'createdAt' })
                        toggleSortDirection()
                    }} className="btn sort-btn">Time of Creation</button>
                </div>
            </section>
            <section className="pagination">
                <button onClick={() => onChangePageIdx(-1)} className="btn btn-prev">{`←`}</button>
                <button className="btn btn-curr-page">{filterBy.pageIdx + 1 || 'No Pagination'}</button>
                <button onClick={() => onChangePageIdx(1)} className="btn btn-next">{`→`}</button>
            </section>
            <button onClick={onTogglePagination} className="btn-toggle">Toggle Pagination</button>
            <main>
                <BugList bugs={bugs} onRemoveBug={onRemoveBug} />
            </main>
        </main>
    )
}
