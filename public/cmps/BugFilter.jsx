const { useState, useEffect } = React

export function BugFilter({ setFilterBy, filterBy }) {

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

    const { title, severity, labels } = filterBy

    return (
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
    )
}