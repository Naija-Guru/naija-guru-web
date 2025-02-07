import fse from 'fs-extra';
import { resolve, join } from 'path';
// import tailwindConfig from '../tailwind.config.js';

const { readdir, stat: _stat, readFile, writeFile } = fse;

const firstRegex = /className=["'{][cn({`]*([\s\S]*?)[`'})]+["'}]/gm;
// Use backticks ` for any string that is not a class inside className
const secondRegex = /['"]([^'"]+)['"]/gm;

function getTailwindPrefix() {
  return '';
  // return tailwindConfig?.prefix ?? '';
}

function escapeRegExp(string) {
  return string.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

function replaceLast(str, pattern, replacement) {
  const match =
    typeof pattern === 'string'
      ? pattern
      : (str.match(new RegExp(pattern.source, 'g')) || []).slice(-1)[0];
  if (!match) return str;
  const last = str.lastIndexOf(match);
  return last !== -1
    ? `${str.slice(0, last)}${replacement}${str.slice(last + match.length)}`
    : str;
}

/**
 * Function to add the Tailwind prefix to a CSS class
 * @param str
 * @param newPrefix
 * @param oldPrefix
 * @returns
 */
function replacement(str, newPrefix, oldPrefix) {
  // If the old prefix is present, replace it with the new one
  if (
    oldPrefix &&
    (str.startsWith(oldPrefix) ||
      str.startsWith(`-${oldPrefix}`) ||
      str.startsWith(`!${oldPrefix}`) ||
      str.includes(`:${oldPrefix}`))
  ) {
    return str.replace(oldPrefix, newPrefix);
  }
  // Otherwise, add the new prefix only if it's not already applied
  if (str.includes(':')) {
    return !str.includes(`:${newPrefix}`)
      ? replaceLast(str, ':', `:${newPrefix}`)
      : str;
  }
  if (str.includes('!')) {
    return !str.includes(`!${newPrefix}`)
      ? str.replace('!', `!${newPrefix}`)
      : str;
  }
  if (str.startsWith('-')) {
    return !str.startsWith(`-${newPrefix}`)
      ? str.replace('-', `-${newPrefix}`)
      : str;
  }
  return !str.startsWith(newPrefix) ? `${newPrefix}${str}` : str;
}

/**
 * Function to modify CSS classes in a file
 * @param content - file content
 * @param newPrefix - prefix to add
 * @param oldPrefix - prefix to replace
 * @returns
 */
function updateTailwindClasses(content, newPrefix, oldPrefix) {
  let newContent = content;
  let classNameValues = [];
  let distinctClassNames = new Map();

  // Retrieve the CSS classes defined in the "className" attributes
  const classNameAttributes = newContent.match(firstRegex) ?? [];
  classNameAttributes.map((match) => {
    classNameValues = [...classNameValues, ...(match.match(secondRegex) ?? [])];
  });

  // Keep only the unique class values
  classNameValues.map((classNameValue) =>
    classNameValue
      .replaceAll("'", '')
      .split(' ')
      .map((className) => {
        if (!distinctClassNames.has(className)) {
          distinctClassNames.set(className, className);
        }
      })
  );

  // Modify the file content
  [...distinctClassNames.values()].forEach((className) => {
    // This RegExp avoids adding the prefix twice in the same place
    const regExp = new RegExp(
      `(?<=[' ])${escapeRegExp(className)}(?=[' ])`,
      'g'
    );
    newContent = newContent.replaceAll(regExp, (match) =>
      replacement(match, newPrefix, oldPrefix)
    );
  });

  return newContent;
}

/**
 * Function to process all .ts and .tsx files in a "dir" folder
 * @param dir - folder to process
 * @param newPrefix - prefix to add
 * @param oldPrefix - prefix to replace
 */
async function processFiles(dir, newPrefix, oldPrefix) {
  const files = await readdir(dir);

  for (const file of files) {
    const filePath = join(dir, file);
    const stat = await _stat(filePath);

    if (stat.isDirectory()) {
      // If it's a directory, recursively call this function
      await processFiles(filePath, newPrefix, oldPrefix);
    } else if (file.endsWith('.ts') || file.endsWith('.tsx')) {
      // If it's a .ts or .tsx file, modify it
      let content = await readFile(filePath, 'utf8');
      const updatedContent = updateTailwindClasses(
        content,
        newPrefix,
        oldPrefix
      );

      if (content !== updatedContent) {
        await writeFile(filePath, updatedContent, 'utf8');
        console.log(`Prefix updated in: ${filePath}`);
      }
    }
  }
}

/**
 * @argv 2 : old prefix to replace
 */
async function main() {
  const newPrefix = getTailwindPrefix();
  const oldPrefix = process.argv[2];

  if (!newPrefix && !oldPrefix) {
    console.log('No prefix to add or replace.');
    return;
  }

  if (oldPrefix) {
    console.log(`Old prefix: "${oldPrefix}"`);
  }
  console.log(`New prefix: "${newPrefix}"`);

  const srcDir = resolve('./packages');

  await processFiles(srcDir, newPrefix, oldPrefix);
}

main().catch((error) => {
  console.error('Error during script execution:', error);
});
