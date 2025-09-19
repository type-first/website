export const installationSnippet 
  = /* yaml */ `
# npm
npm install @type-first/typist

# yarn  
yarn add @type-first/typist

# pnpm
pnpm add @type-first/typist

# Verify installation
npx tsc --noEmit
npm test
`