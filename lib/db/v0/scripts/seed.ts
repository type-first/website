// moved to lib/db/scripts (TypeScript)
import { sql } from '@vercel/postgres';
import yaml from 'js-yaml';
import fs from 'fs/promises';
import path from 'path';
import dotenv from 'dotenv';

// Load environment variables from project root .env.local
dotenv.config({ path: path.join(__dirname, '../../../.env.local') });

export async function seedDatabase(): Promise<void> {
  console.log('Starting database seeding...');
  
  try {
    // Load sample articles from YAML fixtures
    const fixturesDir = path.join(__dirname, '../fixtures');
    const files = await fs.readdir(fixturesDir);
    const yamlFiles = files.filter(file => file.endsWith('.yaml') || file.endsWith('.yml'));

    console.log(`Found ${yamlFiles.length} fixture files`);

    // Helper functions to derive content without TS imports
    const generateMarkdown = (sections: any[] = []) => {
      return (sections || []).map((section) => {
        if (!section || !section.type) return '';
        switch (section.type) {
          case 'text':
            return section.content || '';
          case 'quote': {
            let quote = `> ${section.content || ''}`;
            if (section.author) {
              quote += `\n> \n> — ${section.author}`;
              if (section.source) quote += `, ${section.source}`;
            }
            return quote;
          }
          case 'code': {
            const lang = section.language ? section.language : '';
            return `\n\n\`\`\`${lang}\n${section.content || ''}\n\`\`\`\n\n`;
          }
          case 'island':
            return `<!-- Island: ${section.component} -->\n${section.textAlt || ''}`;
          default:
            return '';
        }
      }).join('\n\n');
    };

    const generatePlaintext = (sections: any[] = []) => {
      return (sections || []).map((section) => {
        if (!section || !section.type) return '';
        switch (section.type) {
          case 'text':
            return section.content || '';
          case 'quote': {
            let text = section.content || '';
            if (section.author) {
              text += ` — ${section.author}`;
              if (section.source) text += `, ${section.source}`;
            }
            return text;
          }
          case 'code':
            return section.content || '';
          case 'island':
            return section.textAlt || '';
          default:
            return '';
        }
      }).join('\n\n');
    };

    const generateOutline = (sections: any[] = []) => {
      const outline: Array<{ level: number; title: string; id: string }> = [];
      (sections || []).forEach((section, index) => {
        if (section?.type === 'text' && typeof section.content === 'string') {
          const matches = section.content.match(/^(#{1,6})\s+(.+)$/gm);
          if (matches) {
            matches.forEach((m: string) => {
              const level = (m.match(/^#+/)?.[0].length) || 1;
              const title = m.replace(/^#+\s+/, '').trim();
              const id = section.id || `section-${index}`;
              outline.push({ level, title, id });
            });
          }
        } else if (section?.type === 'island' && section.component) {
          outline.push({ level: 2, title: `Interactive: ${section.component}`, id: section.id || `island-${index}` });
        }
      });
      return outline;
    };

    for (const file of yamlFiles) {
      console.log(`Processing fixture: ${file}`);
      
      const filePath = path.join(fixturesDir, file);
      const yamlContent = await fs.readFile(filePath, 'utf-8');
      const articles = yaml.load(yamlContent) as any[];

      if (!Array.isArray(articles)) {
        console.log(`Skipping ${file}: not an array of articles`);
        continue;
      }

      for (const article of articles) {
        // Check if article already exists
        const existing = await sql`SELECT id FROM articles WHERE slug = ${article.slug}`;
        if (existing.rows.length > 0) {
          console.log(`Skipping existing article: ${article.slug}`);
          continue;
        }

        // Insert article with explicit casts for JSONB and text[]
        const insertQuery = `
          INSERT INTO articles (
            title, slug, description, content, tags, status,
            published_at, cover_image, seo_title, seo_description
          ) VALUES (
            $1, $2, $3, $4::jsonb, $5::text[], $6, $7, $8, $9, $10
          ) RETURNING id
        `;
        const insertValues = [
          article.title,
          article.slug,
          article.description || null,
          JSON.stringify(article.content || []),
          article.tags || [],
          article.status || 'draft',
          article.publishedAt ? new Date(article.publishedAt).toISOString() : null,
          article.coverImage || null,
          article.seoTitle || null,
          article.seoDescription || null,
        ];
        const result = await (sql as any).query(insertQuery, insertValues);
        const articleId: string = result.rows[0].id;

        // Derive content inline (markdown, plaintext, outline)
        try {
          const markdown = generateMarkdown(article.content || []);
          const plaintext = generatePlaintext(article.content || []);
          const outline = generateOutline(article.content || []);

          await (sql as any).query(
            `INSERT INTO derived_content (article_id, markdown, plaintext, outline, updated_at)
             VALUES ($1, $2, $3, $4::jsonb, NOW())`,
            [articleId, markdown, plaintext, JSON.stringify(outline)]
          );

          console.log(`✅ Seeded article: ${article.title}`);
        } catch (derivationError: any) {
          console.warn(`⚠️ Failed to derive content for ${article.title}:`, derivationError.message);
        }
      }
    }

    console.log('✅ Database seeding completed successfully');
  } catch (error: any) {
    console.error('❌ Seeding failed:', error);
    process.exit(1);
  }
}

// Run seeding if called directly
const invokedDirectly = process.argv[1]?.endsWith('seed.ts') || process.argv[1]?.endsWith('seed.js');
if (invokedDirectly) {
  seedDatabase();
}
