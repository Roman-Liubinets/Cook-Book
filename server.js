//Підключаємо бібліотеки
const express = require('express');
const bodyParser = require('body-parser');
const app = express();
const port = 8000;
const mysql = require('mysql');
const multer = require("multer");


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




//Усі адреси контролюються клієнтським ангуляром
app.get('*', function (req, res) {
    res.sendFile(__dirname + '/public/index.html');
});

//Запуск серверу
app.listen(port, function (err) {
    if (err) throw err;
    console.log('Server start on port 8000!');
});
