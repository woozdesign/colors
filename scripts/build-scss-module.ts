const fs = require('fs');
const path = require('path');

// Import all colors from the respective modules
const allColors = { ...require('../dist/light_hex.js'), ...require('../dist/dark_hex.js') };

const outputDir = './dist'; // Modify this as needed

let lightContent = ':root, .light, .light-theme {\n';
let darkContent = '.dark, .dark-theme {\n';

for (const colorNameWithTheme in allColors) {
  const isLight = colorNameWithTheme.endsWith('_light');
  const isDark = colorNameWithTheme.endsWith('_dark');

  if (isLight) {
    const colorName = colorNameWithTheme.replace('_light', '');
    generateScssFile(allColors[colorNameWithTheme], 'light', colorName);
  } else if (isDark) {
    const colorName = colorNameWithTheme.replace('_dark', '');
    generateScssFile(allColors[colorNameWithTheme], 'dark', colorName);
  }
}

function generateScssFile(colorObj, theme, colorName) {
  let content = '';

  for (const shade in colorObj) {
    // Generate variables for colors
    const variableName = `$color-${colorName}-${shade}: ${colorObj[shade]};\n`;
    content += variableName;
  }

  content += '\n';

  switch (theme) {
    case 'light':
      content += lightContent;
      break;
    case 'dark':
      content += darkContent;
      break;
  }

  for (const shade in colorObj) {
    // Generate CSS custom properties (variables) using SCSS
    content += `  --color-${colorName}-${shade}: #{$color-${colorName}-${shade}};\n`;
  }

  content += '}\n';

  // Ensure output directory exists
  if (!fs.existsSync(outputDir)) {
    fs.mkdirSync(outputDir, { recursive: true });
  }

  // Write SCSS file
  fs.writeFileSync(path.join(outputDir, `${colorName}-${theme}.scss`), content);
}

// Generate the main colors.scss that imports all the individual files
let importContent = '';

Object.keys(allColors).forEach((colorNameWithTheme) => {
  const isLight = colorNameWithTheme.endsWith('_light');
  const isDark = colorNameWithTheme.endsWith('_dark');
  const baseColorName = isLight ? colorNameWithTheme.replace('_light', '') : colorNameWithTheme.replace('_dark', '');

  if (isLight) {
    importContent += `@import "${baseColorName}-light.scss";\n`;
  } else if (isDark) {
    importContent += `@import "${baseColorName}-dark.scss";\n`;
  }
});

// Write main colors.scss file
fs.writeFileSync(path.join(outputDir, 'colors.scss'), importContent);

const sass = require('sass');

// Compile the SCSS to CSS
const result = sass.renderSync({
  file: path.join(outputDir, 'colors.scss'),
});

// Write the compiled CSS to a file
fs.writeFileSync(path.join(outputDir, 'colors.css'), result.css);
