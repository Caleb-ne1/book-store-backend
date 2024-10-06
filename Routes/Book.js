const express = require('express');
const router = express.Router();
const {Book} = require("../models");
const {validateToken } = require("../Middleware/jwt")

//add a book
router.post('/', validateToken, async (req, res) => {
try {
    const userId = req.userId
     const {title, author, price, stock, description, category, image_url} = req.body;
    await Book.create({
        title : title,
        author : author,
        price : price,
        stock : stock,
        description: description,
        category: category,
        image_url: image_url,
        UserId: userId
    });

    res.status(201).json({message: "Book added"});
 } catch (err) {
    res.status(400).json({Error: err})
 }
})

//get all books
router.get('/',  async (req, res) => {
    try {
        const books = await Book.findAll();
        res.status(200).json(books);

    } catch (err) {
        res.status(400).json({Error: err});
    }
})

//count books
router.get('/count', async (req, res) => {
    try {
        const bookCount = await Book.count();
        res.json({total : bookCount});
    } catch (err) {
        res.json({Error: err})
    }
})

//get books by id
router.get('/:id', async (req, res) => {
    const id = req.params.id;

    try {
        const book = await Book.findByPk(id);
        if(!book) {
            res.status(404).json({message: "Book not found"})
        } else {
            res.status(302).json(book)
        }
    } catch (err) {
        res.status(400).json({Error: err});
    }
})

//delete a book
router.delete('/delete/:id', validateToken, async(req, res) => {
    const id = req.params.id
    try {
        const book = await Book.findByPk(id);

        if(!book) {
            res.status(404).json({message: "Book not found"})
        } else {
            res.status(200).json({message: "Book deleted"})
            await book.destroy()
        }
    } catch (err) {
        res.json({Error : err});
    }
})

//update book by id
router.put('/:id', validateToken, async (req, res) => {
    const id = req.params.id;

    try {
        const book = await Book.findByPk(id)
        const {title, author, price, stock, description, category, image_url} = req.body;
        if(!book){
            res.status(404).json({message: "Book not found"})
        } else {
            book.title = title || book.title,
            book.author = author || book.author,
            book.price = price || book.price,
            book.category = category || book.category,
            book.image_url = image_url || book.image_url,
            book.stock = stock || book.stock,
            book.description = description || book.description


            await book.save()

            res.status(200).json({message : "Book update", book})
        }
    } catch(err) {
        res.status(400).json({Error: err})
    }
})
module.exports = router;
