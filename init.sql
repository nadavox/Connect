CREATE TABLE categories (
    id SERIAL PRIMARY KEY,
    title VARCHAR(255) NOT NULL UNIQUE
);


CREATE TABLE items (
    id SERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL UNIQUE,
    price DECIMAL NOT NULL,
    category_id INTEGER NOT NULL,
    CONSTRAINT fk_category FOREIGN KEY (category_id) REFERENCES categories(id) ON DELETE CASCADE 
);


CREATE TABLE items_volumes (
    id SERIAL PRIMARY KEY,
    price DECIMAL NOT NULL,
    entries VARCHAR NOT NULL,
    item_id INTEGER NOT NULL,
    CONSTRAINT fk_item FOREIGN KEY (item_id) REFERENCES items(id) ON DELETE CASCADE
);



-- CREATE OR REPLACE FUNCTION check_unique_price()
-- RETURNS TRIGGER AS $$
-- BEGIN
--     IF EXISTS (
--         SELECT 1 
--         FROM item_volumes 
--         WHERE item_id = NEW.item_id 
--         AND price <> NEW.price
--     ) THEN
--         RAISE EXCEPTION 'Cannot insert: item_id % already has a different price', NEW.item_id;
--     END IF;

--     RETURN NEW;
-- END;
-- $$ LANGUAGE plpgsql;



-- CREATE TRIGGER check_unique_price_trigger
-- BEFORE INSERT OR UPDATE ON item_volumes
-- FOR EACH ROW EXECUTE FUNCTION check_unique_price();



INSERT INTO categories (title) VALUES 
('Electronics'), 
('Home Appliances');


INSERT INTO items (name, price, category_id) VALUES
('Laptop',1 , 1), 
('Smartphone',2 , 1), 
('Television',3 , 1), 
('Refrigerator',4 , 2), 
('Microwave',5 , 2), 
('Washing Machine',6 , 2), 
('Tablet',7 , 1), 
('Air Conditioner',8 , 2), 
('Camera',9 , 1), 
('Blender',10 , 2);


INSERT INTO items_volumes (price, entries, item_id) VALUES
(1000, '10', 1), -- Laptop
(10009, '11', 1), -- Laptop
(800, '12', 2), -- Smartphone
(8009, '13', 2), -- Smartphone
(500, '14', 3), -- Television
(5009, '15', 3), -- Television
(1500, '16', 4), -- Refrigerator
(15009, '17', 4), -- Refrigerator
(250, '18', 5), -- Microwave
(4509, '19', 6), -- Washing Machine
(800, '20', 7), -- Tablet
(12009, '21', 8), -- Air Conditioner
(350, '22', 9), -- Camera
(50, '23', 10), -- Blender
(509, '24', 10); -- Blender
