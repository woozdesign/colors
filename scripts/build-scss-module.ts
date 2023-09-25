const fs = require('fs');
const path = require('path');
const sass = require('sass');

const allColors = { ...require('../dist/light.js'), ...require('../dist/dark.js') };
const outputDir = './dist';

const themes = {
  light: ':root, .light, .light-theme {\n',
  dark: '.dark, .dark-theme {\n',
};

function generateScssFile(colorObj, theme, colorName) {
  let content = '';
  let _colorName = colorName.replace('A', '');
  let themeContent = themes[theme];

  for (const shade in colorObj) {
    let modifiedShade = shade.replace(_colorName, '').replace('A', 'a');
    content += `$color-${_colorName}-${modifiedShade}: ${colorObj[shade]};\n`;
  }

  content += `\n${themeContent}`;

  for (const shade in colorObj) {
    let modifiedShade = shade.replace(_colorName, '').replace('A', 'a');
    content += `  --color-${_colorName}-${modifiedShade}: #{$color-${_colorName}-${modifiedShade}};\n`;
  }

  content += '}\n';
  ensureDirExists(outputDir);
  fs.writeFileSync(path.join(outputDir, `${colorName}-${theme}.scss`), content);
}

function ensureDirExists(dir) {
  if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
}

function main() {
  let importContent = '';

  for (const colorNameWithTheme in allColors) {
    const theme = colorNameWithTheme.endsWith('_light') ? 'light' : 'dark';
    const colorName = colorNameWithTheme.replace(`_${theme}`, '');
    generateScssFile(allColors[colorNameWithTheme], theme, colorName);
    importContent += `@import "${colorName}-${theme}.scss";\n`;
  }

  fs.writeFileSync(path.join(outputDir, 'colors.scss'), importContent);
  const result = sass.renderSync({ file: path.join(outputDir, 'colors.scss') });
  fs.writeFileSync(path.join(outputDir, 'colors.css'), result.css);
}

main();
