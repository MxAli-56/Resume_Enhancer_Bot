# ResumeBot – AI Resume Enhancer ✨

ResumeBot is a minimal AI-powered resume assistant that rewrites raw work experience into **polished, professional, achievement-focused** bullet points.  
It also handles greetings and small talk politely, without mixing them into resume edits.  

---

## 🔹 Features
- Paste raw resume text → get a **clean, professional version** instantly.
- Distinguishes between:
  - Resume content → rewritten professionally.
  - Small talk/greetings → polite chatbot replies.
- Achievement-focused rephrasing with strong action verbs.
- Ethical: **does not invent fake jobs or false details**.
- Built with **HTML/CSS/JS (frontend)** and **Python/Flask + Ollama/OpenAI (backend)**.

---

## 📥 Inputs
- Resume text (work experience, skills, education, etc.)
- (Optional) Job title / description for tailoring

## 📤 Outputs
- Polished resume bullet points (concise, professional)
- Optional: tailored version for job title

---

## ✅ Success Criteria
- User says: “This version looks much stronger.”
- Before/After examples clearly show:
  - Duties → Achievements
  - Weak → Strong action verbs
- No false claims or fake numbers added.

---

## 🛠️ Tech Stack
- **Frontend**: HTML, CSS, JavaScript
- **Backend**: Python (Flask)
- **Database**: MongoDB (for storing before/after examples)
- **LLM**: Ollama (local) or OpenAI API (cloud)

---

## 🚀 How to Run
1. Clone the repo:
   ```bash
   git clone https://github.com/your-username/resume-bot.git
   cd resume-bot

2. Install backend dependencies:
     pip install -r requirements.txt

3. Run Node server:
     node server.js || npx nodemon server.js

4. Open index.html in browser → start chatting with ResumeBot.

📂 Project Structure
    
    Resume_Enhancer_Bot/
    │── frontend/       # HTML, CSS, JS files
    │── backend/        # Node JS file
    │── prompt.md       # Prompt experiments (v1 → v4)
    │── spec.md         # Product spec (inputs, outputs, success criteria)
    │── Readme.md       # Project documentation
    │── .gitignore  
    │── node_modules/    
    │── package.json
    │── package-lock.json

🎯 Demo

[Watch the demo here](https://drive.google.com/file/d/1PunMqUbJNl4tI3Z2ihctg8DgEgWBzVWw/view?usp=sharing)

📌 Example

Input (raw resume text):
Name: Ali
Worked in sales for 2 years, talked to customers, handled complaints. Also used Excel for reports. Helped team reach monthly sales goals.


Output (polished by ResumeBot):
Ali has demonstrated sales expertise through two years of experience, effectively communicating with customers and resolving issues. Additionally, proficiency in Excel has enabled the collection and analysis of sales data, contributing to team performance.


📜 License

MIT License – free to use and modify.


👨‍💻 Author

Built with ❤️ by Ali

Part of my AI Development Journey (Day 22 → Day 30 project) 🚀

---

This README is **portfolio-ready**:  
- Shows what the project does ✅  
- Explains tech & setup ✅  
- Includes example input/output ✅  
- Professional formatting ✅