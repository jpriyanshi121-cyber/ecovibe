const GEMINI_MODEL = "gemini-3.6-flash";
const GEMINI_URL = `https://generativelanguage.googleapis.com/v1beta/models/${GEMINI_MODEL}:generateContent`;

const SYSTEM_INSTRUCTION = `You are the AI Upcycle Assistant for EcoVibe, a marketplace for buying and selling secondhand, recycled and upcycled products.
Your job: when someone tells you what waste material or household item they have, suggest creative, practical, safe ways to upcycle or reuse it.
Keep replies concise, friendly and organized (use short bullet points with an emoji per idea when it fits). If the material could be hazardous (electronics, batteries, chemicals), mention proper disposal/recycling instead of DIY reuse.
Stay focused on sustainability, upcycling, recycling and eco-friendly living — if asked something unrelated, gently steer back to that topic.`;

// POST /api/chat  — { message: string, history?: [{ role: "user"|"assistant", content: string }] }
exports.chat = async (req, res, next) => {
  try {
    const { message, history } = req.body;

    if (!message || typeof message !== "string" || !message.trim()) {
      return res.status(400).json({ success: false, message: "A message is required" });
    }

    if (!process.env.GEMINI_API_KEY) {
      return res.status(503).json({
        success: false,
        message: "AI assistant isn't configured yet — GEMINI_API_KEY is missing on the server",
      });
    }

    const contents = [
      ...(Array.isArray(history) ? history : []).slice(-10).map((m) => ({
        role: m.role === "assistant" ? "model" : "user",
        parts: [{ text: String(m.content || "") }],
      })),
      { role: "user", parts: [{ text: message }] },
    ];

    const response = await fetch(GEMINI_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-goog-api-key": process.env.GEMINI_API_KEY,
      },
      body: JSON.stringify({
        contents,
        systemInstruction: { parts: [{ text: SYSTEM_INSTRUCTION }] },
        generationConfig: {
          temperature: 0.8,
          maxOutputTokens: 2048,
          thinkingConfig: { thinkingLevel: "low" },
        },
      }),
    });

    const data = await response.json();

    if (!response.ok) {
      const geminiMessage = data?.error?.message || "The AI assistant is temporarily unavailable";
      return res.status(502).json({ success: false, message: geminiMessage });
    }

    const reply = data?.candidates?.[0]?.content?.parts?.map((p) => p.text).join("") || "";

    if (!reply) {
      return res.status(502).json({ success: false, message: "The AI assistant didn't return a response" });
    }

    res.json({ success: true, reply });
  } catch (err) {
    next(err);
  }
};