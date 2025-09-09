const express = require("express");
const cors = require("cors");

const app = express();
app.use(cors());
app.use(express.json());

// 1. Build the prompt
function buildPrompt(userText) {
  return `
You are ResumeBot, an AI assistant that rewrites resume content into polished, professional text.

Rules:
1. If the input looks like resume content (education, work experience, skills) → rewrite it clearly and professionally.
2. Keep all original details. Do NOT add metrics, genders, dates, or claims that the user did not provide.
3. Never add commentary or conversational text. Output ONLY the resume content in clean sections.
4. If input is small talk → reply politely, briefly.
5. If input is unclear → ask the user to clarify.

Formatting:
- Keep Education, Work Experience, and Skills as sections if provided.
- Use bullet points for tasks/achievements.
- Improve grammar, clarity, and action verbs.

User: ${userText}

Answer:`.trim();
}

// 2. Main route: handle frontend requests
app.post("/enhance", async (req, res) => {
  try {
    const { text } = req.body;
    if (!text || typeof text !== "string" || !text.trim()) {
      return res.status(400).json({ error: "text is required" });
    }

    const prompt = buildPrompt(text);

    // tell browser we’re streaming json lines
    res.setHeader("Content-Type", "application/json; charset=utf-8");
    res.setHeader("Transfer-Encoding", "chunked");

    // 3. Call Ollama
    const response = await fetch("http://localhost:11434/api/generate", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        model: "llama3.2:1b",
        prompt,
        stream: true,
        options: { temperature: 0.2 },
      }),
    });

    // 4. Stream Ollama response → frontend
    const reader = response.body.getReader();
    const decoder = new TextDecoder();

    while (true) {
      const { done, value } = await reader.read();
      if (done) break;

      const chunk = decoder.decode(value, { stream: true });
      const lines = chunk.split("\n").filter(Boolean);

      for (const line of lines) {
        try {
          const obj = JSON.parse(line);

          if (obj.response) {
            res.write(JSON.stringify({ token: obj.response }) + "\n");
          }

          if (obj.done) {
            res.write(JSON.stringify({ done: true }) + "\n");
            res.end();
            return;
          }
        } catch (err) {
          console.log("⚠️ Skipping bad line:", line);
        }
      }
    }
  } catch (error) {
    console.error("AI request failed:", error);
    res.status(500).json({ error: "AI request failed" });
  }
});

// Start server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () =>
  console.log(`✅ Server running on http://localhost:${PORT}`)
);
