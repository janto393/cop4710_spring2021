// Program dependencies
const bodyParser = require('body-parser');
const cors = require('cors');
require('dotenv').config();
const { response, request } = require('express');
const express = require('express');
const path = require('path');

const app = express();
app.use(cors());
app.use(bodyParser.json());

// Environment Variable Configuration
const PORT = process.env.PORT || 5000;
app.set('port', PORT);

// Server static assets if in production
if (process.env.NODE_ENV === 'production') 
{
  // Set static folder
  app.use(express.static(path.join(__dirname, 'front-end', 'build')));

  app.get('*', (req, res) => 
	{
    res.sendFile(path.join(__dirname, 'front-end', 'build', 'index.html'));
	});
}

// Access Control Logic
app.use((request, response, next) => 
{
  response.setHeader('Access-Control-Allow-Origin', '*');
  response.setHeader(
    'Access-Control-Allow-Headers',
    'Origin, X-requestuested-With, Content-Type, Accept, Authorization'
  );
  response.setHeader(
    'Access-Control-Allow-Methods',
    'GET, POST, PATCH, DELETE, OPTIONS'
  );
  next();
});



app.listen(PORT); // start Node + Expresponses server on specified port
