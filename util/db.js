// var ini = require('node-ini');
import ini from 'node-ini'
import mysql from 'serverless-mysql';

var myconf = ini.parseSync('/Users/johndimm/.my.cnf');

const db = mysql({
  config: {
    host: myconf.client.host,
    user: myconf.client.user,
    password: myconf.client.password,
    database: myconf.client.database,
    port: myconf.client.port
  }
});

async function executeQuery({ query, values }) {
  try {
    const results = await db.query(query, values);
    await db.end();
    return results;
  } catch (error) {
    return { error };
  }
}

export default executeQuery