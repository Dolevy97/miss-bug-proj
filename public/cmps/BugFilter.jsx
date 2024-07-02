import { utilService } from "../services/util.service.js"
const { useState, useEffect } = React

export function BugFilter({ getLabelList, onSetFilter, filterBy }) {
    const [filterByToEdit, setFilterByToEdit] = useState(filterBy)
    const [labels, setLabels] = useState(getLabelList())

    useEffect(() => {
        onSetFilter(filterByToEdit)
    }, [filterByToEdit])


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
        if (target.type === 'checkbox') {
            if (value) setFilterByToEdit(prevFilter => ({ ...prevFilter, labels: [...prevFilter.labels, field] }))
            else {
                const newLabels = filterByToEdit.labels.filter(label => label !== field)
                setFilterByToEdit(prevFilter => ({ ...prevFilter, labels: newLabels }))
            }
        }
        else setFilterByToEdit(prevFilter => ({ ...prevFilter, [field]: value }))
    }

    const { title, severity } = filterByToEdit

    return (
        <section className="filtering">
            <h3>Filter by:</h3>
            <div className="filter-container">
                <label htmlFor="title"></label>
                <input value={title} id='title' onChange={handleChange} name='title' type="text" placeholder='Title' />
                <label htmlFor="severity"></label>
                <input value={severity || ''} id='severity' onChange={handleChange} name='severity' min={0} max={5} type="number" placeholder='Severity' />
                <div className="labels-container">
                    {labels.map(label =>
                        <section key={label} className="label-container">
                            <label htmlFor={label}>{utilService.toCapitalize(label)}</label>
                            <input value={label} onChange={handleChange} type="checkbox" name={label} id={label} ></input>
                        </section>
                    )}
                </div>
            </div>
        </section>
    )
}