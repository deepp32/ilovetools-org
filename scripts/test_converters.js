const xlsx = require('xlsx');
console.log('XLSX loaded:', xlsx.version);
const wb = xlsx.utils.book_new();
const ws = xlsx.utils.aoa_to_sheet([['Header 1', 'Header 2'], ['Value 1', 'Value 2']]);
xlsx.utils.book_append_sheet(wb, ws, 'Sheet1');
const buf = xlsx.write(wb, { type: 'buffer', bookType: 'xlsx' });
console.log('Excel file generated, size:', buf.length, 'bytes');
