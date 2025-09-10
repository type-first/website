#!/usr/bin/env node

import { Command } from 'commander';
import { getAllArticles, ArticleWithSlug } from '../lib/articles/registry';
import { sql } from '../lib/db';
import fs from 'fs/promises';
import path from 'path';
import dotenv from 'dotenv';
import { renderArticleComponent, extractOutlineFromJson } from '../lib/article-rendering';

// Load environment variables
dotenv.config({ path: path.join(__dirname, '../.env.local') });

const program = new Command();

program
  .name('articles')
  .description('CLI for managing article compilation and indexing')
  .version('1.0.0');

program
  .command('compile')
  .description('Compile article(s) with embeddings for search')
  .argument('[slug]', 'specific article slug to compile (optional)')
  .option('-f, --force', 'force recompilation even if up to date')
  .option('--no-embeddings', 'skip embedding generation')
  .action(async (slug: string | undefined, options: { force?: boolean; embeddings?: boolean }) => {
    try {
      if (slug) {
        await compileArticle(slug, options);
      } else {
        await compileAllArticles(options);
      }
    } catch (error) {
      console.error('Compilation failed:', error);
      process.exit(1);
    }
  });

program
  .command('list')
  .description('List all articles and their compilation status')
  .action(async () => {
    try {
      await listArticles();
    } catch (error) {
      console.error('Failed to list articles:', error);
      process.exit(1);
    }
  });

program
  .command('validate')
  .description('Validate all articles for structure and completeness')
  .action(async () => {
    try {
      await validateArticles();
    } catch (error) {
      console.error('Validation failed:', error);
      process.exit(1);
    }
  });

// Compilation functions
async function compileArticle(slug: string, options: { force?: boolean; embeddings?: boolean }) {
  console.log(`Compiling article: ${slug}`);
  
  try {
    const articles = await getAllArticles();
    const article = articles.find(a => a.slug === slug);
    
    if (!article) {
      throw new Error(`Article not found: ${slug}`);
    }

    // Check if already compiled and up to date
    if (!options.force) {
      const existingResult = await sql`
        SELECT last_compiled FROM compiled_articles WHERE slug = ${slug}
      `;
      const existing = existingResult.rows || [];
      
      if (existing.length > 0) {
        const fileModTime = await getFileLastModified(`app/articles/${slug}/page.tsx`);
        const lastCompiled = new Date(existing[0].last_compiled);
        
        if (new Date(fileModTime) <= lastCompiled) {
          console.log(`✓ ${slug} is up to date`);
          return;
        }
      }
    }

    // Compile the article
    const compiled = await compileArticleContent(article);
    
    // Generate embedding if requested
    let embedding = null;
    if (options.embeddings !== false) {
      console.log(`   📊 Generating embedding for ${slug}...`);
      embedding = await generateEmbedding(compiled.plainText);
    }

    // Save to database
    await saveCompiledArticle(article, compiled, embedding);
    
    console.log(`✅ Successfully compiled: ${slug}`);
    console.log(`   Words: ${compiled.wordCount}, Reading time: ${compiled.readingTime}m`);
    if (embedding) {
      console.log(`   📊 Embedding generated (${embedding.length} dimensions)`);
    }
  } catch (error) {
    console.error(`❌ Failed to compile ${slug}:`, error);
    throw error;
  }
}

async function compileAllArticles(options: { force?: boolean; embeddings?: boolean }) {
  console.log('Compiling all articles...');
  
  try {
    const articles = await getAllArticles();
    let compiledCount = 0;
    let skippedCount = 0;
    
    for (const article of articles) {
      try {
        // Check if already compiled and up to date
        if (!options.force) {
          const existingResult = await sql`
            SELECT last_compiled FROM compiled_articles WHERE slug = ${article.slug}
          `;
          const existing = existingResult.rows || [];
          
          if (existing.length > 0) {
            const fileModTime = await getFileLastModified(`app/articles/${article.slug}/page.tsx`);
            const lastCompiled = new Date(existing[0].last_compiled);
            
            if (new Date(fileModTime) <= lastCompiled) {
              console.log(`✓ ${article.slug} - up to date`);
              skippedCount++;
              continue;
            }
          }
        }

        // Compile the article
        const compiled = await compileArticleContent(article);
        
        // Generate embedding if requested
        let embedding = null;
        if (options.embeddings !== false) {
          console.log(`   📊 Generating embedding for ${article.slug}...`);
          embedding = await generateEmbedding(compiled.plainText);
        }

        // Save to database
        await saveCompiledArticle(article, compiled, embedding);
        
        console.log(`✅ ${article.slug} (${compiled.wordCount} words)`);
        compiledCount++;
      } catch (error) {
        console.error(`❌ Failed to compile ${article.slug}:`, error);
      }
    }
    
    console.log(`\n🎉 Compilation complete:`);
    console.log(`   Compiled: ${compiledCount} articles`);
    console.log(`   Skipped: ${skippedCount} articles (up to date)`);
  } catch (error) {
    console.error('❌ Failed to compile articles:', error);
    throw error;
  }
}

