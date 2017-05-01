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
      // If localStorage is empty, fetch data first
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
          `Deserialize the data before using getData() method`
        )
      }

      return store
    }

    mobControls.prototype.venues = {
      get: () => store.general.venues,
      getById: shortName => store.general.venues[shortName],
      update: (shortName, newInfo) => {
        if (!shortName) throw new Error(`Short name of the venue is required [shortName]`)
        if (!newInfo) throw new Error(`New information is required [{shortName, newInfo}]`)

        store.general.venues[shortName] = Object.assign(
          store.general.venues[shortName], newInfo)

        return this
      },
      removeObject: shortName => {
        delete store.general.venues[shortName]
        syncWithLocalStorage()
        return true
      },
      addObject: venue => {
        const { shortName, name, lecturer, capacity } = venue
        if (!shortName) throw new Error(`Short name of the venue is required [shortName]`)
        if (!name) throw new Error(`Name of the venue is required [shortName]`)
        if (!lecturer) throw new Error(`Lecutrer of the venue is required [lecturer]`)
        if (!capacity) throw new Error(`Capacity of the venue is required [capacity]`)

        store.general.venues[shortName] = venue
        syncWithLocalStorage()
        return venue
      }
    }

    mobControls.prototype.schools = {
      get: () => store.general.schools,
      getById: shortName => store.general.schools[shortName],
      update: (shortName, newInfo) => {
        const { name, students } = newInfo
        if (!name || !students) throw new Error('Either a new name of the school or a number of students in the school are required [name||students]')

        store.general.schools[shortName] = Object.assign(
          store.general.schools[shortName], newInfo)
        syncWithLocalStorage()

        return this
      },
      removeObject: shortName => {
        delete store.general.schools[shortName]
        return this
      },
      addObject: school => {
        const { name, students, shortName } = school
        if (!name) throw new Error('Short name for the school is required [shortName]')
        if (!students) throw new Error('Number of students in the school is required [students]')

        store.general.schools[shortName] = {
          name, students
        }
        syncWithLocalStorage()
        return school
      }
    }

    mobControls.prototype.lecturers = {
      get: () => store.general.lecturers,
      update: (id, newInfo) => {
        if (!id) throw new Error(`ID of lecturer is required [id]`)
        const lecturer = store.general.lecturers[id]
        if (!lecturer) {
          throw new Error(`Lecturer with ID "${id}" does not exist`)
        }

        store.general.lecturers[id] = Object.assign(
          store.general.lecturers[id], newInfo
        )
        syncWithLocalStorage()
        return store.general.lecturers[id]
      },
      getById: id => store.general.lecturers[id],
      removeObject: id => {
        delete store.general.lecturers[id]
        syncWithLocalStorage()
        return true
      },
      addObject: lecturer => {
        const { name, id, bio, pic } = lecturer
        if (!name || !id || !pic) {
          throw new Error(`Lecturer’s ID, photo and full name are required [name, id]`)
        }

        if (store.general.lecturers[id]) {
          throw new Error(`Lecturer with ID "${id}" already exists. Please pick another ID.`)
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
      removeObject: id => {
        for (const i in store.schedule) {
          const lecture = store.schedule[i]
          // removing from the object
          if (lecture.id === id) {
            delete store.schedule[i]
            syncWithLocalStorage()
            return true
          }
        }

        return false
      },
      update: (lectureId, newInfo) => {
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
        if (!startNeed) throw new Error('Start time is required [startNeed]')
        // End data is not actually required
        if (!endNeed) endNeed = Date.now() + 999999999999

        if (startNeed > endNeed) {
          throw new Error('Please re-check dates you’ve provided. [startNeed > endNeed]')
        }

        const formattedLectures = {}
        for (const i in store.schedule) {
          const lecture = store.schedule[i]
          const { start, end, id } = lecture

          // if it is correct add the lecture to the list
          if (startNeed >= start && end <= endNeed) {
            formattedLectures[id] = lecture
          }
        }
        
        return formattedLectures
      },
      getByVenue: (venueNeed) => {
        if (!venueNeed) throw new Error('Short name of venue is required [shortName]')

        const formattedLectures = {}
        for (const i in store.schedule) {
          const lecture = store.schedule[i]
          const { venue, id } = lecture

          if (venue === venueNeed) {
            formattedLectures[id] = lecture
          }
        }
        
        return formattedLectures
      },
      addObject: lecture => {
        const { start, end, name, pic, school, venue } = lecture
        if (!start) throw new Error('Start time of the lecture is required [start]')
        if (!end) throw new Error('Dnd time of the lecture is required [end]')
        if (!name) throw new Error('Name of the lecture is required [name]')


        if (!school) throw new Error('Name of the school is required [school]')
        if (!store.general.schools[school]) throw new Error(`School "${school}"" does not exist.`)

        if (!venue) throw new Error('Venue of the lecture is required [venue]')
        if (!store.general.venues[venue]) throw new Error(`Venue "${venue}" does not exist.`)


        if (start > end) {
          throw new Error('Provided start time is higher than end time. [start > end]')
        }

        // check if provided data makes sense
        let maxId = 0
        for (const i in store.schedule) {
          const lecture = store.schedule[i]
          const _id = lecture.id
          const _start = lecture.start
          const _school = lecture.school
          const _venue = lecture.venue

          // 1. Для одной школы не может быть двух лекций одновременно.
          if (_school === school && start === _start) {
            throw new Error(`Another lecture is scheduled at provided time already.`)
          }

          // 2. В одной аудитории не может быть одновременно двух разных лекций.
          if (_venue === venue && start === _start) {
            throw new Error(`Another lecture is scheduled in this venue already`)
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