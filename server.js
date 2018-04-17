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

//Запис/читання опису товару у текстовий файл
//Читання
app.get('/items-info', function (req, res) {
    var str = new ItemsInfo().readInfo().toString().split('/item/');
    res.status(200).send(str);
});

//Змінити дані товару в бд
app.post('/recipe-edit/:id', function (req, res) {
    connection.query('UPDATE recipe SET name = ?, description = ?, creationDate = ? WHERE id = ?', [req.body.name, req.body.description, req.body.creationDate, req.params.id],
        function (err) {
            if (err) throw err;
            console.log('recipe update id: ' + req.params.id);
        }
    );
    res.sendStatus(200);
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
