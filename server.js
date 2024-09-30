const express = require('express');
const { MongoClient, ObjectId } = require('mongodb');
const cors = require('cors');
const app = express();

// Middleware
app.use(cors());
app.use(express.json());

const uri = 'mongodb+srv://culeden:Fl026nvJrFZI7lYZ@cluster0.ct384.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0';
const client = new MongoClient(uri);

async function connectDB() {
  await client.connect();
  return client.db('Tasks').collection('Tasks');
}
app.delete('/tasks/:id', async (req, res) => {
  try {
    const tasksCollection = await connectDB();
    const result = await tasksCollection.deleteOne({_id: new ObjectId(req.params.id)});

    res.status(200).json(result);
  }
  catch (error) {
    console.error(error);
    res.status(500).json({ message:"something wrong happened with the deletion"});
  }
})
app.post('/tasks', async (req, res) => {
  try 
  {  
    const tasksCollection = await connectDB();
    const {content, is_completed} = req.body;
    const newTask = {
      content,
      is_completed,
    }
    const result = await tasksCollection.insertOne(newTask);
    res.status(201).json(result);
  }
  catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error inserting task' });
  }
});

app.put('/tasks/:id', async (req, res) => {
  try {
    const tasksCollection = await connectDB();
    const { content, is_completed } = req.body;
    const updateFields = {};

    if (content !== undefined) {
      updateFields.content = content;
    }
    if (is_completed !== undefined) {
      updateFields.is_completed = is_completed;
    }
    
    const result = await tasksCollection.updateOne(
      { _id: new ObjectId(req.params.id) },
      { $set: updateFields }
    );
    res.status(200).json(result);
  }
  catch (error)
  {
    res.status(500).json(error);
  }
})
app.get('/tasks', async (req, res) => {
  try {
    const tasksCollection = await connectDB();
    const tasks = await tasksCollection.find({}).toArray();
    res.json(tasks);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error fetching tasks' });
  }
});
app.get('/', (req, res)=>{
  res.send('Hello from the homepage');
})
// Start the server
const PORT = 5001;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
