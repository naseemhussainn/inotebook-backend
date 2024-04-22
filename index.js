const connectToMongo = require('./db')
connectToMongo();
const express = require('express')
const app = express()
const cors = require('cors');
const port = 5000 

app.use(express.json())
app.use(cors());

app.use('/api/auth',require('./routes/auth'));
app.use('/api/notes',require('./routes/notes'));

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})   