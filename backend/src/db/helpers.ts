import { Database } from 'sql.js';

// 辅助函数：执行查询并返回结果
export const runQuery = (db: Database, sql: string, params: any[] = []) => {
  db.run(sql, params);
  saveDatabase(db);
};

export const getOne = (db: Database, sql: string, params: any[] = []) => {
  const stmt = db.prepare(sql);
  stmt.bind(params);
  
  if (stmt.step()) {
    const row = stmt.getAsObject();
    stmt.free();
    return row;
  }
  stmt.free();
  return undefined;
};

export const getAll = (db: Database, sql: string, params: any[] = []) => {
  const stmt = db.prepare(sql);
  stmt.bind(params);
  
  const results: any[] = [];
  while (stmt.step()) {
    results.push(stmt.getAsObject());
  }
  stmt.free();
  return results;
};

export const saveDatabase = (db: Database) => {
  const data = db.export();
  const buffer = Buffer.from(data);
  const fs = require('fs');
  const path = require('path');
  const dbPath = path.join(__dirname, '../../data/forum.db');
  fs.writeFileSync(dbPath, buffer);
};