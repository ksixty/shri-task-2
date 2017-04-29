(function(name, ctx, fn) {

  if (typeof module !== 'undefined') {
    module.exports = fn()
    return false
  }

  ctx[name] = fn()
})
('mobControls', this, () => {
    const JSON_LINK = 'https://vanyaklimenko.ru/schedule.json'
    const LOCAL_STORAGE_NAME = 'mobilization'

    const store = {
      general: {
        schools: {},
        lecturers: {},
        venues: {},
      },
      schedule: {}
    }

    function mobControls () {
      if (typeof window !== 'undefined') {
        if (window === this) {
          return new mobControls()
        }
      }

      this.deserialized = false
      return this
    }

    const fetchData = () => {
      return new Promise((resolve, reject) => {
        fetch(JSON_LINK).then(r => r.json())
        .then(r => resolve(r))
        .catch(e => reject(e))
      })
    }

    const bindPropsToStore = data => {
      store.general.schools = data.general.schools
      store.general.lecturers = data.general.lecturers
      store.general.venues = data.general.venues
      store.schedule = data.schedule
    }

    const syncWithLocalStorage = () => localStorage.setItem(LOCAL_STORAGE_NAME, JSON.stringify(store))

    mobControls.prototype.serialize = json => {
      const data = localStorage.getItem(LOCAL_STORAGE_NAME)
    }

    mobControls.prototype.deserialize = () => {
      // Chech whether data exists in the local storage
      // In no, fetch data, then put it to the local storage
      return new Promise ((resolve, reject) => {
        let data = localStorage.getItem(LOCAL_STORAGE_NAME)
        if (data) {
          data = JSON.parse(data)
          bindPropsToStore(data)
          this.deserialized = true
          return resolve(data)
        } else {
          fetchData().then(data => {
            localStorage.setItem(LOCAL_STORAGE_NAME, JSON.stringify(data))
            bindPropsToStore(data)
            this.deserialized = true
            return resolve(data)
          }).catch(e => {
            return reject()
          })
        }
      })
    }

    mobControls.prototype.clearCache = () => localStorage.removeItem('mobilization')

    mobControls.prototype.getData = () => {
      if (!this.deserialized) {
        throw new Error(
          `You can't use (getData) method until 
          the library is not deserialized`
        )
      }

      return store
    }

    mobControls.prototype.venues = {
      get: () => store.general.venues,
      edit: id => {
        return this
      },
      remove: id => {
        return this
      },
      add: venue => {
        const { name } = venue
      }
    }

    mobControls.prototype.schools = {
      get: () => store.general.schools,
      getById: shortName => store.general.schools[shortName],
      edit: (shortName, newInfo) => {
        const { name, students } = newInfo
        if (!name || !students) throw new Error('Please provide either name of the school or students')

        store.general.schools[shortName] = Object.assign(
          store.general.schools[shortName], newInfo)
        syncWithLocalStorage()

        return this
      },
      remove: shortName => {
        delete store.general.schools[shortName]
        return this
      },
      add: school => {
        const { name, students, shortName } = school
        if (!name) throw new Error('Name of the school is not provided [name]')
        if (!students) throw new Error('Please provide how many students are there in that school')

        store.general.schools[shortName] = {
          name, students
        }
        syncWithLocalStorage()
        return school
      }
    }

    mobControls.prototype.lecturers = {
      get: () => store.general.lecturers,
      edit: (id, newInfo) => {
        if (!id) throw new Error(`No lecturer's id provided`)
        const lecturer = store.general.lecturers[id]
        if (!lecturer) {
          throw new Error(`No lecturer with id ${id}`)
        }

        store.general.lecturers[id] = Object.assign(
          store.general.lecturers[id], newInfo
        )
        syncWithLocalStorage()
        return store.general.lecturers[id]
      },
      getById: id => store.general.lecturers[id],
      remove: id => {
        delete store.general.lecturers[id]
        syncWithLocalStorage()
        return true
      },
      add: lecturer => {
        const { name, id, bio } = lecturer
        if (!name || !id) {
          throw new Error(`Please provide lecturer's ID and full name`)
        }

        if (store.general.lecturers[id]) {
          throw new Error(`Lecturer with id ${id} is already here. Please, choose another one.`)
        }

        store.general.lecturers[id] = lecturer
        syncWithLocalStorage()

        return lecturer
      }
    }

    mobControls.prototype.schedule = {
      get: () => store.schedule,
      getById: () => {
        for (const i in store.schedule) {
          const lecture = store.schedule[i]
          if (lecture.id === id) {
            return lecture
          }
        }

        return undefined
      },
      remove: id => {
        for (const i in store.schedule) {
          const lecture = store.schedule[i]
          // this one we need to remove from the object
          if (lecture.id === id) {
            delete store.schedule[i]
            syncWithLocalStorage()
            return true
          }
        }

        return false
      },
      edit: (lectureId, newInfo) => {
        for (const i in store.schedule) {
          const lecture = store.schedule[i]
          if (lecture.id === lectureId) {
            store.schedule[i] = Object.assign(store.schedule[i], newInfo)
            syncWithLocalStorage()
            return store.schedule[i]
          }
        }

        return false
      },
      getByDate: (startNeed, endNeed) => {
        if (!startNeed) throw new Error('Start date should be provided')
        // End data is not such important here
        if (!endNeed) endNeed = Date.now() + 999999999999

        if (startNeed > endNeed) {
          throw new Error('Start time cant be more than end time')
        }

        const formattedLectures = {}
        for (const i in store.schedule) {
          const lecture = store.schedule[i]
          const { start, end, id } = lecture

          // if its right add the lecture to the list
          if (startNeed >= start && end <= endNeed) {
            formattedLectures[id] = lecture
          }
        }
        
        return formattedLectures
      },
      addLecture: lecture => {
        const { start, end, name, pic, school, venue } = lecture
        if (!start) throw new Error('Please provide when the lecture starts [start]')
        if (!end) throw new Error('Please provide when the lecture ends [end]')
        if (!name) throw new Error('Please provide the name of the lecture [name]')


        if (!school) throw new Error('Please provide the name of the school [school]')
        if (!store.general.schools[school]) throw new Error(`There is not such school [${school}]. Please, choose onother one.`)

        if (!venue) throw new Error('Please provide where the lectere will be shown [venue]')
        if (!store.general.venues[venue]) throw new Error(`There is no such venue [${venue}]. Please choose another one`)


        if (start > end) {
          throw new Error('[start] time cant be more, than [end] time')
        }

        // getting max current id
        let maxId = 0
        for (const i in store.schedule) {
          const lecture = store.schedule[i]
          const _id = lecture.id
          const _start = lecture.start
          const _school = lecture.school
          const _venue = lecture.venue

          // 1. Для одной школы не может быть двух лекций одновременно.
          if (_school === school && start === _start) {
            throw new Error(`There is already a lecture at that moment.
              Could you please choose another time?`)
          }

          // 2. В одной аудитории не может быть одновременно двух разных лекций.
          if (_venue === venue && start === _start) {
            throw new Error(`There is already another lecture in that venue.
              Could you please choose another venue?`)
          }

          if (_id > maxId) maxId = _id
        }

        // 3. Вместимость аудитории должна быть больше или равной количеству студентов на лекции.
        const studentsAmount = store.general.schools[school].students
        const capacity = store.general.venues[venue].capacity

        store.schedule[maxId] = lecture
        syncWithLocalStorage()

        return lecture
      }
    }

    

    return mobControls
})