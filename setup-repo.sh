#!/bin/bash

# GitHub Repository Setup Script for React Data Grid
# Author: Amirali Ansaripour
# Repository: https://github.com/Amiraliansaripour/data-grid

echo "🚀 Setting up React Data Grid repository..."

# Check if we're in the right directory
if [ ! -f "package.json" ]; then
    echo "❌ Error: package.json not found. Please run this script from the project root."
    exit 1
fi

# Initialize git repository if not already initialized
if [ ! -d ".git" ]; then
    echo "📁 Initializing Git repository..."
    git init
fi

# Set remote origin
echo "🔗 Setting up remote origin..."
git remote remove origin 2>/dev/null || true
git remote add origin https://github.com/Amiraliansaripour/data-grid.git

# Create .gitignore if it doesn't exist
if [ ! -f ".gitignore" ]; then
    echo "📝 Creating .gitignore..."
    cat > .gitignore << EOF
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
EOF
fi

# Create GitHub Actions directory structure
mkdir -p .github/workflows

# Set up initial commit
echo "📦 Adding files to git..."
git add .

echo "💾 Creating initial commit..."
git commit -m "🎉 Initial commit: React Data Grid library

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
Repository: https://github.com/Amiraliansaripour/data-grid"

echo "🌿 Setting up main branch..."
git branch -M main

echo "🚀 Repository setup complete!"
echo ""
echo "📋 Next steps:"
echo "1. Create the repository on GitHub: https://github.com/new"
echo "   - Repository name: data-grid"
echo "   - Description: A powerful, feature-rich React DataTable component with TypeScript support"
echo "   - Make it public"
echo "   - Don't initialize with README (we already have one)"
echo ""
echo "2. Push to GitHub:"
echo "   git push -u origin main"
echo ""
echo "3. Set up npm publishing:"
echo "   npm login"
echo "   npm publish --access public"
echo ""
echo "4. Enable GitHub Actions in your repository settings"
echo ""
echo "5. Add npm token to GitHub secrets:"
echo "   - Go to repository Settings > Secrets and variables > Actions"
echo "   - Add secret: NPM_TOKEN (get from https://www.npmjs.com/settings/tokens)"
echo ""
echo "✅ Your React Data Grid library is ready for GitHub!"
