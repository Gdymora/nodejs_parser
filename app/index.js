var http = require('http');
const fs = require('fs');
let savedData = [];
const osmosis = require('osmosis');
/* 
http.createServer(function (request, response) {
    console.log('Http works!');
}).listen(8080); */


 osmosis
    .get('https://www.google.co.in/search?q=cryptcom')
    //.paginate('#navcnt table tr > td a[href]', 5)
    .delay(500)
    .set({'Title': 'title'})   // альтернатива: `.find('title').set('Title')`
    .set({'related': ['table tr > td a[href]']})
    //set выберет элемент заголовка, представленный в виде css3-селектора.
    .log(console.log) // включить логи
    .error(console.error) // на случай нахождения ошибки 
    .data(function (data) {
        console.log(data);
        savedData.push(data);
    })
    .done(function () {
        fs.writeFile('data.json', JSON.stringify(savedData, null, 4), function (err) {
            if (err) console.error(err);
            else console.log('Data Saved to data.json file');
        })
    }); 