const express = require("express");
const app = express();
const cors = require("cors");
require("dotenv").config();
const port = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

app.get("/", (req, res) => {
  res.send("To-Do server Running");
});

const { MongoClient, ServerApiVersion, ObjectId } = require("mongodb");
const uri =
  `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.bioniru.mongodb.net/?retryWrites=true&w=majority`;
// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  },
});
async function run() {
  try {
    // Connect the client to the server	(optional starting in v4.7)
    // await client.connect();

    const todoCollection = client.db("todoDB").collection("todo");
    // Send a ping to confirm a successful connection
    // await client.db("admin").command({ ping: 1 });
    console.log(
      "Pinged your deployment. You successfully connected to MongoDB!"
    );
    app.post('/todo', async(req, res) => {
        const body = req.body;
        const result = await todoCollection.insertOne(body);
        res.send(result);
    })
    app.get('/todo/:email', async(req, res) => {
        const email = req.params.email;
        const query = {email: email}
        const result = await todoCollection.find(query).toArray();
        res.send(result);
    });
    app.put("/todo/:id", async (req, res) => {
      const id = req.params.id;
      const query = { _id: new ObjectId(id) };
      const updatedDoc = {
        $set: {
          status: "Completed",
        },
      }
      const result = await todoCollection.updateOne(query, updatedDoc);
      res.send(result)
    });
    app.delete('/todo/:id', async(req, res) => {
      const id = req.params.id;
      const query = { _id: new ObjectId(id) };
        const result = await todoCollection.deleteOne(query);
        res.send(result);
    });
  } finally {
    // Ensures that the client will close when you finish/error
    // await client.close();
  }
}
run().catch(console.dir);

app.listen(port, () => {
  console.log(`Server Running on Port ${port}`);
});
