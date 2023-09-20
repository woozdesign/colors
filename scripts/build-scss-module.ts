const fs = require('fs');
const path = require('path');

// Import color themes
const { gray, ...otherColorsLight } = require('../src/light.ts');
const { grayDark, ...otherColorsDark } = require('../src/dark.ts');

const outputDir = './dist'; // Modify this as needed

// Generate SCSS for light theme
generateScssFile(gray, 'light', 'gray');
for (const colorName in otherColorsLight) {
  generateScssFile(otherColorsLight[colorName], 'light', colorName);
}

// Generate SCSS for dark theme
generateScssFile(grayDark, 'dark', 'gray');
for (const colorName in otherColorsDark) {
  generateScssFile(otherColorsDark[colorName], 'dark', colorName);
}

function generateScssFile(colorObj, theme, colorName) {
  let content = '';
  for (const shade in colorObj) {
    const variableName = `$${colorName}-${shade}: ${colorObj[shade]};\n`;
    content += variableName;
  }

  // Ensure output directory exists
  if (!fs.existsSync(outputDir)) {
    fs.mkdirSync(outputDir, { recursive: true });
  }

  // Write SCSS file
  fs.writeFileSync(path.join(outputDir, `${colorName}-${theme}.scss`), content);
}
