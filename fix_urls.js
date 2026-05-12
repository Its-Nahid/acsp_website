const fs = require('fs');
const path = require('path');

const frontendDir = path.join(__dirname, 'Frontend');

function processFile(filePath) {
    let content = fs.readFileSync(filePath, 'utf8');
    
    // Check if the file contains the target
    if (!content.includes('http://localhost:5000')) return;

    // We don't want to replace the definition itself
    // so we handle lines individually or use regex
    const lines = content.split('\n');
    let changed = false;

    for (let i = 0; i < lines.length; i++) {
        let line = lines[i];
        
        // Skip lines that are defining API_BASE or isLocal
        if (line.includes('const API_BASE') || line.includes('isLocal ?') || line.includes('window.API_BASE')) {
            continue;
        }

        if (line.includes('http://localhost:5000')) {
            // Replace 'http://localhost:5000/...' with `${window.API_BASE}/...`
            // Case 1: 'http://localhost:5000/...'
            line = line.replace(/'http:\/\/localhost:5000([^']*)'/g, "`${window.API_BASE}$1`");
            
            // Case 2: "http://localhost:5000/..."
            line = line.replace(/"http:\/\/localhost:5000([^"]*)"/g, "`${window.API_BASE}$1`");
            
            // Case 3: `http://localhost:5000/...`
            line = line.replace(/`http:\/\/localhost:5000([^`]*)`/g, "`${window.API_BASE}$1`");
            
            // Case 4: http://localhost:5000 inside an already existing template literal or string concats
            // Wait, if it's `http://localhost:5000/${foo}`, the previous regex Case 3 handles it by capturing `/${foo}`
            // What if it's 'http://localhost:5000/' + imgPath?
            // The Case 1 handles `'http://localhost:5000/'` -> "`${window.API_BASE}/`"
            
            // Any leftover naked http://localhost:5000 not surrounded by quotes? Unlikely in valid JS, maybe in HTML attributes?
            // E.g., <img src="http://localhost:5000/..."
            // Case 2 will convert it to <img src="`${window.API_BASE}/...`". Wait, if it's in HTML outside of a script tag!
            // Let's check if there are any HTML-level http://localhost:5000 (not inside <script>)
            // Actually, in the project, most fetches are inside <script> tags.
            
            lines[i] = line;
            changed = true;
        }
    }

    if (changed) {
        fs.writeFileSync(filePath, lines.join('\n'), 'utf8');
        console.log(`Updated: ${filePath}`);
    }
}

function traverseDir(dir) {
    const files = fs.readdirSync(dir);
    for (const file of files) {
        const fullPath = path.join(dir, file);
        if (fs.statSync(fullPath).isDirectory()) {
            traverseDir(fullPath);
        } else if (fullPath.endsWith('.html') || fullPath.endsWith('.js')) {
            processFile(fullPath);
        }
    }
}

traverseDir(frontendDir);
console.log('Done!');
