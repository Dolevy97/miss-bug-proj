import { bugService } from "../services/bug.service.js"
import { showSuccessMsg, showErrorMsg } from '../services/event-bus.service.js'

const { useNavigate, useParams } = ReactRouterDOM

const { useState, useEffect } = React

export function BugEdit() {

    const [bugToEdit, setBugToEdit] = useState(bugService.getEmptyBug())
    const navigate = useNavigate()
    const { bugId } = useParams()

    useEffect(() => {
        if (bugId) loadBug()
    }, [])

    function loadBug() {
        bugService.getById(bugId)
            .then(setBugToEdit)
            .catch(err => console.log('err:', err))
    }

    function onSaveBug(ev) {
        ev.preventDefault()
        console.log(bugToEdit);
        if (typeof bugToEdit.labels === 'string') bugToEdit.labels = bugToEdit.labels.split(',')
        bugService.save(bugToEdit)
            .then(() => {
                navigate('/bug')
                showSuccessMsg(`Bug saved successfully!`)
            })
            .catch(err => console.log('err:', err))
    }



    //     if (value) setFilterByToEdit(prevFilter => ({ ...prevFilter, labels: [...prevFilter.labels, field] }))
    //     else {
    //         const newLabels = filterByToEdit.labels.filter(label => label !== field)
    //         setFilterByToEdit(prevFilter => ({ ...prevFilter, labels: newLabels }))


    function handleChange({ target }) {
        const field = target.name
        let value = target.value

        switch (target.type) {
            case 'number':
            case 'range':
                value = +value
                break;

            case 'checkbox':
                value = target.checked
                break

            default:
                break;
        }
        setBugToEdit(prevBug => ({ ...prevBug, [field]: value }))
    }


    const { title, severity, description, labels } = bugToEdit
    return (
        <section className="bug-edit">
            <h1>{bugId ? 'Edit' : 'Add'} Bug</h1>
            <form onSubmit={onSaveBug}>
                <section className="input-container">
                    <label htmlFor="title">Title:</label>
                    <input onChange={handleChange} value={title} type="text" name="title" id="vendor" />

                    <label htmlFor="description">Description:</label>
                    <input onChange={handleChange} value={description} type="text" name="description" id="description" />

                    <label htmlFor="labels">Labels:</label>
                    <input onChange={handleChange} value={labels} type="text" name="labels" id="labels" placeholder="Enter labels (Separated by commas)" />

                    <label htmlFor="severity">Severity:</label>
                    <input onChange={handleChange} value={severity} type="number" name="severity" id="severity" />

                </section>
                <button>Save</button>
            </form>

        </section>
    )

}