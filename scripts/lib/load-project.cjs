// Small TypeScript loader for operational checks; never bundled into the app.
const fs = require('node:fs'), path = require('node:path'), ts = require('typescript');
module.exports = function projectLoader(overrides = {}) {
  const cache = new Map();
  function load(name) {
    if (Object.hasOwn(overrides, name)) return overrides[name];
    if (name === 'server-only') return {};
    let file = name.startsWith('@/') ? path.resolve(name.slice(2)) : name;
    if (!path.isAbsolute(file)) return require(file);
    if (!path.extname(file)) file += '.ts';
    const alias = '@/'+path.relative(process.cwd(),file).replaceAll(path.sep,'/').replace(/\.ts$/, '');
    if (Object.hasOwn(overrides, alias)) return overrides[alias];
    if (file.endsWith('.json')) return JSON.parse(fs.readFileSync(file, 'utf8'));
    if (cache.has(file)) return cache.get(file).exports;
    const m = { exports: {} }; cache.set(file, m);
    const code = ts.transpileModule(fs.readFileSync(file, 'utf8'), { compilerOptions: { module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2022, esModuleInterop: true } }).outputText;
    new Function('require', 'module', 'exports', code)(s => load(s.startsWith('.') ? path.resolve(path.dirname(file), s) : s), m, m.exports);
    return m.exports;
  }
  return load;
};