// Article content compilation
async function compileArticleContent(article: ArticleWithSlug) {
  // Import the article component dynamically
  const modulePath = path.join(process.cwd(), 'app', 'articles', article.slug, 'page.tsx');
  
  try {
    // Read the article file
    const content = await fs.readFile(modulePath, 'utf-8');
    
    // Check if this is a semantic component article
    const isSemanticComponent = content.includes('@/lib/article-components');
    
    if (isSemanticComponent) {
      console.log(`📦 Processing semantic component article: ${article.slug}`);
      
      try {
        // For semantic component articles, we should use the rendering system
        // For now, we'll use an improved extraction that focuses on ModalityProvider content
        const modalityProviderMatch = content.match(/<ModalityProvider[^>]*>([\s\S]*?)<\/ModalityProvider>/);
        
        let extractedContent = '';
        if (modalityProviderMatch) {
          // Extract content within ModalityProvider
          const modalityContent = modalityProviderMatch[1];
          
          // Extract text from semantic components using a more sophisticated approach
          extractedContent = extractSemanticComponentText(modalityContent);
        }
        
        if (!extractedContent) {
          // Fallback to old method if semantic extraction fails
          const jsxContent = extractJSXContent(content);
          extractedContent = jsxToPlainText(jsxContent);
        }
        
        // Calculate word count and reading time
        const wordCount = extractedContent.split(/\s+/).filter(word => word.length > 0).length;
        const readingTime = Math.ceil(wordCount / 200);
        
        // Generate outline from semantic components
        const outline = extractSemanticOutline(modalityProviderMatch ? modalityProviderMatch[1] : content);
        
        return {
          html: content, // Store the full React component
          markdown: extractedContent, // Use extracted text as markdown fallback
          plainText: extractedContent,
          outline,
          wordCount,
          readingTime
        };
      } catch (error) {
        console.warn(`Failed to process semantic components for ${article.slug}, falling back to regex:`, error);
        
        // Fallback to old method
        const jsxContent = extractJSXContent(content);
        const plainText = jsxToPlainText(jsxContent);
        const outline = extractOutline(jsxContent);
        const wordCount = plainText.split(/\s+/).filter(word => word.length > 0).length;
        const readingTime = Math.ceil(wordCount / 200);
        
        return {
          html: jsxContent,
          markdown: content,
          plainText,
          outline,
          wordCount,
          readingTime
        };
      }
    } else {
      console.log(`📄 Processing legacy article: ${article.slug}`);
      
      // Extract JSX content (simple approach for legacy articles)
      const jsxContent = extractJSXContent(content);
      
      // Convert to plain text for search
      const plainText = jsxToPlainText(jsxContent);
      
      // Calculate word count and reading time
      const wordCount = plainText.split(/\s+/).filter(word => word.length > 0).length;
      const readingTime = Math.ceil(wordCount / 200); // 200 words per minute
      
      // Generate outline from headings
      const outline = extractOutline(jsxContent);
      
      return {
        html: jsxContent, // In a real implementation, you'd render JSX to HTML
        markdown: content, // Store the original TypeScript/JSX as markdown
        plainText,
        outline,
        wordCount,
        readingTime
      };
    }
  } catch (error) {
    console.error(`Failed to process article ${article.slug}:`, error);
    throw error;
  }
}

