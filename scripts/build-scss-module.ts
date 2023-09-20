const fs = require('fs');
const path = require('path');

// Import color themes
const { gray, ...otherColorsLight } = require('../dist/light');
const { grayDark, ...otherColorsDark } = require('../dist/dark');

const outputDir = './dist'; // Modify this as needed
let importStatements = ''; // This will accumulate all import statements for the colors.scss

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

// Write the accumulated import statements into colors.scss
fs.writeFileSync(path.join(outputDir, 'colors.scss'), importStatements);

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

  // Write individual SCSS file
  const filename = `${colorName}-${theme}.scss`;
  fs.writeFileSync(path.join(outputDir, filename), content);

  // Add an import statement for this file to the colors.scss content
  importStatements += `@import "${filename}";\n`;
}
