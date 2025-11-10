# React + Vite

This template provides a minimal setup to get React working in Vite with HMR and some ESLint rules.

Currently, two official plugins are available:

- [@vitejs/plugin-react](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react) uses [Babel](https://babeljs.io/) (or [oxc](https://oxc.rs) when used in [rolldown-vite](https://vite.dev/guide/rolldown)) for Fast Refresh
- [@vitejs/plugin-react-swc](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react-swc) uses [SWC](https://swc.rs/) for Fast Refresh

## React Compiler

The React Compiler is not enabled on this template because of its impact on dev & build performances. To add it, see [this documentation](https://react.dev/learn/react-compiler/installation).

## Expanding the ESLint configuration

If you are developing a production application, we recommend using TypeScript with type-aware lint rules enabled. Check out the [TS template](https://github.com/vitejs/vite/tree/main/packages/create-vite/template-react-ts) for information on how to integrate TypeScript and [`typescript-eslint`](https://typescript-eslint.io) in your project.

Setup: database (mac)
1. brew install supabase/tap/supabase
2. supabase login
   
   troubleshoot:
   - rm -rf supabase
   - supabase init

Generating questions using supaase js client
- refer to parsed-questions.js and generated_questions.sql
- dependecies to using dotenv (.env.local for apis, urls, keys: 
  - npm install dotenv
1. npm install @supabase/supabase-js
   
integate openai API to generatra quesitons from PDF content:
- dependeccies:
  - openai
  - pdf-parse
  - dotenv
1. npm install openai
2. update parsed-questions.js with openai integration
3. make sure to add OPENAI_API_KEY to .env.local
4, generating questions:
   - node parsed-questions.js > generated_questions.sql

changes to prompt to generate better questions:
- using articles provided by efrem
  