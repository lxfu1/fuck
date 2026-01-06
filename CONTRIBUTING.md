# Contributing to Insight Studio

Thank you for your interest in contributing to Insight Studio! This document provides guidelines and instructions for contributing.

## Development Setup

1. **Fork and Clone**
   ```bash
   git clone https://github.com/your-username/insight-studio.git
   cd insight-studio
   ```

2. **Install Dependencies**
   ```bash
   pnpm install
   ```

3. **Create a Branch**
   ```bash
   git checkout -b feat/your-feature-name
   # or
   git checkout -b fix/your-bug-fix
   ```

## Development Workflow

1. **Make Your Changes**
   - Write clean, readable code
   - Follow existing code style and patterns
   - Add comments for complex logic
   - Update documentation as needed

2. **Test Your Changes**
   ```bash
   # Build all packages
   pnpm build
   
   # Run in development mode
   pnpm dev
   ```

3. **Commit Your Changes**
   ```bash
   git add .
   git commit -m "feat: add new feature"
   ```

   Follow [Conventional Commits](https://www.conventionalcommits.org/):
   - `feat:` new feature
   - `fix:` bug fix
   - `docs:` documentation changes
   - `style:` formatting, missing semicolons, etc.
   - `refactor:` code refactoring
   - `test:` adding tests
   - `chore:` maintenance tasks

4. **Push and Create PR**
   ```bash
   git push origin feat/your-feature-name
   ```
   Then create a Pull Request on GitHub.

## Code Style

- **TypeScript**: Use strict mode
- **Formatting**: Consistent with existing code
- **Naming**: 
  - camelCase for variables and functions
  - PascalCase for classes and components
  - UPPER_CASE for constants
- **Comments**: Add JSDoc comments for public APIs

## Project Structure

```
packages/
├── shared/       # Shared types and utilities
├── sdk/          # React/Vue SDKs
├── server/       # Backend API
└── web-app/      # Frontend application
```

## Adding New Features

### 1. New Chart Type

1. Add type to `packages/shared/src/types/chart.ts`
2. Update `CHART_TYPE_TO_LIBRARY` in `packages/shared/src/constants.ts`
3. Implement in `packages/server/src/services/chart.service.ts`
4. Test with SDK

### 2. New API Endpoint

1. Add types to `packages/shared/src/types/api.ts`
2. Create controller in `packages/server/src/controllers/`
3. Create service in `packages/server/src/services/`
4. Add route in `packages/server/src/routes/`
5. Register in `packages/server/src/index.ts`
6. Update API client in `packages/sdk/src/client/api-client.ts`

### 3. New SDK Feature

1. Add to API client: `packages/sdk/src/client/api-client.ts`
2. Add React hook: `packages/sdk/src/react/hooks/`
3. Add Vue composable: `packages/sdk/src/vue/`
4. Update documentation

## Testing

Currently, the project uses manual testing. Automated tests are planned:

```bash
# Planned commands
pnpm test           # Run all tests
pnpm test:unit      # Unit tests
pnpm test:e2e       # E2E tests
pnpm test:coverage  # Coverage report
```

## Documentation

- Update README.md for major changes
- Update API.md for API changes
- Update SDK.md for SDK changes
- Add JSDoc comments for new functions
- Update ARCHITECTURE.md for architectural changes

## Pull Request Guidelines

1. **Title**: Clear and descriptive
   - Good: "feat: add trend prediction API"
   - Bad: "update files"

2. **Description**: 
   - What changes were made?
   - Why were they made?
   - How to test?

3. **Checklist**:
   - [ ] Code builds successfully
   - [ ] Follows code style guidelines
   - [ ] Documentation updated
   - [ ] No console errors or warnings
   - [ ] Tested manually

## Package-Specific Guidelines

### shared

- Keep types generic and reusable
- No runtime code dependencies
- Well-documented interfaces

### sdk

- Maintain backward compatibility
- Support both React and Vue equally
- Provide TypeScript types
- Handle errors gracefully

### server

- Use Express best practices
- Validate input data
- Return consistent API responses
- Log errors appropriately
- Handle edge cases

### web-app

- Responsive design
- Accessible UI
- Fast performance
- Clean component structure

## Common Issues

### TypeScript Errors

- Use explicit types for Express Router
- Import types with `import type`
- Check for missing type exports

### Build Failures

- Run `pnpm clean` and rebuild
- Check for circular dependencies
- Verify package.json exports

### SDK Issues

- Ensure peer dependencies are installed
- Check TypeScript configuration
- Verify module resolution

## Getting Help

- **Questions**: Open a Discussion on GitHub
- **Bugs**: Open an Issue with reproduction steps
- **Features**: Open an Issue with detailed proposal
- **Security**: Email security@insight-studio.ai

## Code of Conduct

- Be respectful and inclusive
- Welcome newcomers
- Focus on constructive feedback
- Help others learn and grow

## Recognition

Contributors will be acknowledged in:
- README.md contributors section
- Release notes
- Project documentation

Thank you for contributing to Insight Studio! 🎉
