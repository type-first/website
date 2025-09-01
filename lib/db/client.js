// lib/db/client.js - Smart database client selection

const isDevelopment = process.env.NODE_ENV === 'development';
const isLocal = process.env.POSTGRES_URL?.includes('localhost');

let sql;

if (isDevelopment && isLocal) {
  // Use standard pg client for local development
  const { Client } = require('pg');
  const client = new Client({
    connectionString: process.env.POSTGRES_URL
  });
  
  // Create a sql template literal function that mimics Vercel's API
  sql = (strings, ...values) => {
    const query = strings.reduce((acc, str, i) => 
      acc + str + (values[i] !== undefined ? `$${i + 1}` : ''), ''
    );
    
    return {
      async rows() {
        if (!client._connected) {
          await client.connect();
          client._connected = true;
        }
        const result = await client.query(query, values);
        return result.rows;
      }
    };
  };
  
  // Add query method for direct queries
  sql.query = async (text, params) => {
    if (!client._connected) {
      await client.connect();
      client._connected = true;
    }
    return await client.query(text, params);
  };
  
} else {
  // Use Vercel's client for production/Vercel environment
  const { sql: vercelSql } = require('@vercel/postgres');
  sql = vercelSql;
}

module.exports = { sql };
