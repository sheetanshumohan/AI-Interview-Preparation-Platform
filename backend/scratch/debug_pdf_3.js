const pdf = require('pdf-parse');
const buffer = Buffer.from('dummy');
try {
    pdf(buffer).then(res => console.log('Parsed with pdf(buffer)')).catch(e => console.log('pdf(buffer) failed:', e.message));
} catch (e) {
    console.log('pdf(buffer) threw:', e.message);
}

try {
    const parser = new pdf.PDFParse();
    console.log('PDFParse is a constructor');
} catch (e) {
    console.log('PDFParse is NOT a constructor:', e.message);
}
