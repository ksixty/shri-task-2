(function(name, ctx, fn) {
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
        if (window === this) {
            return new mobControls()
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
      console.log(data)
      store.general.schools = data.general.schools
      store.general.lecturers = data.general.lecturers
      store.general.venues = data.general.venues
      store.schedule = data.schedule
    }

    const syncWithLocalStorage = () => localStorage.setItem(LOCAL_STORAGE_NAME, JSON.stringify(store))

    mobControls.prototype.serialize = json => {
      const data = localStorage.getItem(LOCAL_STORAGE_NAME)
      console.log(data)
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
      edit: (id, newInfo) => {
        return this
      },
      remove: id => {
        return this
      },
      add: () => {

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
          throw new Error(
            `Lecturer with id ${id} is already here. Please, choose another one.`)
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
            console.log(lecture)
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
      }
    }

    

    return mobControls
})