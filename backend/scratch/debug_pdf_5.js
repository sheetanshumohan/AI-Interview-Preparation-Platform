const { PDFParse } = require('pdf-parse');
const buffer = Buffer.from('dummy');
try {
    PDFParse(buffer).then(res => {
        console.log('PDFParse(buffer) worked!');
        console.log('Result keys:', Object.keys(res));
    }).catch(e => {
        console.log('PDFParse(buffer) failed:', e.message);
    });
} catch (e) {
    console.log('PDFParse(buffer) threw:', e.message);
}
