const fs = require('fs');

const sourceFiles = {
  dark: '../dist/dark.js',
  light: '../dist/light.js',
};

// Function to convert HSL to Hex
function hslToHex(h, s, l) {
  l /= 100;
  s /= 100;
  const a = s * Math.min(l, 1 - l);
  const f = (n) => {
    const k = (n + h / 30) % 12;
    const color = l - a * Math.max(Math.min(k - 3, 9 - k, 1), -1);
    return Math.round(255 * color)
      .toString(16)
      .padStart(2, '0');
  };
  return `#${f(0)}${f(8)}${f(4)}`;
}

// Function to convert color object from HSL to Hex
function convertColorObject(colorObject) {
  return Object.fromEntries(
    Object.entries(colorObject).map(([key, hslValue]) => {
      const [_, h, s, l] = hslValue.match(/hsl\((\d+),\s*(\d+\.?\d*)%,\s*(\d+\.?\d*)%\)/) || [];
      return [key, h && s && l ? hslToHex(Number(h), Number(s), Number(l)) : hslValue];
    }),
  );
}

// Loop over source files
for (const [name, path] of Object.entries(sourceFiles)) {
  // Import source file dynamically
  const colors = require(path);

  // Convert color objects and prepare content
  const convertedColors = Object.entries(colors)
    .map(([colorName, colorObject]) => {
      return `export const ${colorName} = ${JSON.stringify(convertColorObject(colorObject), null, 2)};`;
    })
    .join('\n\n');

  // Write to new corresponding file
  fs.writeFile(`./src/${name}_hex.ts`, convertedColors, (err) => {
    if (err) throw err;
    console.log(`Converted HSL to Hex and written to ${name}_hex.ts`);
  });
}
