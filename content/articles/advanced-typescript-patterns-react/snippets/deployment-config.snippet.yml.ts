export const deploymentConfigSnippet 
  = /* yml */ `

# TypeScript React Application Deployment Configuration
name: Deploy TypeScript React App
on:
  push:
    branches: [main]
  pull_request:
    branches: [main]
jobs:
  build-and-deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      
      - name: Install dependencies
        run: npm ci
      
      - name: Build application
        run: npm run build
        env:
          NODE_ENV: production
          NEXT_PUBLIC_API_URL: \${{ secrets.API_URL }}
      
      - name: Deploy to staging
        if: github.ref == 'refs/heads/main'
        run: npm run deploy:staging
        env:
          DEPLOY_TOKEN: \${{ secrets.DEPLOY_TOKEN }}
          
`
