import pkg from 'pg';
const { Pool } = pkg;

const pool = new Pool({
    user: '',
    host: '',
    database: '',
    password: '', 
    port:'', 
});

export const query = async (text, params) => {
    const client = await pool.connect();
    try {
        const result = await client.query(text, params);
        return result.rows;
    } finally {
        client.release();
    }
};
