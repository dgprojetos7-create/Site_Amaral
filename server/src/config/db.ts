import mysql, { type Pool, type PoolConnection, type ResultSetHeader, type RowDataPacket } from 'mysql2/promise';
import { env } from './env.js';

export const pool: Pool = mysql.createPool({
  host: env.db.host,
  port: env.db.port,
  user: env.db.user,
  password: env.db.password,
  database: env.db.database,
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
  namedPlaceholders: true,
  charset: 'utf8mb4',
});

export const getConnection = () => pool.getConnection();

export const query = async <T extends RowDataPacket[]>(sql: string, params: unknown[] = []) => {
  try {
    const [rows] = await pool.execute<T>(sql, params as never[]);
    return rows;
  } catch (error) {
    console.error('Database query error:', error);
    throw error;
  }
};

export const execute = async (sql: string, params: unknown[] = []) => {
  try {
    const [result] = await pool.execute<ResultSetHeader>(sql, params as never[]);
    return result;
  } catch (error) {
    console.error('Database execution error:', error);
    throw error;
  }
};

export const withTransaction = async <T>(callback: (connection: PoolConnection) => Promise<T>) => {
  const connection = await getConnection();

  try {
    await connection.beginTransaction();
    const result = await callback(connection);
    await connection.commit();
    return result;
  } catch (error) {
    await connection.rollback();
    throw error;
  } finally {
    connection.release();
  }
};
