const express = require("express");
const router = express.Router();

const db = require("../data/db");

  router.get('/', (req,res) => {
      db.find()
      .then(posts =>{
          res.json({posts: posts})
      })
      .catch(error => {
          res.status(500).json({ error: "The posts information could not be retrieved."  })
      });
  })

  router.get('/:id', (req,res)=>{
      
      db.findById(req.params.id)
      .then(post =>{
        if(post.length==0){
            res.status(404).json({message: "The post with the specified ID does not exist." })
         }else{
             res.status(200).json(post);
         }
     })
     .catch(error => {
         res.status(500).json({ error: "The posts information could not be retrieved." })
     })
  })

  router.get('/:id/comments', (req,res)=>{

        db.findPostComments(req.params.id)
        .then(comments =>{
           if(comments.length==0){
               res.status(404).json({message: "The comment with the specified ID does not exist." })
            }else{
                res.status(200).json(comments);
            }
        })
        .catch(error => {
            res.status(500).json({ error: "The comments information could not be retrieved." })
        })
  })

  router.delete('/:id/posts', (req,res)=>{
      //finds post
    db.findById(req.params.id)
    .then(post =>{
        //removes post
        db.remove(req.params.id)
        .then(removePost =>{
                //if the post was deleted 
                res.status(200).json(post);
        })
        .catch(error =>{
            res.status(500).json({ error: "The comments information could not be retrieved." })
        })
    })
    .catch(error => {
        res.status(404).json({message: "The post with the specified ID does not exist." })
    })
  })

  router.post('/', (req, res) => {
   
    if(!req.body.title || !req.body.contents){
        res.status(400).json({ errorMessage: "Please provide title and contents for the post."})
    } else {
         db.insert(req.body)
         .then(post => {
              res.status(201).json(post)
         })
         .catch(error => {
             res.status(500).json({ error: "There was an error while saving the post to the database"})
         })
        
    }
})

router.put("/:id", (req, res) => {
    
    const id = req.params.id;
    if (!req.params.id) {
        res.status(404).json({message: "The post with the specificed ID does not exist."})
        if (req.body.title !== "" || req.body.contents !== "") {
            res.status(400).json({errorMessage: "Please provide title and contents for the post."})
        }
    }
    db.update(req.params.id, req.body)
    .then((id) => {
        
        db.findById(req.params.id)
        .then(post => {
            res.status(200).json(post)
        })
        .catch(error => {
           
            res.status(500).json({ error: "The post information could not be modified."});
        });
    })
    .catch(error => {
        res.status(500).json({ error: "The post information could not be modified."});
    });
});

router.post('/:id/comments', (req, res) => {
    //Check to see if the post exists
    db.findById(req.params.id)
        .then(post => {
            if (post) {
                if (req.body.text) {
                    //Prepare the comment object and send to the DB
                    db.insertComment({
                        text: req.body.text,
                        post_id: Number(req.params.id)
                    })
                        //created comment
                        .then(commentid => {
                            db.findCommentById(commentid.id)
                                .then(comment => {
                                    res.status(201).json(comment)
                                })
                        })
                }
                else res.status(400).json({ errorMessage: "Please provide text for the comment." })
            }
            else res.status(404).json({ message: "The post with the specified ID does not exist." })
        })
        .catch(err => {
            console.log(err)
            res.status(500).json({ error: "There was an error while saving the comment to the database." })
        })
})


  module.exports = router