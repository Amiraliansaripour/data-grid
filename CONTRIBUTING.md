# Contributing to React Data Grid

Thank you for considering contributing to React Data Grid! We welcome contributions from the community.

## 📋 Table of Contents

- [Code of Conduct](#code-of-conduct)
- [Getting Started](#getting-started)
- [Development Process](#development-process)
- [Submitting Changes](#submitting-changes)
- [Style Guidelines](#style-guidelines)
- [Testing](#testing)
- [Documentation](#documentation)

## 📜 Code of Conduct

This project and everyone participating in it is governed by our Code of Conduct. By participating, you are expected to uphold this code.

## 🚀 Getting Started

### Prerequisites

- Node.js (v18 or higher)
- npm or yarn
- Git

### Setup Development Environment

1. Fork the repository
2. Clone your fork:
   ```bash
   git clone https://github.com/Amiraliansaripour/data-grid.git
   cd data-grid
   ```

3. Install dependencies:
   ```bash
   npm install --legacy-peer-deps
   ```

4. Start development server:
   ```bash
   npm run dev
   ```

## 🔄 Development Process

### Branch Naming

- `feature/description` - New features
- `bugfix/description` - Bug fixes
- `hotfix/description` - Critical fixes
- `docs/description` - Documentation updates

### Commit Messages

We follow [Conventional Commits](https://www.conventionalcommits.org/):

- `feat: add new filtering feature`
- `fix: resolve pagination bug`
- `docs: update README with examples`
- `style: fix code formatting`
- `refactor: optimize data processing`
- `test: add unit tests for filters`

## 📝 Submitting Changes

### Pull Request Process

1. Create a feature branch from `main`
2. Make your changes
3. Add tests for new functionality
4. Ensure all tests pass:
   ```bash
   npm test
   npm run type-check
   npm run lint
   ```
5. Update documentation if needed
6. Submit a pull request

### Pull Request Template

```markdown
## Description
Brief description of changes

## Type of Change
- [ ] Bug fix
- [ ] New feature
- [ ] Breaking change
- [ ] Documentation update

## Testing
- [ ] Tests pass
- [ ] New tests added
- [ ] Manual testing completed

## Checklist
- [ ] Code follows style guidelines
- [ ] Self-review completed
- [ ] Documentation updated
- [ ] No console logs left
```

## 🎨 Style Guidelines

### TypeScript

- Use TypeScript for all new code
- Follow existing type definitions
- Add proper JSDoc comments for public APIs
- Use strict type checking

### Code Style

- Use 2 spaces for indentation
- Use single quotes for strings
- Add trailing commas
- Follow existing patterns

### Component Guidelines

- Use functional components with hooks
- Use proper prop types
- Add default props where appropriate
- Follow naming conventions

## 🧪 Testing

### Writing Tests

- Write unit tests for new functionality
- Use Jest and React Testing Library
- Aim for high test coverage
- Test edge cases and error conditions

### Running Tests

```bash
npm test              # Run all tests
npm run test:watch    # Run tests in watch mode
npm run test:ui       # Run tests with UI
npm run coverage      # Generate coverage report
```

## 📚 Documentation

### Code Documentation

- Add JSDoc comments for all public APIs
- Include parameter and return type information
- Provide usage examples
- Document complex logic

### README Updates

- Update README for new features
- Add examples for new functionality
- Keep installation instructions current
- Update API documentation

## 🐛 Reporting Bugs

### Before Submitting

- Check existing issues
- Ensure bug is reproducible
- Gather relevant information

### Bug Report Template

```markdown
**Describe the bug**
Clear description of the bug

**To Reproduce**
Steps to reproduce the behavior

**Expected behavior**
What you expected to happen

**Screenshots**
If applicable, add screenshots

**Environment:**
- OS: [e.g. iOS]
- Browser: [e.g. chrome, safari]
- Version: [e.g. 22]
- Node.js version
- Package version

**Additional context**
Any other context about the problem
```

## 💡 Feature Requests

### Before Submitting

- Check if feature already exists
- Consider if it fits project scope
- Think about implementation approach

### Feature Request Template

```markdown
**Is your feature request related to a problem?**
Clear description of the problem

**Describe the solution you'd like**
Clear description of desired solution

**Describe alternatives you've considered**
Alternative solutions considered

**Additional context**
Any other context about the feature
```

## 🏷️ Release Process

### Versioning

We use [Semantic Versioning](https://semver.org/):

- **MAJOR**: Breaking changes
- **MINOR**: New features (backward compatible)
- **PATCH**: Bug fixes (backward compatible)

### Release Steps

1. Update version in `package.json`
2. Update `CHANGELOG.md`
3. Create release tag
4. GitHub Actions will handle publishing

## 📞 Getting Help

- 📖 [Documentation](README.md)
- 🐛 [Issues](https://github.com/Amiraliansaripour/data-grid/issues)
- 💬 [Discussions](https://github.com/Amiraliansaripour/data-grid/discussions)

## 🙏 Recognition

Contributors will be recognized in:
- README.md contributors section
- Release notes
- Project documentation

Thank you for contributing! 🎉
