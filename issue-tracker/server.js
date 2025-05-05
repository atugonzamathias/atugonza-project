const express = require('express');
const path = require('path');
const app = express();

// Serve static files from the "dist" folder created by Vite
app.use(express.static(path.join(__dirname, 'dist')));

// For all other routes, send the React app's index.html file
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'dist', 'index.html'));
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
