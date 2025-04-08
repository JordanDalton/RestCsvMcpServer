import path from 'path';
import fs from 'fs';

const filePath = path.join(process.cwd(), 'build', 'index.js');

// look for any env variables inside the file
const envVariables = [];

// Read the file
const fileContent = fs.readFileSync(filePath, 'utf-8');

// Find all env variables
const envRegex = /process\.env\.(\w+)/g;
let match;
while ((match = envRegex.exec(fileContent)) !== null) {
    envVariables.push({ [match[1]]: '<REPLACE>' });
}

const structure = {
    mcpServers : {
        "my-mcp" : {
            command : "node",
            args : [filePath],
            env : envVariables
        }
    }
}

console.log('Copy/Paste into your MCP client:');
console.log(
    JSON.stringify(structure, null, 2)
);
