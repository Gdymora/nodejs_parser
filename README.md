# crypt_exp
Парсинг сайтов при помощи Node.js c использованием написанного для Node.js программного пакета osmosis (https://rchipka.github.io/node-osmosis/global.html), включающего селектор css3/xpath и небольшой http-обработчик
Парсим информативный заголовок в Google
Это самый базовый пример, с помощью которого мы познакомимся с пакетом и запустим первый Node-скрипт. Помещаем код ниже в файл index.js и запускаем из консоли команду npm start. Она выведет заголовок веб-страницы:

const osmosis = require('osmosis');
osmosis
    .get('www.google.com')
    .set({'Title': 'title'})   // альтернатива: `.find('title').set('Title')`
    .data(console.log)  // выведет {'Title': 'Google'}
Разберём, что делают методы. Первый метод get получает веб-страницу в сжатом формате. Следующий метод set выберет элемент заголовка, представленный в виде css3-селектора. Наконец, метод data с console.log обеспечивают вывод. Метод set также принимает строки в качестве аргумента.

Получаем релевантные результаты в Google
Допустим, мы хотим получить результаты по ключевому слову analytics. Делаем следующее:

osmosis
    .get('https://www.google.co.in/search?q=analytics')
    .find('#botstuff')
    .set({'related': ['.card-section .brs_col p a']})
    .data(function(data) {
        console.log(data);
    })
Вот и всё. Этот код извлечёт все соответствующие ключевые слова с первой страницы результатов поиска, поместит их в массив и запишет в лог в консоли. Логика, стоящая за этим, такова: мы сначала анализируем веб-страницу через инструменты разработчика, проверяем блок, в котором находится слово (в данном случае это div #botstuff), и сохраняем его в массив через селектор .card-section .brs_col p a, который найдёт все соответствующие ключевые слова на странице.

Увеличиваем количество страниц при релевантном поиске
Для этого нужно добавить цепочку вызовов (chaining method), вычислив атрибут href у тега anchor (<a>). Мы ограничимся пятью страницами, чтобы Google не посчитал нас за бот. Если необходимо выставить время между парсингом соседних страниц, добавляем метод .delay(ms) после каждого .paginate().

osmosis
   .get('https://www.google.co.in/search?q=analytics')
   .paginate('#navcnt table tr > td a[href]', 5)
   .find('#botstuff')
   .set({'related': ['.card-section .brs_col p a']})
   .data(console.log)
   .log(console.log) // включить логи
   .error(console.error) // на случай нахождения ошибки
Парсим адреса электронной почты с сайта Shopify
В данном случае мы будем собирать email-адреса и названия всех приложений, последовательно перемещаясь с помощью метода .follow, и потом помечать необходимые селекторы в консоли разработчика:

osmosis
   .get('http://apps.shopify.com/categories/sales')
   .find('.resourcescontent ul.app-card-grid')
   .follow('li a[href]')
   .find('.resourcescontent')
   .set({
       'appname': '.app-header__details h1',
       'email': '#AppInfo table tbody tr:nth-child(2) td > a'
    })
   .log(console.log)   // включить логи
   .data(console.log)
Код выше можно скомбинировать с методом .paginate, чтобы собрать полностью весь контент (но при этом нас могут и заблокировать).

Теперь нужно сохранить данные в файле, сделать это можно так (пример модификации кода выше, сохранение в формате json):

const fs = require('fs');
let savedData = [];
osmosis
   .get(..).find(..).follow(..).find(..)
   .set(..)
   .log(console.log)
   .data(function(data) {
      console.log(data);
      savedData.push(data);
   })
   .done(function() {
      fs.writeFile('data.json', JSON.stringify( savedData, null, 4), function(err) {
        if(err) console.error(err);
        else console.log('Data Saved to data.json file');
      })
   });
