let mongoose = require('mongoose')

let bookModel = mongoose.Schema({
    name:String,
    author:String,
    published:String,
    description:String,
    price:String
},
{
    collection:"books"
})

module.exports = mongoose.model('Book',bookModel);
