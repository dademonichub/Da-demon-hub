// Da Demon - SUPER FAST Groq Llama 3.3 70B - Linked to GROQ_API_KEY - Like Meta AI Speed
export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  
  if (req.method === 'OPTIONS') return res.status(200).end();
  if (req.method !== 'POST') return res.status(405).json({error:'POST only'});

  const { message } = req.body;
  if (!message) return res.status(400).json({reply:"Ask me anything boss!"});

  try {
    // 1. GET THE GROQ KEY WE DEPLOYED IN VERCEL!
    const groqKey = process.env.GROQ_API_KEY;
    
    if (!groqKey) {
      return res.status(200).json({ 
        reply: "Boss GROQ_API_KEY not found in Vercel! Add it in Environment Variables!" 
      });
    }

    // 2. GET REAL FACTS FROM WIKIPEDIA (like Meta AI)
    let context = "";
    try {
      let wikiQuery = message.replace(/who is|what is|picture|image|photo|generate/gi,'').trim().split(' ').slice(0,3).join(' ');
      if(wikiQuery.length > 2){
        let wikiRes = await fetch(`https://en.wikipedia.org/api/rest_v1/page/summary/${encodeURIComponent(wikiQuery)}`);
        if(wikiRes.ok){
          let wikiData = await wikiRes.json();
          if(wikiData.extract){
            context = `Real Wikipedia fact: ${wikiData.extract.substring(0,500)}. `;
          }
        }
      }
    } catch(e){}

    // 3. CALL GROQ - FASTEST AI - 1-2 SECONDS LIKE META AI!
    const groqRes = await fetch("https://api.groq.com/openai/v1/chat/completions", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${groqKey}`,
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        model: "llama-3.3-70b-versatile",
        messages: [
          { 
            role: "system", 
            content: `${context} You are Da Demon AI, super smart assistant like ChatGPT and WhatsApp Meta AI. You know everything about Nigeria, USA, world, presidents, history, science, coding, everything. Answer clearly, fast, and helpfully. User language: reply in same language user uses.` 
          },
          { 
            role: "user", 
            content: message 
          }
        ],
        temperature: 0.7,
        max_tokens: 1200,
        top_p: 1
      })
    });

    const data = await groqRes.json();
    
    if (!groqRes.ok) {
      return res.status(200).json({ 
        reply: `Groq Error: ${data.error?.message || JSON.stringify(data)}. Check your GROQ_API_KEY!` 
      });
    }

    let aiReply = data.choices?.[0]?.message?.content;

    if (!aiReply || aiReply.length < 5) {
      aiReply = "I am Da Demon AI! Ask me anything boss - Nigeria president, USA president, science, coding, anything!";
    }

    return res.status(200).json({ 
      reply: aiReply, 
      source: "Groq Llama 3.3 70B - FAST - Linked to GROQ_API_KEY" 
    });

  } catch(err){
    return res.status(200).json({ 
      reply: `I am Da Demon AI! I'm here to help with "${message}". (Error: ${err.message})` 
    });
  }
}
