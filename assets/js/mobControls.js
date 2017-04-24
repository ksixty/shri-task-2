(function(name, ctx, fn) {
    ctx[name] = fn()
})
('mobControls', this, () => {
    const JSON_LINK = 'https://vanyaklimenko.ru/schedule.json'

    const store = {
        general: {
            schools: {},
            lecturers: {},
            venues: {},
        },
        schedule: {},
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

    mobControls.prototype.serialize = json => {
        const data = localStorage.getItem('mobilization')
        console.log(data)
    }

    mobControls.prototype.deserialize = () => {
      // Chech whether data exists in the local storage
      // In no, fetch data, then put it to the local storage
      return new Promise ((resolve, reject) => {
        let data = localStorage.getItem('mobilization')
        if (data) {
          data = JSON.parse(data)
          bindPropsToStore(data)
          this.deserialized = true
          return resolve(data)
        } else {
          fetchData().then(data => {
            localStorage.setItem('mobilization', JSON.stringify(data))
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
      edit: () => {
        return this
      },
      remove: () => {
        return this
      },
      add: () => {

      }
    }

    mobControls.prototype.lecturers = {
      get: () => store.general.lecturers,
      edit: id => {
        return this
      },
      remove: id => {
        return this
      },
      add: lecture => {
        const { name, time } = lecture
      }
    }

    mobControls.prototype.schedule = {
      get: () => store.schedule,
      edit: () => {

      }
    }

    return mobControls
})