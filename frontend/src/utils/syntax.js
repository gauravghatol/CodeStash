// Map display language names to highlight.js language keys
const MAP = new Map([
  ['JavaScript', 'javascript'],
  ['TypeScript', 'typescript'],
  ['JSX', 'jsx'],
  ['TSX', 'tsx'], // fallback may be limited; if not supported, code will still render
  ['Python', 'python'],
  ['Java', 'java'],
  ['C', 'c'],
  ['C++', 'cpp'],
  ['C#', 'csharp'],
  ['Go', 'go'],
  ['Rust', 'rust'],
  ['PHP', 'php'],
  ['Ruby', 'ruby'],
  ['Kotlin', 'kotlin'],
  ['Swift', 'swift'],
  ['Dart', 'dart'],
  ['R', 'r'],
  ['Scala', 'scala'],
  ['Elixir', 'elixir'],
  ['Haskell', 'haskell'],
  ['Lua', 'lua'],
  ['Perl', 'perl'],
  ['Solidity', 'solidity'],
  ['SQL', 'sql'],
  ['GraphQL', 'graphql'],
  ['HTML', 'xml'],
  ['CSS', 'css'],
  ['Sass', 'scss'],
  ['Less', 'less'],
  ['Tailwind', 'css'],
  ['Shell', 'bash'],
  ['Bash', 'bash'],
  ['PowerShell', 'powershell'],
  ['Batchfile', 'dos'],
  ['YAML', 'yaml'],
  ['JSON', 'json'],
  ['Markdown', 'markdown'],
  ['INI', 'ini'],
  ['TOML', 'toml'],
  ['XML', 'xml'],
  ['CSV', 'plaintext'],
  ['Makefile', 'makefile'],
  ['Dockerfile', 'dockerfile'],
  ['Nginx', 'nginx'],
  ['Apache', 'apache'],
]);

export function languageToHLJS(language = '') {
  if (!language) return 'plaintext';
  const key = MAP.get(language) || language.toLowerCase();
  return key;
}
