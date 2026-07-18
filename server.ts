import express from 'express';
import path from 'path';
import fs from 'fs';

const app = express();
const PORT = 3000;

app.use(express.json());

// Log requests for easy debugging
app.use((req, res, next) => {
  console.log(`[${new Date().toISOString()}] ${req.method} ${req.url}`);
  next();
});

// Endpoint to capture browser/client-side errors
app.post('/api/log-error', (req, res) => {
  const { error, stack, url, line, col } = req.body;
  const logEntry = `[${new Date().toISOString()}] ERROR: ${error}\nURL: ${url}:${line}:${col}\nSTACK: ${stack}\n----------------------------------------\n`;
  console.error("❌ CLIENT ERROR CAPTURED:\n", logEntry);
  fs.appendFileSync(path.join(process.cwd(), 'client-errors.log'), logEntry);
  res.status(200).json({ ok: true });
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
