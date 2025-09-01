// seed-neon.js - Seed Neon database with sample articles
require('dotenv').config({ path: '.env.local' });
const { sql } = require('@vercel/postgres');
const fs = require('fs');
const path = require('path');
const yaml = require('js-yaml');

async function seedDatabase() {
  try {
    console.log('🌱 Starting database seeding on Neon...');
    
    // Check if articles already exist
    const existingArticles = await sql`SELECT COUNT(*) as count FROM articles`;
    if (existingArticles.rows[0].count > 0) {
      console.log(`📄 Database already has ${existingArticles.rows[0].count} articles. Skipping seed.`);
      return;
    }
    
    // Read fixtures
    const fixturesPath = path.join(__dirname, 'fixtures', 'articles.yaml');
    console.log('📂 Reading fixtures from:', fixturesPath);
    
    if (!fs.existsSync(fixturesPath)) {
      console.error('❌ Fixtures file not found:', fixturesPath);
      process.exit(1);
    }
    
    const articlesData = yaml.load(fs.readFileSync(fixturesPath, 'utf8'));
    console.log(`📋 Found ${articlesData.length} articles to seed`);
    
    // Insert articles
    for (const article of articlesData) {
      console.log(`📝 Creating article: ${article.title}`);
      
      // Convert content array to markdown string
      let contentMarkdown = '';
      if (article.content && Array.isArray(article.content)) {
        contentMarkdown = article.content
          .map(section => section.content || '')
          .join('\n\n');
      }
      
      // Calculate word count and read time
      const wordCount = contentMarkdown.split(/\s+/).length;
      const readTime = Math.ceil(wordCount / 200); // 200 words per minute
      
      const result = await sql`
        INSERT INTO articles (
          title, slug, excerpt, content, author, published_date, 
          tags, featured_image, read_time_minutes, word_count
        ) VALUES (
          ${article.title},
          ${article.slug},
          ${article.description || article.seoDescription || ''},
          ${contentMarkdown},
          ${'Admin'}, -- Default author
          ${article.publishedAt ? new Date(article.publishedAt).toISOString().split('T')[0] : '2024-01-01'},
          ${article.tags || []},
          ${article.coverImage || null},
          ${readTime},
          ${wordCount}
        ) RETURNING id
      `;
      
      console.log(`✅ Created article with ID: ${result.rows[0].id}`);
    }
    
    // Verify seeding
    const finalCount = await sql`SELECT COUNT(*) as count FROM articles`;
    console.log(`🎉 Seeding completed! ${finalCount.rows[0].count} articles in database.`);
    
  } catch (error) {
    console.error('❌ Seeding failed:', error);
    process.exit(1);
  }
}

seedDatabase();
