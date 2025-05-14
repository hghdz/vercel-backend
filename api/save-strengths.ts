// /api/save-strengths.ts
import { MongoClient } from "mongodb"

const uri = process.env.MONGODB_URI
const dbName = process.env.MONGODB_DB

let client
let clientPromise

if (!global._mongoClientPromise) {
  client = new MongoClient(uri!)
  global._mongoClientPromise = client.connect()
}
clientPromise = global._mongoClientPromise

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).end("Method Not Allowed")
  }

  const { email, name, strengths } = req.body

  try {
    const client = await clientPromise
    const db = client.db(dbName)
    const strengthsCol = db.collection("strengths") // 👉 저장할 컬렉션 이름

    await strengthsCol.insertOne({
      email,
      name,
      strengths,
      createdAt: new Date(),
    })

    res.status(200).json({ success: true })
  } catch (error) {
    console.error("MongoDB 저장 실패:", error)
    res.status(500).json({ success: false, error: error.message })
  }
}
