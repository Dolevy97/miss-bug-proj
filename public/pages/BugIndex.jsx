import { bugService } from '../services/bug.service.js'
import { showSuccessMsg, showErrorMsg } from '../services/event-bus.service.js'
import { BugList } from '../cmps/BugList.jsx'

const { useState, useEffect } = React

export function BugIndex() {
    const [bugs, setBugs] = useState(null)
    const [filterBy, setFilterBy] = useState(bugService.getDefaultFilter())

    useEffect(() => {
        loadBugs()
    }, [filterBy])

    function loadBugs() {
        bugService.query(filterBy).then(setBugs)
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

    function onAddBug() {
        const bug = {
            title: prompt('Bug title?'),
            severity: +prompt('Bug severity?'),
            description: prompt('Bug Description?')
        }
        bugService
            .save(bug)
            .then((savedBug) => {
                setBugs([...bugs, savedBug])
                showSuccessMsg('Bug added')
            })
            .catch((err) => {
                console.log('Error from onAddBug ->', err)
                showErrorMsg('Cannot add bug')
            })
    }

    function onEditBug(bug) {
        const title = prompt('New Title?', bug.title)
        const description = prompt('New Description?', bug.description)
        const severity = +prompt('New severity?', bug.severity)

        const bugToSave = { ...bug, severity, description, title }
        bugService
            .save(bugToSave)
            .then((savedBug) => {
                const bugsToUpdate = bugs.map((currBug) =>
                    currBug._id === savedBug._id ? savedBug : currBug
                )
                setBugs(bugsToUpdate)
                showSuccessMsg('Bug updated')
            })
            .catch((err) => {
                console.log('Error from onEditBug ->', err)
                showErrorMsg('Cannot update bug')
            })
    }

    function handleChange({ target }) {
        const field = target.name
        let value = target.value
        switch (target.type) {
            case 'number':
            case 'range':
                value = +value
                if (value > 5) value = 5
                else if (value < 0) value = 0
                break;

            case 'checkbox':
                value = target.checked
                break;

            case 'radio':
                value = target.id
                break;
            case 'select':
                value = target.selected
            default:
                break;
        }
        setFilterBy(filter => ({ ...filter, [field]: value }))
    }

    function onChangePageIdx(diff) {
        if (filterBy.pageIdx + diff < 0) return
        else if (bugs.length < 4) setFilterBy(prevFilter => ({ ...prevFilter, pageIdx: 0 }))
        else setFilterBy(prevFilter => ({ ...prevFilter, pageIdx: prevFilter.pageIdx + diff }))
    }

    const { title, severity, pageIdx, labels } = filterBy

    return (
        <main>
            <section className='info-actions'>
                <h3>Bugs App</h3>
                <button onClick={onAddBug}>Add Bug ⛐</button>
            </section>
            <section className="filtering">
                <h3>Filter by:</h3>
                <div className="filter-container">
                    <label htmlFor="title"></label>
                    <input value={title} id='title' onChange={handleChange} name='title' type="text" placeholder='Title' />
                    <label htmlFor="severity"></label>
                    <input value={severity || ''} id='severity' onChange={handleChange} name='severity' min={0} max={5} type="number" placeholder='Severity' />
                    <label htmlFor="labels"></label>
                    <input value={labels} id='labels' onChange={handleChange} name='labels' type="text" placeholder='Label' />
                </div>
            </section>
            <section className="sorting">

            </section>
            <main>
                <BugList bugs={bugs} onRemoveBug={onRemoveBug} onEditBug={onEditBug} />
            </main>
            <section className="pagination">
                <button onClick={() => onChangePageIdx(-1)} className="btn btn-prev">{`←`}</button>
                <button className="btn btn-curr-page">{pageIdx + 1}</button>
                <button onClick={() => onChangePageIdx(1)} className="btn btn-next">{`→`}</button>
            </section>
        </main>
    )
}
