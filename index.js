const express = require('express')
const bodyParser = require('body-parser')


const ObjectId = require('mongodb').ObjectId;
const MongoClient = require('mongodb').MongoClient;
const uri = "mongodb+srv://OrganicUser:2bW9bQdvVXywI1vQ@cluster0.rrq7z.mongodb.net/tasks?retryWrites=true&w=majority";
const client = new MongoClient(uri, { useNewUrlParser: true ,useUnifiedTopology: true });

// const password = "2bW9bQdvVXywI1vQ"

const app = express();
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: false }))


app.get('/', (req, res) => {
    res.sendFile(__dirname + '/todoList.html')
})


client.connect(err => {
  const todosCollection = client.db("tasks").collection("todos");
  app.post('/addtodos',(req, res)=> {
      const todoName = req.body;
      todosCollection.insertOne(todoName)
      .then(result => {
          res.redirect('/')
    })
  })

  app.get('/todos', (req, res) => {
      todosCollection.find({})
      .toArray((err, documents)=> {
          res.send(documents)
      })
  })

  app.get('/edit/:id', (req, res) => {
      todosCollection.find({_id: ObjectId(req.params.id)})
      .toArray((err, documents)=> {
          res.send(documents[0])
      })
  })

  app.patch('/update/:id', (req,res) => {
    todosCollection.updateOne({_id: ObjectId(req.params.id)}, {
        $set: { name: req.body.name }
    })
    .then(result => {
        res.send(result.modifiedCount > 0)
    })
})

  app.delete('/delete/:id', (req,res) => {
      todosCollection.deleteOne({
          _id: ObjectId(req.params.id)
      })
      .then(result => {
          res.send(result.deletedCount > 0)
      })
  })

});



app.listen(4000)