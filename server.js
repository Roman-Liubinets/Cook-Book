//Підключаємо бібліотеки
const express = require('express');
const bodyParser = require('body-parser');
const app = express();
const port = 8000;
const mysql = require('mysql');
const fs = require('fs');
const multer = require('multer');
var storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, 'public/img/')
    },
    filename: function (req, file, cb) {
        cb(null, file.fieldname);
    }
});

var upload = multer({
    storage: storage
});

//Підключаємо скрипт читання/запису у текстовий файл
require('./js/about-item');
require('./js/about-ingrd');


//Клієнтська частина сайту знаходитиметься у папці public
app.use(express.static(__dirname + '/public'));
//Стандарти кодування
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
    'extended': 'true'
}));

const connection = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: 'root',
    database: 'cookbook'
});

// добавити рецепт
app.post('/recipe-add', function (req, res) {
    connection.query('INSERT INTO recipe SET ?', req.body, function (err, result) {
        if (err) throw err;
        console.log('user added to database with id: ' + result.insertId);
    });
    res.sendStatus(200);
});

//отримання товару
app.get('/recipe', function (req, res) {
    connection.query('SELECT * FROM recipe', function (err, rows) {
        if (err) throw err;
        console.log('get all recipes, length: ' + rows.length);
        res.status(200).send(rows);
    });
});

//Запис/читання опису товару у текстовий файл
//Читання
app.get('/items-info', function (req, res) {
    var str = new ItemsInfo().readInfo().toString().split('/item/');
    res.status(200).send(str);
});
//Запис
app.post('/items-info', function (req, res) {
    var str = new ItemsInfo().readInfo().toString();
    if (str == "") {
        str = str + req.body.text;
    } else {
        str = str + "/item/" + req.body.text;
    }
    var str2 = new ItemsInfo().writeInfo(str);
    res.sendStatus(200);
});

//Запис/читання опису ІНГРЕДІЄНТІВ у текстовий файл
//Читання
app.get('/ingrd-info', function (req, res) {
    var str3 = new IngrdInfo().readInfo().toString().split('/ingrd/');
    res.status(200).send(str3);
});
//Запис
app.post('/ingrd-info', function (req, res) {
    var str3 = new IngrdInfo().readInfo().toString();
    if (str3 == "") {
        str3 = str3 + req.body.text;
    } else {
        str3 = str3 + "/ingrd/" + req.body.text;
    }
    var str4 = new IngrdInfo().writeInfo(str3);
    res.sendStatus(200);
});


//Зміна опису товару в ткст файлі
app.put('/items-info', function (req, res) {
    var str = new ItemsInfo().writeInfo(req.body.text);
    res.sendStatus(200);
});
//Видали товар
app.delete('/item/:id', function (req, res) {
    connection.query('DELETE FROM recipe WHERE id = ?', req.params.id, function (err) {
        if (err) throw err;
        console.log('recipe delete id: ' + req.body.id);
    });
    res.sendStatus(200);
});
//Змінити дані товару в бд
app.post('/recipe-edit/:id', function (req, res) {
    connection.query('UPDATE recipe SET name = ?, creationDate = ? ,src = ? WHERE id = ?', [req.body.name, req.body.creationDate, req.body.src, req.params.id],
        function (err) {
            if (err) throw err;
            console.log('recipe update id: ' + req.params.id);
        }
    );
    res.sendStatus(200);
});

//Upload images
app.post('/images', upload.any(), function (req, res, next) {
    res.sendStatus(200);
})

//Усі адреси контролюються клієнтським ангуляром
app.get('*', function (req, res) {
    res.sendFile(__dirname + '/public/index.html');
});

//Запуск серверу
app.listen(port, function (err) {
    if (err) throw err;
    console.log('Server start on port 8000!');
});
