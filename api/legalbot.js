export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    let body = "";
    await new Promise((resolve, reject) => {
      req.on("data", chunk => (body += chunk));
      req.on("end", resolve);
      req.on("error", reject);
    });

    const parsedBody = JSON.parse(body);
    const question = parsedBody.question;

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
