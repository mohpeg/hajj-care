const app = require('./app');
const db = require('../src/models/index');

async function bootstrap() {
  const port = Number(process.env.PORT || '3000');
  try {
    await db.sequelize.authenticate();

    console.log('Connection to database was established successfully');
  } catch (err) {
    console.log(`Connection failed : ${err}`);
  }
  app.listen(port, () => {
    console.log(`Server listening on port ${port}`);
  });
}

bootstrap();
