// bookIssueModel.js
import db from '../db.js';

const bookIssueModel = {
    get: async (id = null) => {
        const sql = id
            ? 'SELECT * FROM book_issues WHERE id = ?'
            : 'SELECT * FROM book_issues ORDER BY id';
        const [rows] = await db.query(sql, id ? [id] : []);
        return id ? rows[0] : rows;
    },

    remove: async (id) => {
        await db.query('DELETE FROM book_issues WHERE id = ?', [id]);
    },

    add: async (data) => {
        const [result] = await db.query('INSERT INTO book_issues SET ?', [data]);
        return result.insertId;
    },

    getMemberBooks: async (memberId) => {
        const sql = `
      SELECT bi.id, bi.return_date, bi.issue_date, bi.is_returned,
             b.book_title, b.book_no, b.author
      FROM book_issues bi
      LEFT JOIN books b ON b.id = bi.book_id
      WHERE bi.member_id = ?
      ORDER BY bi.is_returned ASC
    `;
        const [rows] = await db.query(sql, [memberId]);
        return rows;
    },

    update: async (data) => {
        if (data.id) {
            const { id, ...fields } = data;
            const setClause = Object.keys(fields).map(key => `${key} = ?`).join(', ');
            const values = Object.values(fields);
            await db.query(`UPDATE book_issues SET ${setClause} WHERE id = ?`, [...values, id]);
        }
    },

    bookIssuedByMemberID: async (memberId) => {
        const sql = `
      SELECT bi.return_date, b.book_no, bi.issue_date, bi.is_returned,
             b.book_title, b.author
      FROM book_issues bi
      LEFT JOIN libarary_members lm ON lm.id = bi.member_id
      LEFT JOIN books b ON b.id = bi.book_id
      WHERE lm.id = ?
      ORDER BY bi.is_returned ASC
    `;
        const [rows] = await db.query(sql, [memberId]);
        return rows;
    },

    getAvailQuantity: async (bookId) => {
        const sql = `
      SELECT books.*, IFNULL(book_count.total_issue, 0) AS total_issue
      FROM books
      LEFT JOIN (
        SELECT COUNT(*) AS total_issue, book_id
        FROM book_issues
        WHERE is_returned = 0
        GROUP BY book_id
      ) AS book_count ON books.id = book_count.book_id
      WHERE books.id = ?
    `;
        const [rows] = await db.query(sql, [bookId]);
        return rows[0];
    },

    checkAvailQuantity: async (bookId) => {
        const book = await bookIssueModel.getAvailQuantity(bookId);
        const remaining = book.qty - book.total_issue;
        return remaining <= 0;
    },

    validCheckExists: async (bookId, formValidation) => {
        if (!bookId) return true;
        const notAvailable = await bookIssueModel.checkAvailQuantity(bookId);
        if (notAvailable) {
            formValidation.setMessage('check_exists', 'Book not available');
            return false;
        }
        return true;
    },
};

export default bookIssueModel;
