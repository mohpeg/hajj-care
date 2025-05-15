const app = require("./app");
const db = require("../src/models/index");

async function bootstrap() {
  const port = Number(process.env.PORT || "3000");
  try {
    await db.sequelize.authenticate();

    console.log("Connection to database was established successfully");
  } catch (err) {
    console.log(`Connection failed : ${err}`);
  }

  // Bind to all network interfaces (0.0.0.0) instead of just localhost
  app.listen(port, "0.0.0.0", () => {
    console.log(`Server listening on port ${port} on all interfaces`);
  });
}

// Only execute bootstrap if this file is run directly
if (require.main === module) {
  bootstrap();
}

module.exports = { bootstrap };
