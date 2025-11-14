import app from './app';
import config from 'config';

const defaultPort = config.get('port') as number;

const port = process.env.PORT ? parseInt(process.env.PORT, 10) : defaultPort;

app.listen(port, () => {
  console.log(`API server is running on port ${port}`);
});
