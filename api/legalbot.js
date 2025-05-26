export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const body = await req.json(); // 💡 ici on parse bien le corps
    const question = body.question;
    console.log("QUESTION REÇUE :", question);

    const OPENAI_API_KEY = process.env.OPENAI_API_KEY;
    const OPENAI_MODEL = process.env.OPENAI_MODEL || "gpt-3.5-turbo";

    if (!OPENAI_API_KEY) {
      return res.status(500).json({ error: 'Missing OpenAI API key in environment variables.' });
    }

    if (!question || question.trim() === "") {
      return res.status(400).json({ error: "Question manquante dans la requête." });
    }

    const openaiRes = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${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}`
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

    const data = await openaiRes.json();
    console.log("Réponse OpenAI complète :", JSON.stringify(data, null, 2));

    if (data.choices && data.choices.length > 0) {
      res.status(200).json({ answer: data.choices[0].message.content });
    } else if (data.error) {
      res.status(500).json({ error: data.error.message || "Erreur API OpenAI inconnue." });
    } else {
      res.status(500).json({ error: "Réponse vide reçue depuis OpenAI." });
    }

  } catch (err) {
    console.error("Erreur OpenAI :", err);
    res.status(500).json({ error: err.message || "Erreur inattendue du serveur." });
  }
}
