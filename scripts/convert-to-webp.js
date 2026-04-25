const sharp = require('sharp');
const fs = require('fs');
const path = require('path');

const CARDS_DIR = path.join(__dirname, '../cards');
const QUALITY = 80;

const files = fs.readdirSync(CARDS_DIR).filter(f => f.endsWith('.jpg'));

(async () => {
  let converted = 0;
  for (const file of files) {
    const src = path.join(CARDS_DIR, file);
    const dest = path.join(CARDS_DIR, file.replace('.jpg', '.webp'));
    await sharp(src).webp({ quality: QUALITY }).toFile(dest);
    fs.unlinkSync(src);
    converted++;
    if (converted % 50 === 0) console.log(`${converted}/${files.length}`);
  }
  console.log(`Done: ${converted} files converted`);
})();
