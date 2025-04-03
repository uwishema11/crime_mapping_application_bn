import app from "./app";
import { prisma } from "./db/prismaClient";

const PORT = 4000;

async function checkDatabaseConnection() {
  try {
    await prisma.$connect();
    console.log("✅ Database is connected!");
  } catch (error) {
    console.error("❌ Database connection failed:", error);
  }
}

checkDatabaseConnection();
app.listen(PORT, () => console.log(`Server is learning on port ${PORT}`));
