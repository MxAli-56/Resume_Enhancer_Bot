document.addEventListener("DOMContentLoaded", () => {
  const input = document.getElementById("userInput");
  const btn = document.getElementById("sendBtn");
  const chat = document.getElementById("resumeBot");
  const themeToggleBtn = document.getElementById("themeToggleBtn");

  let abortController = null;
  let displayName = localStorage.getItem("name") || "You";

  function appendMessage(role, text, name = "") {
    const wrap = document.createElement("div");
    wrap.className = `msg ${role}`;

    if (name) {
      const u = document.createElement("div");
      u.className = "username";
      u.textContent = name;
      wrap.appendChild(u);
    }

    const body = document.createElement("div");
    body.className = "msg-body";
    body.textContent = text;
    wrap.appendChild(body);

    chat.appendChild(wrap); // ✅ fixed
    chat.scrollTop = chat.scrollHeight;
    return wrap;
  }

  function setBusy(isBusy) {
    btn.disabled = isBusy; // ✅ cleaner
    btn.textContent = isBusy ? "🛑" : "Send";
  }

  async function sendMessage() {
  const message = input.value.trim();
  if (!message) return;

  // Show user bubble
  appendMessage("user", message, "You");
  input.value = "";
  setBusy(true);

  abortController = new AbortController();

  // Create empty bot bubble
  const botWrap = appendMessage("bot", "", "ResumeBot");
  const botBody = botWrap.querySelector(".msg-body");

  try {
    const resp = await fetch("http://localhost:5000/enhance", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ text: message }),
      signal: abortController.signal
    });

    const reader = resp.body.getReader();
    const decoder = new TextDecoder();

    while (true) {
      const { done, value } = await reader.read();
      if (done) break;

      const chunk = decoder.decode(value, { stream: true });
      const lines = chunk.split("\n").filter(Boolean);

      for (const line of lines) {
        try {
          const obj = JSON.parse(line);

          if (obj.token) {
            botBody.textContent += obj.token; // stream into bubble
          }

          if (obj.done) {
            setBusy(false);
            abortController = null;
            return;
          }
        } catch (e) {
          console.log("⚠️ Frontend skipped line:", line);
        }
      }
    }
  } catch (err) {
    botBody.textContent = "❌ Error: " + err.message;
    setBusy(false);
  }
}

  // theme handling (unchanged)
  if (localStorage.getItem("theme") === "dark") {
    document.body.classList.add("dark-mode");
    if (themeToggleBtn) themeToggleBtn.textContent = "Light Mode";
  }

  themeToggleBtn?.addEventListener("click", () => {
    document.body.classList.toggle("dark-mode");
    if (document.body.classList.contains("dark-mode")) {
      localStorage.setItem("theme", "dark");
      themeToggleBtn.textContent = "Light Mode";
    } else {
      localStorage.setItem("theme", "light");
      themeToggleBtn.textContent = "Dark Mode";
    }
  });

  function stopResponse() {
    if (abortController) {
      abortController.abort();
      setBusy(false);
      abortController = null;
    }
  }

  // SEND / STOP button (mouse click)
  btn.addEventListener("click", () => {
    if (abortController) {
      stopResponse();
    } else {
      sendMessage();
    }
  });

  // Enter to send / stop
  input.addEventListener("keydown", (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      if (abortController) {
        stopResponse();
      } else {
        sendMessage();
      }
    }
  });
});
