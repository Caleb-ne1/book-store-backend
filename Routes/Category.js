const express = require('express');
const router = express.Router();
const {Category} = require("../models");
const {validateToken} = require('../Middleware/jwt');

//to create a category
router.post('/', validateToken, async (req, res) => {
    try {
        const userId = req.userId;
        const { category_name } = req.body
        const category = await Category.create({
            category_name : category_name,
            UserId: userId
        })
        res.status(201).json({message: "Category added", category})
    } catch (err) {
        res.status(400).json({Error: err});
    }
})

//get all categories
router.get('/', async (req, res) => {
    try {
        const category = await Category.findAll()
        res.status(200).json(category)
    } catch (err) {
        res.status(400).json({Error: err})
    }
})

//to update category by id
router.put('/:id', validateToken, async (req, res) => {
    try {

        const id = req.params.id
        const {category_name} = req.body;
        const category = await Category.findByPk(id);

        if(!category) {
            res.status(404).json({message: "Category not found"})
        } else {
            category.category_name = category_name || category.category_name
            category.save()

            res.status(200).json({message: "Category updated", category})
        }

    } catch (err) {
        res.json({Error: err});
    }
})

//delete category by id
router.delete('/:id', validateToken, async (req, res) => {
    try {
        const id = req.params.id

        const category = await Category.findByPk(id)

        if(!category) {
            res.status(404).json({message: "Category not found"})
        } else {
            category.destroy();
            res.status(200).json({message: "Category deleted"})
        }

    } catch (error) {
        res.status(400).json({Error: error})
    }
})
module.exports = router;
