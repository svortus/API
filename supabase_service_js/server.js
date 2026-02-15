import express from 'express';
import router from './routes/Routes.js';
import dotenv from 'dotenv';
dotenv.config();
const app = express();
const port = process.env.PORT;

app.use(express.json({ limit: '1mb' }));
app.use(express.urlencoded({ limit: '1mb', extended: true }));

app.use('/api', router);
app.get('/', (req, res) => {
    res.json({ message: 'Welcome to the API' });
});


app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
});