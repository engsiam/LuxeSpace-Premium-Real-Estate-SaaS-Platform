import 'dotenv/config';
import app from './app';
import env from './config';

const PORT = parseInt(env.PORT) || 5000;

async function main() {
  app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
  });
}

main();
