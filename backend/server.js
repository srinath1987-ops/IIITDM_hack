const express = require('express');
const http = require('http');
const cors = require('cors');
const dotenv = require('dotenv');
const apiRoutes = require('./routes/api');
const socketService = require('./services/socketService');
const supabase = require('./config/supabase');

// Initialize environment variables
dotenv.config();

// Create Express app
const app = express();
const server = http.createServer(app);

// Initialize Socket.io
socketService.initialize(server);

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// API Routes
app.use('/api', apiRoutes);

// Health check endpoint
app.get('/health', (req, res) => {
  res.status(200).json({ status: 'ok', timestamp: new Date() });
});

// Coordinate input form
app.get('/', (req, res) => {
  res.send(`
    <html>
      <head>
        <title>Route Mapper - API Server</title>
        <style>
          body { font-family: Arial, sans-serif; max-width: 800px; margin: 0 auto; padding: 20px; }
          h1 { color: #333; }
          .form-group { margin-bottom: 15px; }
          label { display: block; margin-bottom: 5px; }
          input[type="text"] { width: 100%; padding: 8px; box-sizing: border-box; }
          button { background: #4CAF50; color: white; padding: 10px 15px; border: none; cursor: pointer; }
          button:hover { background: #45a049; }
          pre { background: #f4f4f4; padding: 15px; overflow: auto; }
        </style>
      </head>
      <body>
        <h1>Route Mapper API Server</h1>
        <p>This is the API server for the Route Mapper application. Use the form below to test the routing API directly.</p>
        
        <div class="form-group">
          <label for="start">Start Coordinates (latitude,longitude):</label>
          <input type="text" id="start" placeholder="e.g., 13.0827,80.2707 (Chennai)" value="13.0827,80.2707">
        </div>
        
        <div class="form-group">
          <label for="end">End Coordinates (latitude,longitude):</label>
          <input type="text" id="end" placeholder="e.g., 19.0760,72.8777 (Mumbai)" value="19.0760,72.8777">
        </div>
        
        <button onclick="testAPI()">Test Routing API</button>
        
        <h3>API Response:</h3>
        <pre id="response">Results will appear here...</pre>
        
        <script>
          async function testAPI() {
            const startCoords = document.getElementById('start').value.split(',');
            const endCoords = document.getElementById('end').value.split(',');
            
            if (startCoords.length !== 2 || endCoords.length !== 2) {
              document.getElementById('response').textContent = 'Invalid coordinates format. Use latitude,longitude';
              return;
            }
            
            const url = \`/api/routes?startLat=\${startCoords[0]}&startLng=\${startCoords[1]}&endLat=\${endCoords[0]}&endLng=\${endCoords[1]}\`;
            
            try {
              document.getElementById('response').textContent = 'Loading...';
              const response = await fetch(url);
              const data = await response.json();
              document.getElementById('response').textContent = JSON.stringify(data, null, 2);
            } catch (error) {
              document.getElementById('response').textContent = 'Error: ' + error.message;
            }
          }
        </script>
      </body>
    </html>
  `);
});

// Start the server
const PORT = process.env.PORT || 5000;
server.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});