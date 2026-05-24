const pdf = require('pdf-parse');
console.log('Keys:', Object.keys(pdf));
for (const key in pdf) {
    console.log(key, 'type:', typeof pdf[key]);
}
if (typeof pdf === 'function') console.log('Top level is function');
