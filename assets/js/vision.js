
// const el = document.querySelector('.entry__field--name')
// el.addEventListener('focus', () => {
// 	el.parentElement.style.height = 'auto'
// })

// el.addEventListener('unfocus', () => {
// 	el.parentElement.style.height = '42px'
// })

const api = mobControls()

api.deserialize().then(function () {
	Vue.component('lecturers', {
		data: function () {
			return {
				lecturers: api.lecturers.get()
			}
		},
		template: `
			<select class="entry__field entry__field--lecturer">
				<option v-for="lecturer of lecturers">{{lecturer.name}}</option>
			</select>
		`
	})

	Vue.component('venues', {
		data: function () {
			console.log(api.venues.get())
			return {
				venues: api.venues.get()
			}
		},
		template: `
			<select class="entry__field entry__field--venue">
				<option>{{venue.}}</option>
			</select>
		`
	})

	const Lectures = new Vue({
		el: '#lectures',
		data: function () {
			return {
				lecturers: api.lecturers.get(),
				schools: api.schools.get()
			}
		},
		template: `
			<div>
				<lecturers></lecturers>
			</div>
		`,
		methods: {
			toggle: function (e) {
				console.log(e)
				console.log('focus')
			}
		}
	})

	const Lecture = new Vue({
		template: `
			<form class="editor__entry entry">
				<input class="entry__field entry__field--name" placeholder="Название"
					@focus='toggle(e)'
					@blur='toggle(e)'
				>
				<input class="entry__field entry__field--pic" placeholder="Ссылка на картинку">
				<select class="entry__field entry__field--lecturer">
					<option>Сергей Душкин</option>
				</select>
				<select class="entry__field entry__field--venue">
					<option>Синий кит, 4 этаж</option>
				</select>
				<input class="entry__field entry__field--date" type="date" name="" placeholder="0">
				<input class="entry__field entry__field--time" type="time" name="" placeholder="0">
				<button class="entry__submit-button">Сохранить</button>
			</form>
		`
	})
})
