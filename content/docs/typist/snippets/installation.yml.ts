export const installationSnippet 
  = /* yaml */ `
# npm
npm install @typefirst/typist

# yarn  
yarn add @typefirst/typist

# pnpm
pnpm add @typefirst/typist

# Verify installation
npx tsc --noEmit
npm test
`