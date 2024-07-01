const BASE_URL = '/api/bug/'

export const bugService = {
    query,
    getById,
    save,
    remove,
    getDefaultFilter,
}

function query(filterBy = {}) {
    return axios.get(BASE_URL, { params: filterBy })
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
    return { title: '', severity: '', pageIdx: 0 }
}


// function _createBugs() {
//     let bugs = utilService.loadFromStorage(STORAGE_KEY)
//     if (!bugs || !bugs.length) {
//         bugs = [
//             {
//                 "_id": "1NF1N1T3",
//                 "title": "Infinite Loop Detected",
//                 "description": "The system has detected an infinite loop in the code, which may cause the program to hang or crash.",
//                 "severity": 4,
//                 "labels": ["bug", "critical", "performance"]
//             },
//             {
//                 "_id": "K3YB0RD",
//                 "title": "Keyboard Not Found",
//                 "description": "The keyboard is not detected by the system. This may be due to a hardware issue or a disconnected cable.",
//                 "severity": 3,
//                 "labels": ["hardware", "input device", "error"]
//             },
//             {
//                 "_id": "C0FF33",
//                 "title": "404 Coffee Not Found",
//                 "description": "The coffee machine is out of coffee or unable to locate the coffee supply. Immediate caffeine fix required.",
//                 "severity": 2,
//                 "labels": ["hardware", "refreshment", "minor"]
//             },
//             {
//                 "_id": "G0053",
//                 "title": "Unexpected Response",
//                 "description": "The system received an unexpected response from the server or an external service.",
//                 "severity": 1,
//                 "labels": ["network", "communication", "warning"]
//             }
//         ]

//         utilService.saveToStorage(STORAGE_KEY, bugs)
//     }
// }