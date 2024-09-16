const express = require("express");
const router = express.Router();
const pool = require("../db");

const is_id_valid = async (categoryId) => {
  const is_category_exist_query = `SELECT * FROM categories WHERE id = $1`;
  const category_check_result = await pool.query(is_category_exist_query, [
    categoryId,
  ]);
  if (category_check_result.rows.length === 0) {
    return {
      valid: false,
      error: "Category not exist",
    };
  }
  return {
    valid: true,
    error: null,
  };
};

router.get("/:id", async (req, res) => {
  const categoryId = req.params.id;
  if (!categoryId) {
    return res.status(400).json({
      error: "Missing required parameter: id",
    });
  }
  const is_valid = await is_id_valid(categoryId);
  if (!is_valid.valid) {
    return res.status(400).json({
      error: is_valid.error,
    });
  }
  const get_category_query_title = `SELECT title FROM categories WHERE id = $1`;
  const get_category_result = await pool.query(get_category_query_title, [
    categoryId,
  ]);
  const category_title = get_category_result.rows[0].title;
  const get_items_name_query = `SELECT name FROM items WHERE category_id = $1`;
  const get_items_name_result = await pool.query(get_items_name_query, [categoryId]);
  item_names = get_items_name_result.rows;
  res.status(200).json({
    id: categoryId,
    category: category_title,
    items: item_names,
  });
});

router.post("/", async (req, res) => {
  try {
    await pool.query("BEGIN");
    const title = req.body.name;
    if (!title) {
      throw new Error("Missing required parameter: name");
    }
    if (typeof title !== "string") {
      throw new Error("Title must be a string.");
    }
    const insert_category_query = `INSERT INTO categories (title) VALUES ($1) RETURNING id`;
    const result = await pool.query(insert_category_query, [title]);
    await pool.query("COMMIT");
    res.status(200).json({
      id: result.rows[0].id,
      title: title,
    });
  } catch (error) {
    await pool.query("ROLLBACK");
    res.status(400).json({
      error: error.message,
    });
  }
});

module.exports = router;
