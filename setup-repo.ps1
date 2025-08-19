# GitHub Repository Setup Script for React Data Grid
# Author: Amirali Ansaripour
# Repository: https://github.com/Amiraliansaripour/data-grid

Write-Host "🚀 Setting up React Data Grid repository..." -ForegroundColor Green

# Check if we're in the right directory
if (-not (Test-Path "package.json")) {
    Write-Host "❌ Error: package.json not found. Please run this script from the project root." -ForegroundColor Red
    exit 1
}

# Initialize git repository if not already initialized
if (-not (Test-Path ".git")) {
    Write-Host "📁 Initializing Git repository..." -ForegroundColor Yellow
    git init
}

# Set remote origin
Write-Host "🔗 Setting up remote origin..." -ForegroundColor Yellow
git remote remove origin 2>$null
git remote add origin https://github.com/Amiraliansaripour/data-grid.git

# Create .gitignore if it doesn't exist
if (-not (Test-Path ".gitignore")) {
    Write-Host "📝 Creating .gitignore..." -ForegroundColor Yellow
    @"
# Dependencies
node_modules/
npm-debug.log*
yarn-debug.log*
yarn-error.log*

# Production builds
dist/
build/

# Environment variables
.env
.env.local
.env.development.local
.env.test.local
.env.production.local

# IDE/Editor files
.vscode/
.idea/
*.swp
*.swo
*~

# OS generated files
.DS_Store
.DS_Store?
._*
.Spotlight-V100
.Trashes
ehthumbs.db
Thumbs.db

# Logs
logs
*.log

# Coverage directory used by tools like istanbul
coverage/
*.lcov

# nyc test coverage
.nyc_output

# Dependency directories
jspm_packages/

# Optional npm cache directory
.npm

# Optional eslint cache
.eslintcache

# Microbundle cache
.rpt2_cache/
.rts2_cache_cjs/
.rts2_cache_es/
.rts2_cache_umd/

# Optional REPL history
.node_repl_history

# Output of 'npm pack'
*.tgz

# Yarn Integrity file
.yarn-integrity

# dotenv environment variables file
.env.test

# parcel-bundler cache (https://parceljs.org/)
.cache
.parcel-cache

# next.js build output
.next

# nuxt.js build output
.nuxt

# vuepress build output
.vuepress/dist

# Serverless directories
.serverless/

# FuseBox cache
.fusebox/

# DynamoDB Local files
.dynamodb/

# TernJS port file
.tern-port

# Stores VSCode versions used for testing VSCode extensions
.vscode-test
"@ | Out-File -FilePath ".gitignore" -Encoding UTF8
}

# Create GitHub Actions directory structure
New-Item -ItemType Directory -Force -Path ".github/workflows" | Out-Null

# Set up initial commit
Write-Host "📦 Adding files to git..." -ForegroundColor Yellow
git add .

Write-Host "💾 Creating initial commit..." -ForegroundColor Yellow
git commit -m @"
🎉 Initial commit: React Data Grid library

✨ Features:
- TypeScript support with full type safety
- Advanced filtering and sorting
- Pagination and search
- Export to Excel/PDF
- Persian/RTL support
- Dark mode support
- Chart integration ready
- Responsive design

🔧 Setup:
- Complete npm package configuration
- GitHub Actions CI/CD pipeline
- Comprehensive documentation
- Testing infrastructure
- ESLint and TypeScript config

📚 Documentation:
- README with usage examples
- Contributing guidelines
- Changelog tracking
- MIT License

Created by Amirali Ansaripour
Repository: https://github.com/Amiraliansaripour/data-grid
"@

Write-Host "🌿 Setting up main branch..." -ForegroundColor Yellow
git branch -M main

Write-Host ""
Write-Host "🚀 Repository setup complete!" -ForegroundColor Green
Write-Host ""
Write-Host "📋 Next steps:" -ForegroundColor Cyan
Write-Host "1. Create the repository on GitHub: https://github.com/new" -ForegroundColor White
Write-Host "   - Repository name: data-grid" -ForegroundColor Gray
Write-Host "   - Description: A powerful, feature-rich React DataTable component with TypeScript support" -ForegroundColor Gray
Write-Host "   - Make it public" -ForegroundColor Gray
Write-Host "   - Don't initialize with README (we already have one)" -ForegroundColor Gray
Write-Host ""
Write-Host "2. Push to GitHub:" -ForegroundColor White
Write-Host "   git push -u origin main" -ForegroundColor Gray
Write-Host ""
Write-Host "3. Set up npm publishing:" -ForegroundColor White
Write-Host "   npm login" -ForegroundColor Gray
Write-Host "   npm publish --access public" -ForegroundColor Gray
Write-Host ""
Write-Host "4. Enable GitHub Actions in your repository settings" -ForegroundColor White
Write-Host ""
Write-Host "5. Add npm token to GitHub secrets:" -ForegroundColor White
Write-Host "   - Go to repository Settings > Secrets and variables > Actions" -ForegroundColor Gray
Write-Host "   - Add secret: NPM_TOKEN (get from https://www.npmjs.com/settings/tokens)" -ForegroundColor Gray
Write-Host ""
Write-Host "✅ Your React Data Grid library is ready for GitHub!" -ForegroundColor Green
