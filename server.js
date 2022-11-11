const app = require("./app");

const{connectMongo, PORT} = require("./config/config")

async function main() {
  try {
    await connectMongo()
    console.log("Database connection successful");

    app.listen(PORT, () => {
    console.log(`Server running. Use our API on port: ${PORT}`);
});
  } catch (error) {
    console.log("Error:", error.message)
    process.exit(1)
  }
}
main();
