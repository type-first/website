/**
 * Test script for text search API
 */

async function testTextSearchAPI() {
  console.log('🔍 Testing Text Search API...\n');
  
  const query = 'typescript';
  
  try {
    const response = await fetch('http://localhost:3000/api/search/text', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ query })
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();

    console.log(`Query: "${query}"`);
    console.log(`Results found: ${data.results.length}\n`);

    data.results.forEach((result: any, index: number) => {
      console.log(`${index + 1}. ${result.chunkTitle} (${result.type})`);
      console.log(`   Score: ${result.score}`);
      console.log(`   Article: ${result.title}`);
      console.log(`   Content Preview: ${result.snippet}`);
      console.log('');
    });

  } catch (error) {
    console.error('❌ Error during text search API test:', error);
  }
}

// Run the test
testTextSearchAPI();
