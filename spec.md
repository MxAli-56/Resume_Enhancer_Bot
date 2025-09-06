# ResumeBot Specification

## Purpose
ResumeBot is an AI-powered chatbot that enhances and rewrites resume content.  
Its goal is to take raw, unpolished resume text and turn it into a professional, well-phrased, and job-ready version.

## Features
- Chat-like interface (user can send messages and get AI responses).
- Differentiates between small talk and resume text.
- Enhances resume content (grammar, clarity, tone, impact).
- Provides user-friendly error messages.
- Supports light and dark mode.
- Auto-scroll to latest messages.

## Inputs
- Raw text provided by the user (resume entries, experiences, skills).
- Optional casual/small-talk text (which is handled gracefully).

## Outputs
- Polished and professional resume entries.
- Small talk replies (if user is greeting or casual chatting).
- Human-readable error messages.

## Success Criteria
- Resume entries are enhanced without changing factual information.
- The bot correctly distinguishes resume vs. small talk.
- Smooth and simple UI (with dark mode and auto-scroll).
- Works consistently for multiple user inputs.