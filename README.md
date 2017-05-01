# Задание 2  ·  ШРИ-2017
Библиотека для взаимодействия с расписанием «Мобилизации» из [первого задания](http://github.com/vanya-klimenko/shri-task-1). Она умеет:
1. Создавать/добавлять/редактировать школы, аудитории и лекции.
2. Отбирать лекции школы или лекции аудитории по датам
3. Не давать вводить бессмысленные данные — например, нельзя создать две лекции в одной аудитории одновременно
4. Использовать localStorage, чтобы не забывать про сделанные изменения



## Данные, хранилище


```javascript
serialize(json)
```
Сериализует данные из localStorage и возвращает объект.
<br><br>
```javascript
deserialize()
```
Десериализует данные из JSON и кладёт их в localStorage.
<br><br>
```javascript
clearCache()
```
Очищает кеш.
<br><br>
```javascript
getData()
```
Возвращает все данные.
<br><br>



## Аудитории
Возможная информация:
- Краткий ID, `shortName`
- Полное название, `name`
- Вместимость, `capacity`
- ID лектора, `lecturer`
<br><br>
```javascript
venues.get
```
Возвращает все аудитории.
<br><br>
```javascript
venues.getById(shortName)
```
Возвращает аудиторию.
<br><br>
```javascript
venues.update(shortName, {shortName, name, lecturer, capacity})
```
Изменяет данные об аудитории на новые. Все поля передавать необязательно.
<br><br>

```javascript
venue.removeObject(shortName)
```
Удаляет аудиторию.
<br><br>
```javascript
venue.addObject({shortName, name, lecturer, capacity})
```
Добаввляет аудиторию. Все поля обязательны.
<br><br>



## Школы
Возможная информация:
- Краткий ID, `shortName`
- Полное название, `name`
- Число студентов, `students`
<br><br>
```javascript
schools.get
```
Возвращает все школы.
<br><br>
```javascript
schools.getById(shortName)
```
Возвращает школу.
<br><br>
```javascript
schools.update(shortName, {name, students})
```
Изменяет данные о школе на новые. Все поля передавать необязательно.
<br><br>
```javascript
schools.removeObject(shortName)
```
Удаляет школу.
<br><br>
```javascript
schools.addObject({name, students, shortName})
```
Добаввляет школу. Все поля обязательны.
<br><br>



## Лекторы 
Возможная информация:
- Краткий ID, `id`
- Полное имя, `name`
- URL фотографии, `pic`
- Полное имя, `bio`
<br><br>
```javascript
lecturers.get
```
Возвращает всех лекторов.
<br><br>
```javascript
lecturers.getById(shortName)
```
Возвращает лектора.
<br><br>
```javascript
lecturers.update(shortName, {id, name, pic, bio})
```
Изменяет данные о лекторе на новые. Все поля передавать необязательно.
<br><br>
```javascript
lecturers.removeObject(shortName)
```
Удаляет лектора.
<br><br>
```javascript
lecturers.addObject({id, name, pic, bio})
```
Добаввляет лектора. Все поля обязательны, кроме `bio`.
<br><br>


## Лекции
Возможная информация:
- Краткий ID, `lectureId`
- Полное имя, `name`
- Таймштамп начала, `start`
- Таймштамп конца, `end`
- URL картинки, `pic`
- ID школы, `school`
- ID аудитории, `venue`
<br><br>
```javascript
schedule.get
```
Возвращает все лекции.
<br><br>
```javascript
schedule.getById(shortName)
```
Возвращает лекцию.
<br><br>
```javascript
schedule.update(shortName, {start, end, name, pic, school, venue})
```
Изменяет данные о лекции на новые. Все поля передавать необязательно.
<br><br>
```javascript
schedule.removeObject(shortName)
```
Удаляет лекцию.
<br><br>
```javascript
schedule.addObject({start, end, name, pic, school, venue})
```
Добаввляет лекцию. Все поля обязательны, кроме `bio`.
<br><br>
```javascript
getByVenue(venueNeed)
```
Возвращает расписание лекций в указанной аудитории.
<br><br>
```javascript
getByDate(startNeed, endNeed)
```
Возвращает расписание лекций за период от `startNeed` до `endNeed`.