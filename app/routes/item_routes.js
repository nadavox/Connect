const express = require("express");
const router = express.Router();
const pool = require("../db");

const get_volumes_per_item = async (item) => {
  const get_items_volume_query = `SELECT entries, price FROM items_volumes WHERE item_id = $1`;
  const get_items_volume_result = await pool.query(get_items_volume_query, [
    item.category_id,
  ]);
  item.volumes = get_items_volume_result.rows;
  return item;
};

router.get("/search", async (req, res) => {
  try {
    data = { categories: [], items: [], errors: [] };
    const search_string = req.query.query;
    if (!search_string) {
      throw new Error("Query parameter 'query' is required");
    }
    words = search_string.split(" ");
    const get_item_query = `SELECT * FROM items WHERE name = $1`;
    const get_category_query = `SELECT * FROM categories WHERE title = $1`;
    for (let word of words) {
      const get_item_result = await pool.query(get_item_query, [word]);
      if (get_item_result.rows.length > 0) {
        // word is an item
        const item = await get_volumes_per_item(get_item_result.rows[0]);
        data.items.push(item);
        continue;
      }
      const get_category_result = await pool.query(get_category_query, [word]);
      if (get_category_result.rows.length > 0) {
        // word is a category
        data.categories.push(get_category_result.rows[0]);
        continue;
      }
      data.errors.push({ word: word, error: "No item or category found" });
    }
    res.status(200).json(data);
  } catch (error) {
    res.status(400).json({
      error: error.toString(),
    });
  }
});

router.get("/:id", async (req, res) => {
  const id = req.params.id;
  const get_item_query = `SELECT * FROM items WHERE id = $1`;
  const get_item_result = await pool.query(get_item_query, [id]);
  if (get_item_result.rows.length === 0) {
    return res.status(404).json({
      error: "Item not found",
    });
  }
  const item = get_volumes_per_item(get_item_result.rows[0]);
  res.status(200).json(item);
});

module.exports = router;
