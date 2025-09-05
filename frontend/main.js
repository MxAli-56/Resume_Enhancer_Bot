document.addEventListener("DOMContentLoaded", () => {
  const input = document.getElementById("userInput");
  const btn = document.getElementById("sendBtn");
  const chat = document.getElementById("resumeBot");
  const themeToggleBtn = document.getElementById("themeToggleBtn");

  let abortController = null;
  let displayName = localStorage.getItem("name") || "You";

  // ---- UI helpers ----
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

    chat.appendChild(wrap);
    chat.scrollTop = chat.scrollHeight;
    return wrap;
  }

  function setBusy(isBusy) {
    // don’t disable button — allow STOP click
    btn.disabled = false;
    btn.textContent = isBusy ? "🛑" : "Send";
  }

  // ---- Send message to backend ----
  async function sendMessage() {
    const message = input.value.trim();
    if (!message) return;

    // Show user bubble
    appendMessage("user", message, "You");
    input.value = "";
    setBusy(true);

    // Create empty bot bubble
    const botWrap = appendMessage("bot", "", "ResumeBot");
    const botBody = botWrap.querySelector(".msg-body");

    abortController = new AbortController();

    try {
      const resp = await fetch("http://localhost:5000/enhance", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ text: message }),
        signal: abortController.signal,
      });

      if (!resp.ok) {
        // make errors human-friendly
        if (resp.status === 500) {
          botBody.textContent = "⚠️ Server error. Please try again later.";
        } else if (resp.status === 404) {
          botBody.textContent = "⚠️ Service not found. Check backend route.";
        } else {
          const errText = await resp.text();
          botBody.textContent = errText || `⚠️ Request failed (${resp.status})`;
        }
        setBusy(false);
        abortController = null;
        return;
      }

      // Streaming tokens
      const reader = resp.body.getReader();
      const decoder = new TextDecoder();

      while (true) {
        if (!abortController) break; // stopped

        const { done, value } = await reader.read();
        if (done) break;

        const chunk = decoder.decode(value, { stream: true });
        const lines = chunk.split("\n").filter(Boolean);

        for (const line of lines) {
          try {
            const obj = JSON.parse(line);

            if (obj.token) {
              botBody.textContent += obj.token;
              chat.scrollTop = chat.scrollHeight;
            }

            if (obj.done) {
              setBusy(false);
              abortController = null;
              return;
            }
          } catch (e) {
            console.log("⚠️ Skipped malformed line:", line);
          }
        }
      }
    } catch (err) {
      // human-friendly error handling
      if (err.name === "AbortError") {
        botBody.textContent = "🛑 Response stopped by user.";
      } else if (err.message.includes("Failed to fetch")) {
        botBody.textContent = "🌐 Network error. Please check connection.";
      } else {
        botBody.textContent = `❌ Unexpected error: ${err.message}`;
      }
    } finally {
      setBusy(false);
      abortController = null;
    }
  }

  // ---- Theme handling ----
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

  // ---- Stop AI response ----
  function stopResponse() {
    if (abortController) {
      abortController.abort();
      setBusy(false);
      abortController = null;
    }
  }

  // ---- Button & key events ----
  btn.addEventListener("click", () => {
    if (abortController) {
      stopResponse();
    } else {
      sendMessage();
    }
  });

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
