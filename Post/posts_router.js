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
            console.log(post)
      })
      .catch(error => {
          res.status(404).json({ message: "The post with the specified ID does not exist." })
      });
  })

  module.exports = router