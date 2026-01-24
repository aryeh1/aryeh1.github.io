import { describe, it, expect } from 'vitest';
import * as fs from 'fs';
import * as path from 'path';

/**
 * Archive Link Integrity Test
 * 
 * This test validates that:
 * 1. All HTML files in the archive are linked from archive/index.html
 * 2. All subdirectories (with index.html) are linked from archive/index.html
 * 3. No orphan pages exist
 */

const ARCHIVE_DIR = path.join(process.cwd(), 'archive');
const ARCHIVE_INDEX = path.join(ARCHIVE_DIR, 'index.html');

// Files/folders that don't need to be linked (utility files, not pages)
const EXCLUDED_FILES = [
  'index.html',       // The index itself
  '404.html',         // Error page, not a feature
  'analytics.js',     // Script file
  'data.js',          // Script file
];

const EXCLUDED_FOLDERS = [
  'tanakh',           // Development folder (tanakh-deploy is the live version)
  'efi',              // Contains only a placeholder file
];

function getArchiveIndexContent(): string {
  return fs.readFileSync(ARCHIVE_INDEX, 'utf-8');
}

function getLinksFromIndex(content: string): string[] {
  // Extract all href attributes from the index
  const hrefRegex = /href="([^"]+)"/g;
  const links: string[] = [];
  let match;
  while ((match = hrefRegex.exec(content)) !== null) {
    links.push(match[1]);
  }
  return links;
}

function getHtmlFilesInArchive(): string[] {
  const files = fs.readdirSync(ARCHIVE_DIR);
  return files.filter(file => {
    const filePath = path.join(ARCHIVE_DIR, file);
    return fs.statSync(filePath).isFile() && 
           file.endsWith('.html') && 
           !EXCLUDED_FILES.includes(file);
  });
}

function getSubfoldersWithIndex(): string[] {
  const items = fs.readdirSync(ARCHIVE_DIR);
  return items.filter(item => {
    if (EXCLUDED_FOLDERS.includes(item)) return false;
    const itemPath = path.join(ARCHIVE_DIR, item);
    if (!fs.statSync(itemPath).isDirectory()) return false;
    // Check if directory has an index.html
    const indexPath = path.join(itemPath, 'index.html');
    return fs.existsSync(indexPath);
  });
}

describe('Archive Link Integrity', () => {
  const indexContent = getArchiveIndexContent();
  const links = getLinksFromIndex(indexContent);

  it('archive/index.html exists', () => {
    expect(fs.existsSync(ARCHIVE_INDEX)).toBe(true);
  });

  it('all HTML files in archive root are linked', () => {
    const htmlFiles = getHtmlFilesInArchive();
    const orphanFiles: string[] = [];

    for (const file of htmlFiles) {
      const isLinked = links.some(link => 
        link === file || 
        link === `./${file}` || 
        link.endsWith(`/${file}`)
      );
      if (!isLinked) {
        orphanFiles.push(file);
      }
    }

    expect(orphanFiles).toEqual([]);
  });

  it('all subfolders with index.html are linked', () => {
    const subfolders = getSubfoldersWithIndex();
    const orphanFolders: string[] = [];

    for (const folder of subfolders) {
      const isLinked = links.some(link => 
        link === `${folder}/` || 
        link === `./${folder}/` ||
        link === `${folder}/index.html` ||
        link.includes(`${folder}/`)
      );
      if (!isLinked) {
        orphanFolders.push(folder);
      }
    }

    expect(orphanFolders).toEqual([]);
  });

  it('main navigation includes Archive link', () => {
    // Read Header.tsx and check for archive link
    const headerPath = path.join(process.cwd(), 'src/components/layout/Header.tsx');
    const headerContent = fs.readFileSync(headerPath, 'utf-8');
    
    expect(headerContent).toContain('/archive');
    expect(headerContent).toContain('Archive');
  });
});
