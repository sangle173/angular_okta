# Copilot Instructions

<!-- Use this file to provide workspace-specific custom instructions to Copilot. For more details, visit https://code.visualstudio.com/docs/copilot/copilot-customization#_use-a-githubcopilotinstructionsmd-file -->

## Project Overview
This is an Angular project with TypeScript. The project uses:
- Angular CLI for project scaffolding and build tooling
- TypeScript for type-safe development
- Zoneless architecture (experimental feature)
- Standalone components
- Angular Router for navigation
- CSS for styling

## Development Guidelines
- Use standalone components instead of modules when possible
- Follow Angular style guide and best practices
- Use TypeScript strict mode
- Prefer reactive patterns with RxJS
- Use Angular CLI for generating components, services, and other artifacts
- Follow component-based architecture
- Use proper lifecycle hooks and change detection strategies

## Code Style
- Use Angular naming conventions (kebab-case for selectors, camelCase for properties)
- Write unit tests for components and services
- Use Angular's dependency injection system
- Prefer OnPush change detection strategy when appropriate
- Use async pipe for handling observables in templates

## Common Commands
- `ng serve` - Start development server
- `ng build` - Build the project
- `ng test` - Run unit tests
- `ng generate component <name>` - Generate new component
- `ng generate service <name>` - Generate new service
