const api = mobControls()
console.log(api)

// api.clearCache()

api.deserialize().then(function () {
  Vue.component('lecturers', {
    data: function () {
      return {
        lecturers: api.lecturers.get()
      }
    },
    template: `
      <select class="entry__field entry__field--lecturer">
        <option v-for="lecturer of lecturers"
          selected="lecturer.name='123'"
          value="lecturer.name"
        >
          {{lecturer.name}}
        </option>
      </select>
    `,
    props: {
      currentLecturer: String
    }
  })

  Vue.component('venues', {
    data: function () {
      console.log(api.venues.get())
      console.log('test')
      return {
        venues: api.venues.get()
      }
    },
    template: `
      <select class="entry__field entry__field--venue">
        <option v-for="venue of venues"
          value="venue.name"
          selected="true"
          >
          {{venue.name}}
        </option>
      </select>
    `
  })

  Vue.component('lecture', {
    data: function () {
      return {
        isOpened: false
      }
    },
    template: `
      <form class="editor__entry entry">
        <input class="entry__field entry__field--name" :placeholder="name"
          @click='toggle()'
        >
        <div v-show='isOpened'>
          <lecturers></lecturers>
          <venues></venues>
          <input class="entry__field entry__field--pic" placeholder="Ссылка на картинку">
          <input class="entry__field entry__field--date" type="date" name="" placeholder="0">
          <input class="entry__field entry__field--time" type="time" name="" placeholder="0">
          <button class="entry__submit-button" @click='save'>Сохранить</button>
        </div>
      </form>
    `,
    props: {
      name: String
    },
    methods: {
      toggle: function () {
        this.isOpened = !this.isOpened
        console.log(this.isOpened)
      },
      save: function (e) {
        e.preventDefault()
      }
    }
  })

  const Lectures = new Vue({
    el: '#lectures',
    data: function () {
      console.log(api.schedule.get())
      return {
        lecturers: api.lecturers.get(),
        schools: api.schools.get(),
        schedule: api.schedule.get()
      }
    },
    template: `
      <div>
        <div v-for="lecture of schedule">
          <lecture
            :name='lecture.name'
          ></lecture>
        </div>
      </div>
    `,
    methods: {
      toggle: function (e) {
        console.log(e)
        console.log('focus')
      }
    }
  })
})
