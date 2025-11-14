import express, { Application } from 'express';
import config from 'config';
import postsRouter from './routes/posts';
import usersRouter from './routes/users';
import swaggerUi from 'swagger-ui-express';
import swaggerJsdoc from 'swagger-jsdoc';
import swaggerConfig from '../config/swagger.json';

const defaultPort = config.get('port') as number;

const port = process.env.PORT ? parseInt(process.env.PORT, 10) : defaultPort;

const app: Application = express();

app.use(express.json());

const swaggerDocs = swaggerJsdoc(swaggerConfig);
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocs));

app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE');
  res.header(
    'Access-Control-Allow-Headers',
    'Origin, X-Requested-With, Content-Type, Accept'
  );
  next();
});

app.use('/posts', postsRouter);
app.use('/users', usersRouter);

app.listen(port, () => {
  console.log(`API server is running on port ${port}`);
});
