import 'dotenv/config';
import express from 'express'; import cors from 'cors'; import morgan from 'morgan';
import { connectDb } from './config/db.js'; import authRoutes from './routes/authRoutes.js'; import productRoutes from './routes/productRoutes.js'; import appRoutes from './routes/appRoutes.js'; import { errorHandler, notFound } from './middleware/errors.js';
const app = express();
app.use(cors({ origin: (process.env.CLIENT_URL || 'http://localhost:5173').split(','), credentials: false })); app.use(express.json({ limit: '1mb' })); app.use(morgan('dev'));
app.get('/api/health', (req, res) => res.json({ ok: true })); app.use('/api/auth', authRoutes); app.use('/api/products', productRoutes); app.use('/api', appRoutes); app.use(notFound); app.use(errorHandler);
const port = process.env.PORT || 5000; connectDb().then(() => app.listen(port, () => console.log(`API running on http://localhost:${port}`))).catch(err => { console.error(err.message); process.exit(1); });
