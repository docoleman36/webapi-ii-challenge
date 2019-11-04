const express = require('express');
const Data = require('../data/db');

const router = express.Router();

// GET
router.get('/posts', async (req, res) => {
    try{
        const post = await Data.find(req.query)
        res.status(201).json(post)
    } catch (err) {
        res.status(500).json({ err: "There was an error while saving the post to the database" })
    }
})

router.get('/posts/:id', async (req, res) => {
    try{
        const post = await Data.findById(req.params.id)
        res.status(201).json(post)
    } catch (err) {
        res.status(500).json({ err: "There was an error while saving the post to the database" })
    }
})

router.get('/posts/:id/comments', async (req, res) => {
    try{
        const post = await Data.findCommentById(req.params.id)
        res.status(201).json(post)
    } catch (err) {
        res.status(500).json({ err: "There was an error while saving the post to the database" })
    }
})


// POST
router.post('/posts', (req, res) => {
    Data.insert(req.body)
    .then(data => {
        res.status(201).json(data)
    })
    .catch(err => {
        res.status(500).json({ err: "There was an error while saving the post to the database" })
    })
})

router.post('/posts/:id/comments', async (req, res) => {
    try {
        const post = await Data.findPostComments(req.params.id)
        res.status(201).json(post)
    } catch(err) {
        res.status(500).json({ err: "There was an error while saving the post to the database" })
    }
})

// PUT
router.put('/posts/:id', async (req, res) => {
    try {
        const changes = req.body;
        const update = await Data.update(req.params.id, changes)
        res.status(201).json(update)
    } catch(err) {
        res.status(500).json({ err: "There was an error while saving the post to the database" })
    }
})

// DELETE
router.delete('/posts/:id', async (req, res) => {
    try {
        const removePost = await Data.remove(req.params.id)
        res.status(201).json(removePost)
    } catch (err) {
        res.status(500).json({ err: "There was an error while saving the post to the database" })
    }
})

module.exports = router;