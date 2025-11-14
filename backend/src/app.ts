import express, { Application } from 'express';
import postsRouter from './routes/posts';
import usersRouter from './routes/users';
import swaggerUi from 'swagger-ui-express';
import swaggerJsdoc from 'swagger-jsdoc';
// Assuming the config path is relative to the project root for tests
import swaggerConfig from '../config/swagger.json';

const app: Application = express();

// Middleware
app.use(express.json());

// Swagger Setup
const swaggerDocs = swaggerJsdoc(swaggerConfig);
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocs));

// CORS Headers
app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE');
  res.header(
    'Access-Control-Allow-Headers',
    'Origin, X-Requested-With, Content-Type, Accept'
  );
  next();
});

// Route Handlers
app.use('/posts', postsRouter);
app.use('/users', usersRouter);

export default app; // <-- Key change: Export the configured app
