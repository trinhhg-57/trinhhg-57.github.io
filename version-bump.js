const fs = require('fs');

const indexJsPath = './index.js';
const packageJsonPath = './package.json';

let indexContent = fs.readFileSync(indexJsPath, 'utf8');
let packageJson = JSON.parse(fs.readFileSync(packageJsonPath, 'utf8'));

let versionMatch = indexContent.match(/from '\.\/account\.js\?v=(\d+)'/);
let currentVersion = versionMatch ? parseInt(versionMatch[1]) : 0;
let newVersion = currentVersion + 1;

indexContent = indexContent.replace(/from '\.\/account\.js\?v=\d+'/, `from './account.js?v=${newVersion}'`);
fs.writeFileSync(indexJsPath, indexContent, 'utf8');

packageJson.version = `1.0.${newVersion}`;
fs.writeFileSync(packageJsonPath, JSON.stringify(packageJson, null, 2), 'utf8');

console.log(`Version bumped to v1.0.${newVersion}`);
