import express from 'express';
import path from 'path';

const app = express();
const PORT = 3000;

// Log requests for easy debugging
app.use((req, res, next) => {
  console.log(`[${new Date().toISOString()}] ${req.method} ${req.url}`);
  next();
});

// Serve the workspace root statically so we can access any html file
app.use(express.static(path.join(process.cwd(), '.')));

// Fallback to serve index.html for root requests
app.get('/', (req, res) => {
  res.sendFile(path.join(process.cwd(), 'index.html'));
});

app.listen(PORT, '0.0.0.0', () => {
  console.log(`Development server running on http://0.0.0.0:${PORT}`);
});
