![Thumbnail](/images/thumbnail.png)

# GitReader

Discover and explore README files from GitHub repositories. Search by keywords, browse trending projects, and dive deep into documentation. Search for repositories by name, topic, or technology. Click on any repository to view its README file with full markdown rendering and syntax highlighting.

## Features
- 🔍 **Search GitHub repositories** by name, topic, or technology
- 📄 **View README files** with full markdown rendering and syntax highlighting
- 🏷️ **Keyword suggestions** for popular and trending topics
- 🌗 **Light/Dark mode** for comfortable reading
- ⚡ **Fast and modern UI** powered by React, Vite, and Tailwind CSS

## Getting Started

### Prerequisites
- [Node.js](https://nodejs.org/) (v18 or newer recommended)
- [npm](https://www.npmjs.com/) (comes with Node.js)

### Installation

1. **Clone the repository:**
   ```bash
   git clone https://github.com/your-username/github-readme-search.git
   cd github-readme-search
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Start the development server:**
   ```bash
   npm run dev
   ```
   The app will be available at [http://localhost:5173](http://localhost:5173) (or the port shown in your terminal).

### Build for Production
To build the app for production:
```bash
npm run build
```
The output will be in the `dist` folder. You can preview the production build locally with:
```bash
npm run preview
```

## Notes
- **No API key required:** All features use the public GitHub API. Unauthenticated requests are subject to GitHub's rate limits (60 requests/hour per IP). If you hit the rate limit, please wait and try again later.
- **Markdown rendering:** README files are rendered with full markdown support and syntax highlighting for code blocks.

## Open Source & Contributing

We welcome contributions from the community! If you have ideas for new features, bug fixes, or improvements, please contribute.

### How to Contribute
1. **Fork the repository** on GitHub.
2. **Clone your fork** locally:
   ```bash
   git clone https://github.com/JumpStartFlows/GitReader.git
   cd GitReader
   ```
3. **Create a new branch** for your feature or fix:
   ```bash
   git checkout -b your-feature-branch
   ```
4. **Make your changes** and commit them with clear messages.
5. **Push your branch** to your fork:
   ```bash
   git push origin your-feature-branch
   ```
6. **Open a Pull Request (PR)** from your branch to the `main` branch of this repository. Please describe your changes and reference any related issues.

### Guidelines
- Please keep your code clean and follow the existing style.
- For major changes, open an issue first to discuss what you would like to change.
- Make sure to test your changes before submitting a PR.

Thank you for helping make GitReader better!

## License
[MIT](LICENSE)

<meta property="og:image" content="https://raw.githubusercontent.com/JumpStartFlows/GitReader/main/public/images/thumbnail.png">