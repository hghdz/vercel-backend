// /api/save-strengths.ts
import { MongoClient } from "mongodb"

const uri = process.env.MONGODB_URI
const dbName = process.env.MONGODB_DB

let client
let clientPromise

if (!global._mongoClientPromise) {
  client = new MongoClient(uri)
  global._mongoClientPromise = client.connect()
}
clientPromise = global._mongoClientPromise

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).end("Method Not Allowed")
  }

  const { email, strengths } = req.body

  if (!email || !strengths || !Array.isArray(strengths)) {
    return res.status(400).json({ error: "Invalid input" })
  }

  try {
    const client = await clientPromise
    const db = client.db(dbName)
    const collection = db.collection("strengths")

    await collection.updateOne(
      { email },
      {
        $set: {
          strengths,
          submittedAt: new Date(),
        },
      },
      { upsert: true }
    )

    res.status(200).json({ success: true })
  } catch (error) {
    console.error("강점 저장 실패:", error)
    res.status(500).json({ success: false, error: error.message })
  }
}
