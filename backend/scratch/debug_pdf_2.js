const pdf = require('pdf-parse');
console.log('Keys:', Object.keys(pdf));
if (typeof pdf === 'function') {
    console.log('pdf is a function');
} else {
    console.log('pdf is an object');
}
