import app from "./app";
import { AppDataSource } from "./db";

const PORT = process.env.PORT || 8000;

(async () => {
  await AppDataSource.initialize();
  console.log("📦  DB connected");

  app.listen(PORT, () => {
    console.log(`Server ready at http://localhost:${PORT}`);
  });
})();