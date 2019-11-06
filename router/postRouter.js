// tells the server where to get express and the database
const express = require("express");
const db = require("../data/db");

// router will run the express.Router function
const router = express.Router();

// we use router.post instead of server.post because we
// are located inside a route.
router.post("/", (req, res) => {
    const newPost = req.body;

    // router.post takes a body containing title and contents keys
    // if no title or contents key is present, return status 400

    if (!newPost.title || !newPost.contents) {
        res.status(400).json({
            errorMessage: "Please provide title and contents for the post."
        });
    } else {
        // otherwise, run the insert function from the database
        // insert will take the body object

        db.insert(newPost)
            .then(post => {
                // if post is added successfully, return 201 with the new post

                res.status(201).json(post);
            })
            .catch(() => {
                // otherwise return 500

                res.status(500).json({
                    error: "There was an error while saving the post to the database"
                });
            });
    }
});

router.post("/:id/comments", (req, res) => {
    const commentInfo = { ...req.body, post_id: req.params.id };
    const id = req.params.id;

    // post to id/comments will let you leave a comment on a post
    // it requires the id of the post you'd like to comment on
    // and a body with a text key and post_id key
    // post_id key comes from parameters

    // if there is no text key on the body, return status 400
    if (!commentInfo.text) {
        res
            .status(400)
            .json({ errorMessage: "Please provide text for the comment." });
    } else {
        // otherwise, proceed to checking if the post exists
        // run findbyid from the database with the id

        db.findById(id)
            .then(post => {
                if (post.length > 0) {
                    // findbyid returns an array, if the length is greater than 0
                    // it is assumed the post id is correct
                    // continue with inserting the comment, using the text key from the body

                    db.insertComment(commentInfo)
                        .then(comment => {
                            // if it is successful, return the comment

                            res.status(201).json(comment);
                        })
                        .catch(err => {
                            res.status(500).json({
                                error:
                                    "There was an error while saving the comment to the database",
                                err
                            });
                        });
                } else {
                    // this else closes off the findById check,
                    // if array length is not greater than 0
                    // it is assumed the post does not exist

                    res.status(404).json({
                        message: "The post with the specified ID does not exist."
                    });
                }
            })

            // this catch wraps the .then from findById

            .catch(err => {
                res.status(500).json({
                    error: "There was an error while saving the comment to the database",
                    err
                });
            });
    }
});

// .get method returns a list of all posts
router.get("/", (req, res) => {
    db.find()
        .then(posts => {
            res.status(200).json(posts);
        })
        .catch(() => {
            res
                .status(500)
                .json({ error: "The posts information could not be retrieved." });
        });
});

// .get with an ID parameter will find the post with the given ID
// if the ID is not valid, return 404
router.get("/:id", (req, res) => {
    const id = req.params.id;
    db.findById(id)
        .then(post => {
            if (post.length > 0) {
                res.status(200).json(post);
            } else {
                res
                    .status(404)
                    .json({ message: "The post with the specified ID does not exist." });
            }
        })
        .catch(err => {
            res
                .status(500)
                .json({ error: "The post information could not be retrieved.", err });
        });
});

// this gets the comments on a post with a given ID
// if the ID is not valid, return a 404
// if it is valid, return the comments
router.get("/:id/comments", (req, res) => {
    const id = req.params.id;

    db.findById(id)
        .then(post => {
            if (post.length > 0) {
                db.findPostComments(id)
                    .then(comments => {
                        res.status(200).json(comments);
                    })
                    .catch(err => {
                        res.status(500).json({
                            error: "The post information could not be retrieved.",
                            err
                        });
                    });
            } else {
                res
                    .status(404)
                    .json({ message: "The post with the specified ID does not exist." });
            }
        })
        .catch(err => {
            res
                .status(500)
                .json({ error: "The post information could not be retrieved.", err });
        });
});

// .delete method takes an ID, and checks if it is valid
// if it is valid, return 204, no content
// if it is not valid, return 404
router.delete("/:id", (req, res) => {
    const id = req.params.id;

    db.findById(id)
        .then(post => {
            if (post.length > 0) {
                db.remove(id)
                    .then(() => {
                        res.status(204).end();
                    })
                    .catch(err => {
                        res.status(500).json({
                            error: "The post information could not be retrieved.",
                            err
                        });
                    });
            } else {
                res
                    .status(404)
                    .json({ message: "The post with the specified ID does not exist." });
            }
        })
        .catch(err => {
            res
                .status(500)
                .json({ error: "The post information could not be retrieved.", err });
        });
});

// okay this is a fun one
// .put method takes an ID and a body with title and contents
router.put("/:id", (req, res) => {
    const id = req.params.id;
    const postInfo = req.body;

    // if title or contents key are not present in body,
    // return status 400
    if (!postInfo.title || !postInfo.contents) {
        res.status(400).json({
            errorMessage: "Please provide title and contents for the post."
        });
    } else {
        // otherwise begin by checking if the ID is valid
        // if the ID is not valid, return 404
        // otherwise proceed to update
        db.findById(id)
            .then(post => {
                if (post.length > 0) {
                    db.update(id, postInfo)
                        // the update function takes the ID and the body object
                        .then(() => {
                            // if successful, it will then find the post by ID in order to return the new post
                            db.findById(id)
                                .then(newPost => {
                                    res.status(200).json(newPost);
                                })
                                .catch(err => {
                                    res.status(500).json({
                                        error: "The post information could not be modified."
                                    });
                                });
                        })
                        .catch(err => {
                            res
                                .status(500)
                                .json({ error: "The post information could not be modified." });
                        });
                } else {
                    res.status(404).json({
                        message: "The post with the specified ID does not exist."
                    });
                }
            })
            .catch(err => {
                res
                    .status(500)
                    .json({ error: "The post information could not be modified." });
            });
    }
});

module.exports = router;