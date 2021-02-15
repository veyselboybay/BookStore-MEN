let express = require('express')
let router = express.Router();
let mongoose = require('mongoose');

let Book =require('../models/book');

router.get('/',(req,res,next) => {
    Book.find((err,bookList) => {
        if(err)
        {
            return console.log(err);
        }
        else
        {
            res.render('book/list',{title:'Books',BookList:bookList});
        }
    })
})

// GET ADD PAGE
router.get('/add',(req,res,next) => {

    res.render('book/add',{title:'Add Book'});
})

// PROCESS EDIT PAGE
router.post('/add',(req,res,next) => {
    
    let newBook= Book({
        "name":req.body.name,
        "author":req.body.author,
        "published":req.body.published,
        "description":req.body.description,
        "price":req.body.price
    });

    Book.create(newBook,(err,Book) => {
        if(err)
        {
            console.error(err);
            res.end(err);
        }
        else
        {
            res.redirect('/books');
        }
    })
})

//GET EDIT PAGE

router.get('/edit/:id',(req,res,next) => {
    let id=req.params.id;
    Book.findById(id,(err,editBook) => {
        if(err)
        {
            console.error(err);
            res.end(err);
        }
        else
        {
            res.render('book/edit',{title:'Edit Book',book:editBook});
        }
    })
})

//PROCESS EDIT PAGE

router.post('/edit/:id',(req,res,next) => {
    let id=req.params.id;

    let updatedBook= Book({
        "_id":id,
        "name":req.body.name,
        "author":req.body.author,
        "published":req.body.published,
        "description":req.body.description,
        "price":req.body.price
    });

    Book.updateOne({_id:id},updatedBook,(err) => {
        if(err)
        {
            console.error(err);
            res.end(err);
        }
        else
        {
            res.redirect('/books');
        }
    });
})

//DELETING A BOOK RECORD

router.get('/delete/:id',(req,res,next) => {
    let id=req.params.id;

    Book.remove({_id:id},(err) => {
        if(err)
        {
            console.log(err);
            res.end(err);
        }
        else
        {
            res.redirect('/books');
        }
    })
})


module.exports = router;