const BASE_URL = '/api/bug/'

export const bugService = {
    query,
    getById,
    save,
    remove,
    getDefaultFilter,
    getEmptyBug
}

function query(filterBy = {}, sortBy = {}) {
    const filterAndSort = {
        ...filterBy,
        ...sortBy
    }
    return axios.get(BASE_URL, { params: filterAndSort })
        .then(res => res.data)
}

function getById(bugId) {
    return axios.get(BASE_URL + bugId)
        .then(res => res.data)
}

function remove(bugId) {
    return axios.delete(BASE_URL + bugId)
        .then(res => res.data)
}

function save(bug) {
    const method = bug._id ? 'put' : 'post'
    return axios[method](BASE_URL, bug).then(res => res.data)
}

function getDefaultFilter() {
    return { title: '', severity: '', labels: [] }
}

function getEmptyBug(title = '', severity = '', description = '', labels = []) {
    return { title, severity, description, labels }
}