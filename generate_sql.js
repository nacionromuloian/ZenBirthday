const fs = require('fs');

function parseCSV(content) {
    const rows = [];
    let currentRow = [];
    let currentField = '';
    let inQuotes = false;

    for (let i = 0; i < content.length; i++) {
        const char = content[i];
        const nextChar = content[i + 1];

        if (inQuotes) {
            if (char === '"' && nextChar === '"') {
                currentField += '"';
                i++; // skip next quote
            } else if (char === '"') {
                inQuotes = false;
            } else {
                currentField += char;
            }
        } else {
            if (char === '"') {
                inQuotes = true;
            } else if (char === ',') {
                currentRow.push(currentField);
                currentField = '';
            } else if (char === '\n' || char === '\r') {
                if (char === '\r' && nextChar === '\n') i++;
                currentRow.push(currentField);
                rows.push(currentRow);
                currentRow = [];
                currentField = '';
            } else {
                currentField += char;
            }
        }
    }
    if (currentRow.length > 0 || currentField.length > 0) {
        currentRow.push(currentField);
        rows.push(currentRow);
    }
    return rows;
}

const content = fs.readFileSync('rsvps.csv.csv', 'utf8');
const allRows = parseCSV(content);
const headers = allRows[0];
const dataRows = allRows.slice(1);

const sql = dataRows.map(row => {
    if (row.length < 6) return null;
    const [id, name, category, attending, car, wish, created_at] = row;
    if (!name) return null;
    
    const escape = (str) => str ? str.replace(/'/g, "''") : '';
    
    return `('${escape(name)}', '${escape(category)}', '${escape(attending)}', '${escape(car)}', '${escape(wish)}', '${escape(created_at)}')`;
}).filter(Boolean).join(',\n');

console.log(`INSERT INTO rsvps (guest_name, category, attending, car, wish, created_at)
VALUES
${sql}
ON CONFLICT (guest_name) DO UPDATE SET
    category = EXCLUDED.category,
    attending = EXCLUDED.attending,
    car = EXCLUDED.car,
    wish = EXCLUDED.wish,
    created_at = EXCLUDED.created_at;`);
