export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { question } = req.body;
  const OPENAI_API_KEY = process.env.OPENAI_API_KEY;
  const OPENAI_MODEL = "gpt-3.5-turbo";

  if (!OPENAI_API_KEY) {
    return res.status(500).json({ error: 'Missing OpenAI API key in environment variables.' });
  }

  try {
    const response = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${OPENAI_API_KEY}`
      },
      body: JSON.stringify({
        model: OPENAI_MODEL,
        messages: [
          {
            role: "system",
            content: "Tu es LEGALBOT AUDIO 212 GROUP, un juriste spécialisé dans les contrats musicaux. Tu réponds de façon claire, structurée, avec un ton formel. Tu ne génères jamais de clauses non validées par AUDIO 212 GROUP."
          },
          {
            role: "user",
            content: question
          }
        ]
      })
    });

    const data = await response.json();
    res.status(200).json({ answer: data.choices?.[0]?.message?.content || "Pas de réponse." });
  } catch (err) {
    res.status(500).json({ error: "Erreur serveur lors de l'appel à OpenAI." });
  }
}