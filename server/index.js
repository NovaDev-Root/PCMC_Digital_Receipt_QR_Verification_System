import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import receiptRoutes from './routes/receipt.js';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors({
  origin: true,
  credentials: true
}));

app.use(express.json());

// Routes
app.use('/api/receipt', receiptRoutes);

app.get('/', (req, res) => {
  res.send('PCMC QR Receipt System API is running.');
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