function extractSemanticComponentText(content: string): string {
  // Extract text from semantic components
  let text = content;
  
  // Extract text from Paragraph components
  text = text.replace(/<Paragraph[^>]*>([\s\S]*?)<\/Paragraph>/g, (match, inner) => {
    return extractInnerText(inner) + '\n\n';
  });
  
  // Extract text from Heading components
  text = text.replace(/<Heading[^>]*level={(\d+)}[^>]*>([\s\S]*?)<\/Heading>/g, (match, level, inner) => {
    return extractInnerText(inner) + '\n\n';
  });
  
  // Extract text from List components
  text = text.replace(/<List[^>]*>([\s\S]*?)<\/List>/g, (match, inner) => {
    const listItems = inner.match(/<ListItem[^>]*>([\s\S]*?)<\/ListItem>/g) || [];
    const items = listItems.map((item: string) => {
      const itemContent = item.replace(/<ListItem[^>]*>([\s\S]*?)<\/ListItem>/, '$1');
      return '• ' + extractInnerText(itemContent);
    });
    return items.join('\n') + '\n\n';
  });
  
  // Extract text from Callout components
  text = text.replace(/<Callout[^>]*(?:title="([^"]*)")?[^>]*>([\s\S]*?)<\/Callout>/g, (match, title, inner) => {
    const titleText = title ? `${title}: ` : '';
    return titleText + extractInnerText(inner) + '\n\n';
  });
  
  // Clean up any remaining tags and normalize whitespace
  text = text.replace(/<[^>]*>/g, ' ');
  text = text.replace(/\s+/g, ' ');
  text = text.replace(/\n\s*\n/g, '\n\n');
  text = text.trim();
  
  return text;
}

function extractInnerText(content: string): string {
  // Extract text from Text components
  let text = content.replace(/<Text[^>]*bold[^>]*>([\s\S]*?)<\/Text>/g, '$1');
  text = text.replace(/<Text[^>]*italic[^>]*>([\s\S]*?)<\/Text>/g, '$1');
  text = text.replace(/<Text[^>]*>([\s\S]*?)<\/Text>/g, '$1');
  
  // Remove any remaining JSX
  text = text.replace(/\{[^}]*\}/g, ' ');
  text = text.replace(/<[^>]*>/g, ' ');
  text = text.replace(/\s+/g, ' ');
  text = text.trim();
  
  return text;
}

function extractSemanticOutline(content: string): Array<{ level: number; text: string }> {
  const outline: Array<{ level: number; text: string }> = [];
  
  // Extract headings from semantic components
  const headingMatches = content.match(/<Heading[^>]*level={(\d+)}[^>]*>([\s\S]*?)<\/Heading>/g) || [];
  
  for (const match of headingMatches) {
    const levelMatch = match.match(/level={(\d+)}/);
    const contentMatch = match.match(/<Heading[^>]*>([\s\S]*?)<\/Heading>/);
    
    if (levelMatch && contentMatch) {
      const level = parseInt(levelMatch[1]);
      const text = extractInnerText(contentMatch[1]);
      outline.push({ level, text });
    }
  }
  
  return outline;
}

function extractJSXContent(content: string): string {
  // Try to extract everything inside the return statement of the default export function
  const functionMatch = content.match(/export default function[^{]*\{([\s\S]*)\}[^}]*$/);
  if (functionMatch) {
    const functionBody = functionMatch[1];
    
    // Find the return statement (can be either return (...) or return <...>)
    const returnMatch = functionBody.match(/return\s*(?:\([\s\S]*?\)|<[\s\S]*?>[\s\S]*?<\/[^>]*>)/);
    if (returnMatch) {
      return returnMatch[0];
    }
    
    // Fallback: return the entire function body
    return functionBody;
  }
  
  // If no function match, try to find just a return statement
  const returnMatch = content.match(/return\s*\(([\s\S]*?)\);?\s*}?\s*$/m);
  if (returnMatch) {
    return returnMatch[1];
  }
  
  return content;
}

