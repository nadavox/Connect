const express = require("express");
const router = express.Router();
const pool = require("../db");

const is_post_request_body_valid = (name, price, categoryId, volumes) => {
  // Check for missing required fields
  if (!name || !price || !categoryId || !volumes) {
    return {
      valid: false,
      error: "All fields (name, price, categoryId, volumes) are required.",
    };
  }

  // Validate types of the fields
  if (typeof name !== "string") {
    return {
      valid: false,
      error: "Name must be a string.",
    };
  }
  if (typeof price !== "number") {
    return {
      valid: false,
      error: "Price must be a number.",
    };
  }
  if (typeof categoryId !== "number") {
    return {
      valid: false,
      error: "CategoryId must be a number.",
    };
  }
  if (!Array.isArray(volumes)) {
    return {
      valid: false,
      error: "Volumes must be an array.",
    };
  }

  // Validate each volume object
  for (let volume of volumes) {
    if (typeof volume.price !== "number") {
      return {
        valid: false,
        error: "Each volume's price must be a number.",
      };
    }
    if (typeof volume.value !== "string") {
      return {
        valid: false,
        error: "Each volume's value must be a string.",
      };
    }
  }

  // If all validations pass
  return {
    valid: true,
    error: null,
  };
};

router.post("/", async (req, res) => {
  await pool.query("BEGIN");
  try {
    const { name, price, categoryId, volumes } = req.body;
    // validate the request
    const is_valid = is_post_request_body_valid(name, price, categoryId, volumes);
    if (!is_valid.valid) {
      return res.status(400).json({
        error: is_valid.error,
      });
    }
    // first need to check if the category_id is exists in categories table
    const category_check_query = `SELECT * FROM categories WHERE id = $1`;
    const category_check_result = await pool.query(category_check_query, [
      categoryId,
    ]);
    if (category_check_result.rows.length === 0) {
      return res.status(404).json({
        error: "Category not found",
      });
    }
    const item_check_query = `SELECT * FROM items WHERE name = $1`;
    const item_check_result = await pool.query(item_check_query, [name]);

    // Update existing item TODO: not working for now need to wait for thier respond.
    if (item_check_result.rows.length > 0) {
      return res.status(404).json({ "error:": "Item already exists" });
      const update_item = `
        UPDATE items
        SET name = $1, category_id = $2
        WHERE category_id = $3
        RETURNING *
        `;
      const updated_item = await pool.query(update_item, [
        name,
        categoryId,
        categoryId,
      ]);
      res.status(200).json({
        id: updated_item.rows[0].category_id,
        name: updated_item.rows[0].name,
        volumes: updated_item.rows[0].volumes,
      });
    } else {
      // Insert new item
      const insert_query = `
        INSERT INTO items (name, price, category_id)
        VALUES ($1, $2, $3)
        RETURNING *
        `;
      const new_item = await pool.query(insert_query, [
        name,
        price,
        categoryId,
      ]);
      const new_item_id = new_item.rows[0].id;
      const insert_volume_query =
        "INSERT INTO items_volumes (price, entries, item_id) VALUES ($1, $2, $3)";
      for (let volume of volumes) {
        await pool.query(insert_volume_query, [
          volume.price,
          volume.value,
          new_item_id,
        ]);
      }

      await pool.query("COMMIT");

      const volume_query = `
    SELECT price, entries FROM items_volumes WHERE item_id = $1
    `;
      const inserted_volumes = await pool.query(volume_query, [new_item_id]);
      res.status(200).json({
        id: new_item.rows[0].category_id,
        name: new_item.rows[0].name,
        volumes: inserted_volumes.rows,
      });
    }
  } catch (err) {
    await pool.query("ROLLBACK");
    console.error(err.message);

    res.status(500).json({
      message: "Failed to insert item.",
      error: err.message,
    });
  }
});

router.get("", async (req, res) => {
  // Get all items
  const get_all_items_query = `
    SELECT *
    FROM items
  `;
  const get_items_values_query = `
    SELECT entries, price
    FROM items_volumes
    WHERE item_id = $1
  `;
  const items = await pool.query(get_all_items_query);
  const data = [];
  for (let item of items.rows) {
    const item_volumes = await pool.query(get_items_values_query, [item.id]);
    item.volumes = item_volumes.rows;
    // remove the id from the item object
    delete item.category_id;
    data.push(item);
  }
  res.status(200).json(data);
}
);

module.exports = router;
