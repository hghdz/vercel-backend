// vercel-backend/api/save-strengths.ts

import { MongoClient } from "mongodb"

const uri = process.env.MONGODB_URI!
const dbName = process.env.MONGODB_DB!

let client
let clientPromise

if (!global._mongoClientPromise) {
  client = new MongoClient(uri)
  global._mongoClientPromise = client.connect()
}
clientPromise = global._mongoClientPromise

export default async function handler(req, res) {
  // ✅ CORS preflight 요청 허용
  if (req.method === "OPTIONS") {
    res.setHeader("Access-Control-Allow-Credentials", "true")
    res.setHeader("Access-Control-Allow-Origin", "*")
    res.setHeader("Access-Control-Allow-Methods", "GET,POST,OPTIONS")
    res.setHeader("Access-Control-Allow-Headers", "Content-Type")
    return res.status(200).end()
  }

  // ✅ POST 외 메서드 차단
  if (req.method !== "POST") {
    return res.status(405).end("Method Not Allowed")
  }

  // ✅ 실제 요청 처리
  const { email, name, strengths } = req.body

  try {
    const client = await clientPromise
    const db = client.db(dbName)
    const strengthsCollection = db.collection("strengths")

    await strengthsCollection.updateOne(
      { email },
      { $set: { name, strengths, updatedAt: new Date() } },
      { upsert: true }
    )

    res.setHeader("Access-Control-Allow-Origin", "*") // ✅ 응답에도 CORS 헤더 추가
    res.status(200).json({ success: true })
  } catch (error) {
    console.error("MongoDB 저장 실패:", error)
    res.status(500).json({ success: false, error: error.message })
  }
}
