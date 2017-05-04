# Задание 2  ·  ШРИ-2017
Библиотека для взаимодействия с расписанием «Мобилизации» из [первого задания](http://github.com/vanya-klimenko/shri-task-1). Она умеет:
1. Создавать/добавлять/редактировать школы, аудитории и лекции.
2. Показывать расписание аудитории; расписание за определенный период
3. Не давать вводить бессмысленные данные — например, нельзя создать две лекции в одной аудитории одновременно
4. Использовать localStorage, чтобы не забывать про сделанные изменения  
  
Кроме того, было реализовано [простейшее приложение](http://vanyaklimenko.ru/shri-task-2/test.html), использующее библиотеку для фильтрации и удаления данных.

## Использование
Чтобы библиотека работала, подключите её на страницу и вызовите метод `mobControls().getData()`, чтобы получить какие-то данные для работы. Ниже приведён список методов библиотеки для работы с этими данными.

### Данные, хранилище


```javascript
mobcontrols().deserialize()
```
Десериализует данные из localStorage и кладёт их в хранилище `store`.
<br><br>
```javascript
mobcontrols().clearCache()
```
Очищает кеш.
<br><br>
```javascript
mobcontrols().getData()
```
Возвращает все данные.
<br><br>



### Аудитории
Возможная информация:
- Краткий ID, `shortName`
- Полное название, `name`
- Вместимость, `capacity`
- ID лектора, `lecturer`
<br><br>
```javascript
mobcontrols().venues.get()
```
Возвращает все аудитории.
<br><br>
```javascript
mobcontrols().venues.getById(shortName)
```
Возвращает аудиторию.
<br><br>
```javascript
mobcontrols().venues.update(shortName, {shortName, name, lecturer, capacity})
```
Изменяет данные об аудитории на новые. Все поля передавать необязательно.
<br><br>

```javascript
mobcontrols().venue.removeObject(shortName)
```
Удаляет аудиторию.
<br><br>
```javascript
mobcontrols().venue.addObject({shortName, name, lecturer, capacity})
```
Добаввляет аудиторию. Все поля обязательны.
<br><br>



### Школы
Возможная информация:
- Краткий ID, `shortName`
- Полное название, `name`
- Число студентов, `students`
<br><br>
```javascript
mobcontrols().schools.get()
```
Возвращает все школы.
<br><br>
```javascript
mobcontrols().schools.getById(shortName)
```
Возвращает школу.
<br><br>
```javascript
mobcontrols().schools.update(shortName, {name, students})
```
Изменяет данные о школе на новые. Все поля передавать необязательно.
<br><br>
```javascript
mobcontrols().schools.removeObject(shortName)
```
Удаляет школу.
<br><br>
```javascript
mobcontrols().schools.addObject({name, students, shortName})
```
Добаввляет школу. Все поля обязательны.
<br><br>



### Лекторы 
Возможная информация:
- Краткий ID, `id`
- Полное имя, `name`
- URL фотографии, `pic`
- Полное имя, `bio`
<br><br>
```javascript
mobcontrols().lecturers.get()
```
Возвращает всех лекторов.
<br><br>
```javascript
mobcontrols().lecturers.getById(shortName)
```
Возвращает лектора.
<br><br>
```javascript
mobcontrols().lecturers.update(shortName, {id, name, pic, bio})
```
Изменяет данные о лекторе на новые. Все поля передавать необязательно.
<br><br>
```javascript
mobcontrols().lecturers.removeObject(shortName)
```
Удаляет лектора.
<br><br>
```javascript
mobcontrols().lecturers.addObject({id, name, pic, bio})
```
Добаввляет лектора. Все поля обязательны, кроме `bio`.
<br><br>


### Лекции
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
mobcontrols().schedule.get()
```
Возвращает все лекции.
<br><br>
```javascript
mobcontrols().schedule.getById(shortName)
```
Возвращает лекцию.
<br><br>
```javascript
mobcontrols().schedule.update(shortName, {start, end, name, pic, school, venue})
```
Изменяет данные о лекции на новые. Все поля передавать необязательно.
<br><br>
```javascript
mobcontrols().schedule.removeObject(shortName)
```
Удаляет лекцию.
<br><br>
```javascript
mobcontrols().schedule.addObject({start, end, name, pic, school, venue})
```
Добаввляет лекцию. Все поля обязательны, кроме `bio`.
<br><br>
```javascript
mobcontrols().getByVenue(venueNeed)
```
Возвращает расписание лекций в указанной аудитории.
<br><br>
```javascript
mobcontrols().getByDate(startNeed, endNeed)
```
Возвращает расписание лекций за период от `startNeed` до `endNeed`.
