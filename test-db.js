const { Client } = require('pg');

const client = new Client({
  connectionString: 'postgresql://postgres.ctgnffrdhfsuedvfmnqy:9R5on5zwuP8ZtPxq@aws-1-us-east-2.pooler.supabase.com:6543/postgres?sslmode=require'
});

async function connect() {
  try {
    console.log("Connecting to Supabase...");
    await client.connect();
    console.log("Connected successfully!");
    const res = await client.query('SELECT NOW()');
    console.log(res.rows[0]);
    await client.end();
  } catch (err) {
    console.error("Connection error", err.stack);
  }
}

connect();
