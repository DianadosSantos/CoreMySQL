const express = require('express')
const exphbs = require('express-handlebars')
const pool = require('./db/conn')
const app = express()
const port = 3000

app.engine('handlebars', exphbs.engine())
app.set('view engine','handlebars')

app.use(
    express.urlencoded({
        extended: true
    }),
)
app.use(express.json())
app.use(express.static('public'))

//tratamento com banco de dados
//insere
app.post('/books/insertbooks', (req,res)=>{
    const title = req.body.title
    const pageqty = req.body.pageqty

    const sql = `INSERT INTO books (title, pageqty) VALUES ('${title}', '${pageqty}');`

    pool.query(sql, function(err){
        if(err){
            console.log(err)
        }
        res.redirect('/')
    })
})

//leitura
app.get('/books' , (req,res)=>{
    const sql = 'SELECT * FROM books;'

    pool.query(sql, function(err,data){
        if(err){
            console.log(err)
            return
        }
        const books = data

        res.render('books' , {books})
    })
})

//Recuperando dados e alteração
app.get('/books/:id', (req,res)=>{
    const id = req.params.id
    const sql = `SELECT * FROM books WHERE id=${id};`

    pool.query(sql, function(err, data){
        if(err){
            console.log(err)
            return
        }

        const book = data[0]
        res.render('book', {book})
    })
})
app.get('/books/edit/:id', (req,res) =>{
    const id = req.params.id

    const sql = `SELECT * FROM books WHERE id=${id};`

    pool.query(sql, function(err, data){
        if(err){
            console.log(err)
            return
        }
        const book = data[0]
        res.render('editbooks' , {book})
    })
})
app.post('/books/updatebook', (req,res) =>{
    const id = req.body.id
    const title = req.body.title
    const pageqty = req.body.pageqty

    const sql = `UPDATE books SET title='${title}', pageqty=${pageqty} WHERE id=${id};`
    pool.query(sql, function(err){
        if(err){
            console.log(err)
            return
        }

        res.redirect('/books')
    })
})

//excluindo dados do Mysql
app.post('/books/remove/:id', (req,res) =>{
    const id = req.params.id

    const sql = `DELETE FROM books WHERE id=${id};`

    pool.query(sql, function(err){
        if(err){
            console.log(err)
            return
        }

        res.redirect('/books')
    })
})

//renderização da home
app.get('/', (req, res) => {
    res.render('home')
})


app.listen(port)
