export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  if (req.method === 'OPTIONS') return res.status(200).end();
  try {
    const { default: Groq } = await import('groq-sdk');
    if(!process.env.GROQ_API_KEY) throw new Error("GROQ_API_KEY missing in Vercel!");
    const groq = new Groq({ apiKey: process.env.GROQ_API_KEY });
    const { message } = req.body;
    const completion = await groq.chat.completions.create({
      model: "llama-3.3-70b-versatile",
      messages: [{ role: "user", content: message }]
    });
    return res.status(200).json({ reply: completion.choices[0].message.content });
  } catch (e) {
    return res.status(500).json({ reply: "BACKEND ERROR: " + e.message });
  }
}
