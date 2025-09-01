const { Client } = require('pg');
const yaml = require('js-yaml');
const fs = require('fs').promises;
const path = require('path');

// Load environment variables from .env.local
require('dotenv').config({ path: path.join(__dirname, '..', '.env.local') });

async function seedDatabase() {
  console.log('Starting database seeding...');
  
  const client = new Client({
    connectionString: process.env.POSTGRES_URL
  });

  try {
    await client.connect();
    console.log('✅ Connected to database');

    // Load sample articles from YAML fixtures
    const fixturesDir = path.join(__dirname, '../fixtures');
    const files = await fs.readdir(fixturesDir);
    const yamlFiles = files.filter(file => file.endsWith('.yaml') || file.endsWith('.yml'));

    console.log(`Found ${yamlFiles.length} fixture files`);

    for (const file of yamlFiles) {
      console.log(`Processing fixture: ${file}`);
      
      const filePath = path.join(fixturesDir, file);
      const yamlContent = await fs.readFile(filePath, 'utf-8');
      const articles = yaml.load(yamlContent);

      if (!Array.isArray(articles)) {
        console.log(`Skipping ${file}: not an array of articles`);
        continue;
      }

      for (const article of articles) {
        // Check if article already exists
        const existing = await client.query(
          'SELECT id FROM articles WHERE slug = $1',
          [article.slug]
        );

        if (existing.rows.length > 0) {
          console.log(`Skipping existing article: ${article.slug}`);
          continue;
        }

        // Insert article
        const result = await client.query(`
          INSERT INTO articles (
            title, slug, description, content, tags, status,
            published_at, cover_image, seo_title, seo_description
          ) VALUES (
            $1, $2, $3, $4, $5, $6, $7, $8, $9, $10
          )
          RETURNING id
        `, [
          article.title,
          article.slug,
          article.description || null,
          JSON.stringify(article.content),
          article.tags || [],
          article.status || 'draft',
          article.publishedAt ? new Date(article.publishedAt).toISOString() : null,
          article.coverImage || null,
          article.seoTitle || null,
          article.seoDescription || null
        ]);

        const articleId = result.rows[0].id;

        // Generate derived content
        try {
          // Simple derived content generation without the complex pipeline
          const contentText = article.content
            .filter(section => section.type === 'text')
            .map(section => section.content)
            .join('\n\n');

          const plaintext = contentText.replace(/[#*`]/g, ''); // Basic markdown removal
          
          await client.query(`
            INSERT INTO derived_content (
              article_id, markdown, plaintext, outline
            ) VALUES ($1, $2, $3, $4)
          `, [
            articleId,
            contentText,
            plaintext,
            JSON.stringify([])
          ]);

          console.log(`✅ Seeded article: ${article.title}`);
        } catch (derivationError) {
          console.warn(`⚠️ Failed to derive content for ${article.title}:`, derivationError.message);
        }
      }
    }

    console.log('✅ Database seeding completed successfully');
  } catch (error) {
    console.error('❌ Seeding failed:', error);
    process.exit(1);
  } finally {
    await client.end();
  }
}

// Run seeding if called directly
if (require.main === module) {
  seedDatabase();
}

module.exports = { seedDatabase };
