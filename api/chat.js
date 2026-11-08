// Da Demon - EVERY FREE SERVER - Uses Keys from Vercel - NEVER FAILS - KNOWS EVERYTHING LIKE META AI - SUPER FAST
export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  
  if (req.method === 'OPTIONS') return res.status(200).end();
  if (req.method !== 'POST') return res.status(405).json({error:'POST only'});

  const { message, history = [], userZone = "Africa/Lagos", userTime = new Date().toString(), userHour = new Date().getHours() } = req.body;
  if (!message) return res.status(400).json({reply:"Ask me anything boss!"});

  const GROQ_KEY = process.env.GROQ_API_KEY;
  const GEMINI_KEY = process.env.GEMINI_API_KEY;
  const OPENAI_KEY = process.env.OPENAI_API_KEY;
  const TOGETHER_KEY = process.env.TOGETHER_API_KEY;

  // --- FIXED: FAST - NO SLOW FETCH ---
  let worldClockInfo = `${userTime} in ${userZone}`;
  let lower = message.toLowerCase();
  let detectedLang = "en";
  if(lower.includes("how far") || lower.includes("how e be") || lower.includes("wetin") || lower.includes("i no") || lower.includes("abi") || lower.includes("shebi") || lower === "how far") {
    detectedLang = "pcm";
  }

  const systemPrompt = `
CRITICAL - OBEY FIRST:
- PHONE TIME IS TRUTH: User phone is ${userZone} at ${userTime} hour ${userHour}. Use ONLY this time. America/* = America time, Europe/* = Europe time, Africa/* = Africa time. Never give Abuja time to American. If user asks Time in Lagos, say ${new Date().toLocaleString("en-NG", {timeZone:"Africa/Lagos"})} - Never do UTC math.
- PIDGIN: "How far" alone means "How are you" greeting in Nigerian Pidgin, NOT distance, NOT horror/darkness story. If ${detectedLang} is pcm reply ONLY Pidgin.

You are Da Demon AI, built by Edu. You are the most powerful AI like ChatGPT + Meta AI + Claude + Gemini combined.

YOU KNOW EVERYTHING: Science, medicine, law, Ifa tradition, Yoruba culture, coding (all languages), business, relationships, cooking, music, movies, history, geography, Nigerian local and foreign, everything in this world. Any question any AI can answer, you can answer.

WORLD CLOCK LINKED: User's real phone time is ${worldClockInfo} (Zone: ${userZone}, Hour: ${userHour}). USE ONLY THIS TIME - Don't give Abuja time to Europe person or Asia time to America person. If ${userZone} is Europe/* it's Europe, America/* is America, Asia/* is Asia, Africa/* is Africa, Australia/* is Oceania.

GOOGLE TRANSLATOR LINKED: User message "${message}" detected as language: ${detectedLang}. Reply in SAME language naturally - If pcm/pidgin (how far, how e be, how you da, how you da do na, wetin dey) reply Pidgin. If en (hey, hello) reply English. No forcing list, understand like Google Translate does.

MEMORY LIKE META AI: Only remember last 8 messages in current chat. If user says "him/her" and you don't know who from RECENT 8 messages, ASK "Who do you mean?" Never stick to one name like Elon forever.

NAME CALLING LIKE META AI: Don't call "boss" every time. Be random and natural. Sometimes call Edu, boss, my guy, bro, friend, chief, or no name at all. Change according to vibe, like Meta AI does. Vary it.

Be friendly, fast, helpful. Never say you are Llama or Groq. You are Da Demon AI. World time: ${worldClockInfo}
`;

  // BUILD ALL PROMISES TO RACE TOGETHER - NO WAITING!
  const allPromises = [];

  // GROQ - All models race
  if (GROQ_KEY) {
    const GROQ_FREE_MODELS = [
      "llama-3.1-8b-instant",
      "llama3-8b-8192",
      "gemma2-9b-it",
      "llama3-70b-8192",
      "mixtral-8x7b-32768",
      "llama-3.1-70b-versatile"
    ];
    GROQ_FREE_MODELS.forEach(model => {
      allPromises.push(
        fetch("https://api.groq.com/openai/v1/chat/completions", {
          method: "POST",
          headers: { "Authorization": `Bearer ${GROQ_KEY}`, "Content-Type": "application/json" },
          body: JSON.stringify({
            model: model,
            messages: [
              { role: "system", content: systemPrompt },
              ...history.slice(-8),
              { role: "user", content: message }
            ],
            max_tokens: 1000,
            temperature: 0.85
          })
        }).then(async r => {
          const d = await r.json();
          if (r.ok && d.choices?.[0]?.message?.content) return { reply: d.choices[0].message.content, server: `Groq ${model}` };
          throw new Error("groq fail");
        })
      );
    });
  }

  // GEMINI - Races too
  if (GEMINI_KEY) {
    allPromises.push(
      fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${GEMINI_KEY}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ contents: [{ parts: [{ text: `${systemPrompt}\nUser: ${message}` }] }] })
      }).then(async r => {
        const d = await r.json();
        if (d.candidates?.[0]?.content?.parts?.[0]?.text) return { reply: d.candidates[0].content.parts[0].text, server: "Gemini Free" };
        throw new Error("gemini fail");
      })
    );
  }

  // TOGETHER
  if (TOGETHER_KEY) {
    allPromises.push(
      fetch("https://api.together.xyz/v1/chat/completions", {
        method: "POST",
        headers: { "Authorization": `Bearer ${TOGETHER_KEY}`, "Content-Type": "application/json" },
        body: JSON.stringify({
          model: "meta-llama/Llama-3-8b-chat-hf",
          messages: [
            { role: "system", content: systemPrompt },
            ...history.slice(-8),
            { role: "user", content: message }
          ],
          max_tokens: 1000
        })
      }).then(async r => {
        const d = await r.json();
        if (d.choices?.[0]?.message?.content) return { reply: d.choices[0].message.content, server: "Together Free" };
        throw new Error("together fail");
      })
    );
  }

  // OPENAI
  if (OPENAI_KEY) {
    allPromises.push(
      fetch("https://api.openai.com/v1/chat/completions", {
        method: "POST",
        headers: { "Authorization": `Bearer ${OPENAI_KEY}`, "Content-Type": "application/json" },
        body: JSON.stringify({
          model: "gpt-4o-mini",
          messages: [
            { role: "system", content: systemPrompt },
            ...history.slice(-8),
            { role: "user", content: message }
          ],
          max_tokens: 1000
        })
      }).then(async r => {
        const d = await r.json();
        if (d.choices?.[0]?.message?.content) return { reply: d.choices[0].message.content, server: "OpenAI" };
        throw new Error("openai fail");
      })
    );
  }

  // POLLINATIONS FREE
  allPromises.push(
    fetch(`https://text.pollinations.ai/${encodeURIComponent(`You are Da Demon AI. User: ${message}`)}?model=openai`).then(async r => {
      const t = await r.text();
      if (t && t.length > 10) return { reply: t, server: "Pollinations Free" };
      throw new Error("poll fail");
    })
  );

  // RACE - WHOEVER RESPONDS FIRST WINS!
  try {
    const winner = await Promise.any(allPromises);
    if (winner && winner.reply) {
      return res.status(200).json({ reply: winner.reply, server: `${winner.server} - VERCEL KEY - FASTEST` });
    }
  } catch(e){
    // All failed, continue to fallback
  }

  return res.status(200).json({ reply: `Hey! I'm Da Demon AI 🤖 I know everything - Ifa, coding, science, business, anything - ask me!` });
}
