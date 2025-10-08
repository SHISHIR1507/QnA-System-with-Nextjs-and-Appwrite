import "dotenv/config";
import { db } from "../name";
import createAnswerCollection from "./answer.collection";
import createCommentCollection from "./comment.collection";
import createQuestionCollection from "./question.collection";
import createVoteCollection from "./vote.collection";
import { databases } from "./config";

export default async function getOrCreateDB() {
  try {
    await databases.get(db);
    console.log("✅ Database connection");
  } catch (error) {
    try {
      await databases.create(db, "QnA System");
      console.log("✅ Database created");

      // create collections
      await Promise.all([
        createQuestionCollection(),
        createAnswerCollection(),
        createCommentCollection(),
        createVoteCollection(),
      ]);

      console.log("✅ Collections created");
      console.log("✅ Database connected");
    } catch (error) {
      console.log("❌ Error creating databases or collections:", error);
    }
  }

  return databases;
}

// ✅ Run it immediately
getOrCreateDB()
  .then(() => console.log(" DB Setup Completed"))
  .catch((err) => console.error(" DB Setup Failed:", err));