function jsxToPlainText(jsx: string): string {
  return jsx
    .replace(/import\s+.*?from.*?;/g, '') // Remove imports
    .replace(/export\s+.*?;/g, '') // Remove exports
    .replace(/const\s+.*?=.*?;/g, '') // Remove variable declarations
    .replace(/function\s+\w+[^{]*\{[^}]*\}/g, '') // Remove function declarations
    .replace(/\/\*[\s\S]*?\*\//g, '') // Remove block comments
    .replace(/\/\/.*$/gm, '') // Remove line comments
    .replace(/<script[^>]*>[\s\S]*?<\/script>/gi, '') // Remove script tags and content
    .replace(/<style[^>]*>[\s\S]*?<\/style>/gi, '') // Remove style tags and content
    .replace(/<[^>]*>/g, ' ') // Remove all HTML/JSX tags
    .replace(/\{[^}]*\}/g, ' ') // Remove JSX expressions (but keep the content inside)
    .replace(/className="[^"]*"/g, '') // Remove className attributes
    .replace(/style=\{[^}]*\}/g, '') // Remove style objects
    .replace(/onClick=\{[^}]*\}/g, '') // Remove onClick handlers
    .replace(/href="[^"]*"/g, '') // Remove href attributes
    .replace(/\s+/g, ' ') // Normalize whitespace
    .replace(/return\s*\(\s*|\s*\)\s*;?\s*$|^\s*\(\s*|\s*\)\s*$/g, '') // Remove return statement wrapper
    .trim();
}

function extractOutline(jsx: string): Array<{ level: number; text: string }> {
  const outline: Array<{ level: number; text: string }> = [];
  
  // Match heading tags
  const headingMatches = jsx.matchAll(/<h([1-6])[^>]*>(.*?)<\/h[1-6]>/gi);
  
  for (const match of headingMatches) {
    const level = parseInt(match[1]);
    const text = match[2].replace(/<[^>]*>/g, '').trim();
    if (text) {
      outline.push({ level, text });
    }
  }
  
  return outline;
}

// Embedding generation
async function generateEmbedding(text: string): Promise<number[] | null> {
  const openaiApiKey = process.env.OPENAI_API_KEY;
  
  if (!openaiApiKey) {
    console.warn('⚠️  OPENAI_API_KEY not set, skipping embedding generation');
    return null;
  }
  
  try {
    const response = await fetch('https://api.openai.com/v1/embeddings', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${openaiApiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'text-embedding-ada-002',
        input: text.slice(0, 8000), // Limit to ~8000 chars for token limits
      }),
    });
    
    if (!response.ok) {
      throw new Error(`OpenAI API error: ${response.status} ${response.statusText}`);
    }
    
    const data = await response.json();
    return data.data[0].embedding;
  } catch (error) {
    console.error('Failed to generate embedding:', error);
    return null;
  }
}

// Database operations
async function saveCompiledArticle(
  article: ArticleWithSlug, 
  compiled: any, 
  embedding: number[] | null
) {
  await sql`
    INSERT INTO compiled_articles (
      slug, metadata, html, markdown, plain_text, outline, 
      word_count, reading_time, embedding, last_compiled
    ) VALUES (
      ${article.slug},
      ${JSON.stringify(article)},
      ${compiled.html},
      ${compiled.markdown},
      ${compiled.plainText},
      ${JSON.stringify(compiled.outline)},
      ${compiled.wordCount},
      ${compiled.readingTime},
      ${embedding ? `[${embedding.join(',')}]` : null},
      ${new Date().toISOString()}
    )
    ON CONFLICT (slug) DO UPDATE SET
      metadata = EXCLUDED.metadata,
      html = EXCLUDED.html,
      markdown = EXCLUDED.markdown,
      plain_text = EXCLUDED.plain_text,
      outline = EXCLUDED.outline,
      word_count = EXCLUDED.word_count,
      reading_time = EXCLUDED.reading_time,
      embedding = EXCLUDED.embedding,
      last_compiled = EXCLUDED.last_compiled,
      updated_at = NOW()
  `;
}

