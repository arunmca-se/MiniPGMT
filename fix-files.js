const fs = require('fs');

// Fix Dashboard.tsx
let dashboard = fs.readFileSync('src/components/Dashboard.tsx', 'utf8');
dashboard = dashboard.replace(/^`/gm, '').replace(/\`/g, '`');
fs.writeFileSync('src/components/Dashboard.tsx', dashboard);
console.log('Fixed Dashboard.tsx');

// Fix RecentIssues.tsx
let recent = fs.readFileSync('src/components/dashboard/RecentIssues.tsx', 'utf8');
recent = recent.replace(/^`/gm, '').replace(/\`/g, '`');
fs.writeFileSync('src/components/dashboard/RecentIssues.tsx', recent);
console.log('Fixed RecentIssues.tsx');
