import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

// Mock data imports since we can't easily import TS files in a JS script without compilation
// In a real setup, we'd use ts-node or compile this script.
// For now, I'll duplicate the ID lists or read them if they were JSON.
// I'll define the static routes and dynamic IDs here.

const BASE_URL = 'https://tamanwisatabougenville.com';

const STATIC_ROUTES = [
    '',
    '?page=villas',
    '?page=resto',
    '?page=facility',
    '?page=gallery',
    '?page=offers',
    '?page=about',
    '?page=location',
    '?page=contact',
    '?page=faq',
    '?page=blog'
];

// Villa IDs from constants.tsx (manual sync for now as I can't import .tsx in node easily without setup)
const VILLA_IDS = [
    'forest-house',
    'mooi-lake',
    'emerald-02',
    'emerald-01',
    'olinda',
    'selby',
    'villa-gordes',
    'villa-roussillon',
    'villa-lourmarin',
    'riverside-hana'
];

// Blog IDs from blogPosts.ts
const BLOG_IDS = [
    'romantic-honeymoon-mount-puntang',
    'ultimate-family-gathering-guide',
    'history-radio-malabar',
    'lebaran-2025-bougenville'
];

function generateSitemap() {
    const today = new Date().toISOString().split('T')[0];

    let xml = '<?xml version="1.0" encoding="UTF-8"?>\n';
    xml += '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n';

    // Static Routes
    STATIC_ROUTES.forEach(route => {
        xml += '  <url>\n';
        xml += `    <loc>${BASE_URL}/${route}</loc>\n`;
        xml += `    <lastmod>${today}</lastmod>\n`;
        xml += '    <changefreq>weekly</changefreq>\n';
        xml += `    <priority>${route === '' ? '1.0' : '0.8'}</priority>\n`;
        xml += '  </url>\n';
    });

    // Villa Details
    VILLA_IDS.forEach(id => {
        xml += '  <url>\n';
        xml += `    <loc>${BASE_URL}/?page=villa-detail&amp;id=${id}</loc>\n`;
        xml += `    <lastmod>${today}</lastmod>\n`;
        xml += '    <changefreq>weekly</changefreq>\n';
        xml += '    <priority>0.9</priority>\n';
        xml += '  </url>\n';
    });

    // Blog Posts
    BLOG_IDS.forEach(id => {
        xml += '  <url>\n';
        xml += `    <loc>${BASE_URL}/?page=blog&amp;id=${id}</loc>\n`;
        xml += `    <lastmod>${today}</lastmod>\n`;
        xml += '    <changefreq>monthly</changefreq>\n';
        xml += '    <priority>0.7</priority>\n';
        xml += '  </url>\n';
    });

    xml += '</urlset>';

    const outputPath = path.resolve('public', 'sitemap.xml');
    fs.writeFileSync(outputPath, xml);
    console.log(`Sitemap generated at ${outputPath}`);
}

generateSitemap();