async function listArticles() {
  try {
    // First show module-based articles
    const moduleArticles = await getAllArticles();
    
    // Then show compiled status
    const compiledResult = await sql`
      SELECT slug, metadata, word_count, reading_time, last_compiled, 
             (embedding IS NOT NULL) as has_embedding
      FROM compiled_articles
      ORDER BY last_compiled DESC
    `;
    
    // Extract rows from the result object
    const compiled = compiledResult.rows || [];
    
    console.log('\nModule-Based Articles with Compilation Status:');
    console.log('==============================================');
    
    for (const article of moduleArticles) {
      const compiledInfo = compiled.find((c: any) => c.slug === article.slug);
      const fileModTime = await getFileLastModified(`app/articles/${article.slug}/page.tsx`);
      
      console.log(`📄 ${article.slug}`);
      console.log(`   Title: ${article.title}`);
      console.log(`   Tags: ${article.tags.join(', ')}`);
      console.log(`   Last modified: ${fileModTime}`);
      
      if (compiledInfo) {
        const lastCompiled = new Date(compiledInfo.last_compiled).toLocaleDateString();
        const needsRecompile = new Date(fileModTime) > new Date(compiledInfo.last_compiled);
        const status = needsRecompile ? '⚠️  needs recompile' : '✅ up to date';
        
        console.log(`   Compiled: ${lastCompiled} (${status})`);
        console.log(`   Words: ${compiledInfo.word_count}, Reading: ${compiledInfo.reading_time}m`);
        console.log(`   Embedding: ${compiledInfo.has_embedding ? '✅' : '❌'}`);
      } else {
        console.log(`   Compiled: ❌ not compiled`);
      }
      console.log('');
    }
    
    console.log(`Total: ${moduleArticles.length} articles`);
    console.log(`Compiled: ${compiled.length} articles`);
  } catch (error) {
    console.error('Database error:', error);
    
    // If table doesn't exist, just show module-based articles
    console.log('\n⚠️  Database table not found, showing module-based articles only:');
    const moduleArticles = await getAllArticles();
    
    for (const article of moduleArticles) {
      console.log(`📄 ${article.slug}`);
      console.log(`   Title: ${article.title}`);
      console.log(`   Tags: ${article.tags.join(', ')}`);
      console.log('');
    }
    
    console.log(`Total: ${moduleArticles.length} articles (none compiled yet)`);
  }
}

async function validateArticles() {
  console.log('Validating all articles...\n');
  
  const articles = await getAllArticles();
  const issues: string[] = [];
  let validCount = 0;
  
  for (const article of articles) {
    const status = validateArticleStructure(article, { silent: false });
    
    if (status.isValid) {
      console.log(`✅ ${article.slug} - OK`);
      validCount++;
    } else {
      console.log(`❌ ${article.slug} - Issues found:`);
      status.issues.forEach(issue => {
        console.log(`   • ${issue}`);
        issues.push(`${article.slug}: ${issue}`);
      });
    }
  }
  
  console.log(`\n📊 Validation Summary:`);
  console.log(`   Valid: ${validCount}/${articles.length}`);
  console.log(`   Issues: ${issues.length}`);
  
  if (issues.length > 0) {
    console.log(`\n⚠️  Issues found:`);
    issues.forEach(issue => console.log(`   ${issue}`));
    process.exit(1);
  }
}

// Helper functions
function validateArticleStructure(article: ArticleWithSlug, options: { silent?: boolean } = {}) {
  const issues: string[] = [];
  
  // Required fields
  if (!article.title) issues.push('Missing title');
  if (!article.description) issues.push('Missing description');
  if (!article.slug) issues.push('Missing slug');
  if (!article.author) issues.push('Missing author');
  if (!article.publishedAt) issues.push('Missing publishedAt date');
  
  // Tags validation
  if (!article.tags || article.tags.length === 0) {
    issues.push('No tags specified');
  } else if (article.tags.length > 5) {
    issues.push('Too many tags (max 5 recommended)');
  }
  
  // SEO validation
  if (article.title && article.title.length > 60) {
    issues.push('Title too long for SEO (>60 chars)');
  }
  if (article.description && article.description.length > 160) {
    issues.push('Description too long for SEO (>160 chars)');
  }
  
  // Cover image
  if (!article.coverImage) {
    issues.push('Missing cover image');
  }
  
  const isValid = issues.length === 0;
  
  if (!options.silent && !isValid) {
    console.log(`\n⚠️  Validation issues for ${article.slug}:`);
    issues.forEach(issue => console.log(`   • ${issue}`));
  }
  
  return { isValid, issues };
}

async function getFileLastModified(relativePath: string): Promise<string> {
  try {
    const fullPath = path.join(process.cwd(), relativePath);
    const stats = await fs.stat(fullPath);
    return stats.mtime.toISOString();
  } catch (error) {
    return 'Unknown';
  }
}

program.parse(process.argv);
