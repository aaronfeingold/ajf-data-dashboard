"use client";

const formatSql = (sql: string) => {
  try {
    const parsed = JSON.parse(sql);
    return JSON.stringify(parsed, null, 2);
  } catch {
    return sql;
  }
};

export default formatSql;
