# Frontend Mentor

Repository for Frontend Mentor challenges. I'm using Netlify to deploy the website under https://frontendmentor-gonzalotejada.netlify.app/.

This uses a simple Node.js code to generate challenges folders inside submissions folder and also generates simple HTML file to display the challenges.

## Challenges

{{#each challenges}}
{{inc @index}}. {{this.displayName}}
{{/each}}

## How to use

1. Clone the repository
2. Run `npm install`
3. Run `node index.js`
4. Go to `submissions` folder
5. Commit and push code so it will be available for netlify to deploy
