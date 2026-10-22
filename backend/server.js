const dns = require("node:dns");
dns.setServers(["8.8.8.8", "8.8.4.4"]);

require("dotenv").config();

const express = require("express");
const { MongoClient } = require("mongodb");
const cors = require("cors");

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

const client = new MongoClient(process.env.MONGODB_URI);

let studentsCollection;

app.get("/", (req, res) => {
  res.send("Student API is running!");
});

app.get("/students", async (req, res) => {
  try {
    const students = await studentsCollection.find({}).toArray();
    res.json(students);
  } catch (error) {
    res.status(500).json({ message: "Failed to retrieve students." });
  }
});

app.post("/students", async (req, res) => {
  try {
    const { name, course, yearLevel } = req.body;

    if (
      typeof name !== "string" || !name.trim() ||
      typeof course !== "string" || !course.trim() ||
      !["1st Year", "2nd Year", "3rd Year", "4th Year"].includes(yearLevel)
    ) {
      return res.status(400).json({
        message: "Provide a student name, course, and valid year level."
      });
    }

    const student = {
      name: name.trim(),
      course: course.trim(),
      yearLevel,
      createdAt: new Date()
    };

    const result = await studentsCollection.insertOne(student);

    res.status(201).json({
      message: "Student created successfully.",
      student: { ...student, _id: result.insertedId }
    });
  } catch (error) {
    res.status(500).json({ message: "Failed to create student." });
  }
});

async function startServer() {
  try {
    await client.connect();

    const database = client.db("studentDB");
    studentsCollection = database.collection("students");

    app.listen(PORT, "0.0.0.0", () => {
      console.log(`Student API running on port ${PORT}`);
    });
 } catch (error) {
  console.error("MongoDB connection failed:", error.message);
  process.exit(1);
}
}

startServer();
