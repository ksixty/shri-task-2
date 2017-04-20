const SCHEDULE_LINK = 'https://vanyaklimenko.ru/schedule.json'
const SCHEDULE_DOM = document.querySelector('#schedule')

const redux = {
    general: {
        schools: {},
        lecturers: {}
    },
    schedule: {}
}

const fetchSchedule = () => {
    return new Promise((resolve, reject) => {
        fetch(SCHEDULE_LINK)
            .then(r => r.json())
            .then(r => resolve(r))
            .catch(e => reject(e))
        })
}

fetchSchedule().then(json => {
    const { schedule, general } = json
    console.log(json)

    redux.general.schools = general.schools
    redux.general.lecturers = general.lecturers

    redux.schedule = schedule

    renderLectures()
})

const renderLectures = () => {
    const lectures = redux.schedule
    if (!lectures) return false
    for (const lectureIndex in lectures) {
        const lecture = lectures[lectureIndex]
        renderLecture(lecture)
    }
}

const selectMonth = time => {
    if (!time) return false
    const months = [
        'январь', 'февраль', 'март', 'апрель',
        'май', 'июнь', 'июль', 'август', 'сентябрь'
    ]
    return months[time.getMonth()] || false
}

const getLecturer = _lecturer => {
    const { lecturers } = redux.general
    const lecturer = lecturers[_lecturer]
    return {
        name: lecturer.name,
        company: lecturer.company || 'Яндекс',
        bio: lecturer.bio
    }
}

const getSchool = school => {
    const { schools } = redux.general
    
    if (!school) return schools.all
    return schools[school]
}

const renderLecture = lecture => {
    const { school, name, lecturer, pic, date, venue } = lecture
    console.log(lecture)
    const domLecture = document.createElement('div')

    const _lecturer = getLecturer(lecturer)

    domLecture.innerHTML = 
    `
        <div class="schedule__event event">
            <div class="event__header event__header--${school || 'all'}">
            <div class="event__school">${getSchool(school)}</div>
            </div>
            <img class="event__pic" src="${pic}">
            <div class="event__title">
            <div class="event__date">16</div>
            <div class="event__name">${name}</div>
            </div>
            <div class="event__meta meta">
            <div class="meta__item meta__item--lecturer">${_lecturer.name}</div>
            <div class="meta__item meta__item--company">${_lecturer.company}</div>
            <div class="meta__item meta__item--place">${venue}</div>
            </div>
        </div>
    `
    SCHEDULE_DOM.appendChild(domLecture)
}
