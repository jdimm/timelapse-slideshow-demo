// var ini = require('node-ini');
import ini from 'node-ini'
import mysql from 'serverless-mysql';

var myconf = ini.parseSync('./.my.cnf');

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

export async function getUserInfo(serial) {
  const query = `select 
      u.id as user_id, d.id as device_id, u.email, u.name, 
      datediff(now(),from_unixtime(first_pair_time)) as days_since_pairing,
      date(from_unixtime(first_pair_time)) as first_pair_date
    from user as u
    join device as d on d.user_id = u.id
    where d.serial = '${serial}'
    `
  return executeQuery({ query })
}

export default executeQuery