const express = require('express');
const mustache = require('mustache-express');
const bodyparser = require('body-parser');
const Sequelize = require('sequelize');


const server = express();

server.engine('mustache', mustache());
server.set('views', './views');
server.set('view engine', 'mustache');

server.use(bodyparser.urlencoded({ extended: true }));

// Todo Schema
const db = new Sequelize('things', 'adamlocklear', '', {
    dialect: 'postgres',
});

const Todos = db.define('todos', {
    title: Sequelize.STRING,
    description: Sequelize.STRING,
    dunzo: Sequelize.BOOLEAN
});

Todos.sync().then(function () {
    console.log('beans');
});


server.get('/', function (req, res) {
    Todos.findAll().then(function (results) {
        res.render('index', {
            todos: results
        });
    });

});
// ROUTES
// todos (form.mustache) 
server.get('/form', function (req, res) {
    res.render('form');
});
// Add todos to DB
server.post('/todos', function (req, res) {
    Todos.create({
        title: req.body.title,
        description: req.body.description,
        dunzo: false,

    }).then(function () {
        res.redirect('/')
    });
});
// Update dunzo or undunzo
server.post('/dunzo/:done', function (req, res) {
    let id = req.params.done;
    Todos.update({
        dunzo: false
    },
        {
            where: {
                id: id,
            },
            order : [
                ['createdAt', 'DESC'] 
            ],
        
        }).then(function () {
            res.redirect('/');
        });
    });  

server.post('/undunzo/:done', function (req, res) {
    let id = req.params.done;
    Todos.update({
        dunzo: true
    },
        {
            where: {
                id: id,
            },
            order : [
                ['createdAt', 'DESC'] 
            ],
        }).then(function () {
            res.redirect('/');
        });
});

server.post('/delete/:done', function (req, res) {
    let id = req.params.done;
    Todos.destroy({

        where: {
            id: id,
        },
        order : [
            ['createdAt', 'DESC'] 
        ],
    }).then(function () {
        res.redirect('/');
    });
});

server.post('/edit/:done', function (req, res) {
    let id = req.params.done;
    Todos.update({
        title: req.body.Sally
    },
        {
            where: {
                id: id,
            },
            order : [
                ['createdAt', 'DESC'] 
            ],
        }).then(function () {
            res.redirect('/');
        });
});
server.listen(3000);