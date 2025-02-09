const app = require("./app");
const { connectMongo } = require("./src/db/dbConection")
const config = require('./src/config/config')

async function main() {
  try {
    await connectMongo()
    console.log("Database connection successful");
    app.listen(config.PORT, () => {
    console.log(`Server running. Use our API on port: ${config.PORT}`);
});
  } catch (error) {
    console.log("Error:", error.message)
    process.exit(1)
  }
}
main();
