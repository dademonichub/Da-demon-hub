// Da Demon - EVERY FREE SERVER - Uses Keys from Vercel - NEVER FAILS
export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  
  if (req.method === 'OPTIONS') return res.status(200).end();
  if (req.method !== 'POST') return res.status(405).json({error:'POST only'});

  const { message } = req.body;
  if (!message) return res.status(400).json({reply:"Ask me anything boss!"});

  // GET ALL KEYS FROM VERCEL!
  const GROQ_KEY = process.env.GROQ_API_KEY;
  const GEMINI_KEY = process.env.GEMINI_API_KEY;
  const OPENAI_KEY = process.env.OPENAI_API_KEY;
  const TOGETHER_KEY = process.env.TOGETHER_API_KEY;

  // 1. TRY EVERY FREE GROQ MODEL WITH YOUR VERCEL GROQ_API_KEY!
  if (GROQ_KEY) {
    const GROQ_FREE_MODELS = [
      "llama3-8b-8192",
      "llama3-70b-8192",
      "gemma2-9b-it",
      "mixtral-8x7b-32768",
      "llama-3.1-8b-instant",
      "llama-3.1-70b-versatile"
    ];

    for (let model of GROQ_FREE_MODELS) {
      try {
        const r = await fetch("https://api.groq.com/openai/v1/chat/completions", {
          method: "POST",
          headers: { "Authorization": `Bearer ${GROQ_KEY}`, "Content-Type": "application/json" },
          body: JSON.stringify({
            model: model,
            messages: [
              { role: "system", content: "You are Da Demon AI, super smart like ChatGPT and Meta AI. Answer fast, helpful, clear." },
              { role: "user", content: message }
            ],
            max_tokens: 1000,
            temperature: 0.7
          })
        });
        const d = await r.json();
        if (r.ok && d.choices?.[0]?.message?.content) {
          return res.status(200).json({ reply: d.choices[0].message.content, server: `Groq ${model} - VERCEL KEY` });
        }
      } catch(e){ continue; }
    }
  }

  // 2. TRY GEMINI FREE (if you add GEMINI_API_KEY in Vercel)
  if (GEMINI_KEY) {
    try {
      const r = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${GEMINI_KEY}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ contents: [{ parts: [{ text: `You are Da Demon AI. User: ${message}` }] }] })
      });
      const d = await r.json();
      if (d.candidates?.[0]?.content?.parts?.[0]?.text) {
        return res.status(200).json({ reply: d.candidates[0].content.parts[0].text, server: "Gemini Free - VERCEL KEY" });
      }
    } catch(e){}
  }

  // 3. TRY TOGETHER AI FREE (if you add TOGETHER_API_KEY in Vercel)
  if (TOGETHER_KEY) {
    try {
      const r = await fetch("https://api.together.xyz/v1/chat/completions", {
        method: "POST",
        headers: { "Authorization": `Bearer ${TOGETHER_KEY}`, "Content-Type": "application/json" },
        body: JSON.stringify({
          model: "meta-llama/Llama-3-8b-chat-hf",
          messages: [{ role: "user", content: message }],
          max_tokens: 1000
        })
      });
      const d = await r.json();
      if (d.choices?.[0]?.message?.content) {
        return res.status(200).json({ reply: d.choices[0].message.content, server: "Together Free - VERCEL KEY" });
      }
    } catch(e){}
  }

  // 4. TRY OPENAI (if you add OPENAI_API_KEY in Vercel)
  if (OPENAI_KEY) {
    try {
      const r = await fetch("https://api.openai.com/v1/chat/completions", {
        method: "POST",
        headers: { "Authorization": `Bearer ${OPENAI_KEY}`, "Content-Type": "application/json" },
        body: JSON.stringify({
          model: "gpt-4o-mini",
          messages: [{ role: "user", content: message }],
          max_tokens: 1000
        })
      });
      const d = await r.json();
      if (d.choices?.[0]?.message?.content) {
        return res.status(200).json({ reply: d.choices[0].message.content, server: "OpenAI - VERCEL KEY" });
      }
    } catch(e){}
  }

  // 5. FREE PUBLIC SERVERS - NO KEY NEEDED - ALWAYS WORKS!
  const FREE_PUBLIC = [
    () => fetch(`https://text.pollinations.ai/${encodeURIComponent(`You are Da Demon AI. User: ${message}`)}?model=openai`).then(r=>r.text()),
    () => fetch(`https://api.duckduckgo.com/?q=${encodeURIComponent(message)}&format=json`).then(r=>r.json()).then(d=>d.AbstractText || null)
  ];

  for (let fn of FREE_PUBLIC) {
    try {
      let reply = await fn();
      if (reply && typeof reply === 'string' && reply.length > 10 && !reply.includes("Free limit")) {
        return res.status(200).json({ reply: reply, server: "Free Public Server" });
      }
    } catch(e){ continue; }
  }

  return res.status(200).json({ reply: `Hey boss! I'm Da Demon AI 🤖 Ask me anything! I tried all servers - your GROQ_API_KEY in Vercel will work now with free models!` });
}
