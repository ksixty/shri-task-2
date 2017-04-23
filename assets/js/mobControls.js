(function(name, ctx, fn) {
    ctx[name] = fn()
})
('mobControls', this, () => {
    const JSON_LINK = 'https://vanyaklimenko.ru/schedule.json'

    const store = {
        general: {
            schools: {},
            lecturers: {},
            venue: {},
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
      store.general.schools = data.general.schools
      store.general.lecturers = data.general.lecturers
      store.general.venue = data.general.velue
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

    mobControls.prototype.getData = () => {
      if (!this.deserialized) {
        throw new Error(
          `You can't use (getData) method until 
          the library is not deserialized`
        )
      }

      return store
    }

    mobControls.prototype.venue = {
        get: function () {
            return store.general.venue
        },
        edit: function (id) {
            return this
        },
        remove: function (id) {
            return this
        },
        add: function (venue) {
          const { name } = venue
        }
    }

    mobControls.prototype.schools = {
        get: function () {
            return store.general.schools
        },
        edit: function (id) {
            return this
        },
        remove: function (id) {
            return this
        },
        add: function (school) {

        }
    }

    mobControls.prototype.lecturers = {
        get: function () {
            return store.general.lecturers
        },
        edit: function (id) {
            return this
        },
        remove: function (id) {
            return this
        },
        add: function (lecture) {
          const { name, time } = lecture
        }
    }

    return mobControls
})