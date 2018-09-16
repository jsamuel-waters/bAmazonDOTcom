-- drops the database if it exists already -- 
DROP DATABASE IF EXISTS bamazon_DB; 
-- create the "bamazon_db" database -- 
CREATE DATABASE bamazon_DB; 

-- Make it so all of the following code will affect bamazon_db --
USE bamazon_DB; 


CREATE TABLE products(
    id INTEGER(10), 
    product_name VARCHAR(100) NOT NULL, 
    department_name VARCHAR(100) NOT NULL, 
    price DECIMAL(15,2),
    stock_quantity INTEGER(10),
    PRIMARY KEY (id)
);

INSERT INTO products (id, product_name, department_name, price, stock_quantity)
VALUES (5, "Pokemon Cards", "Toys", 3.50, 75); 

INSERT INTO products (id, product_name, department_name, price, stock_quantity)
VALUES (8, "Digimon Cards", "Toys", 4.50, 109); 

INSERT INTO products (id, product_name, department_name, price, stock_quantity)
VALUES (81, "Nerf Guns", "Toys", 19.50, 34); 

INSERT INTO products (id, product_name, department_name, price, stock_quantity)
VALUES (19, "iPods", "Electronics", 300.00, 300); 

INSERT INTO products (id, product_name, department_name, price, stock_quantity)
VALUES (11, "Rubber Ducks", "Electronics", 1.50, 200); 

INSERT INTO products (id, product_name, department_name, price, stock_quantity)
VALUES (99, "Punching Bags", "MMA", 500.00, 18); 

INSERT INTO products (id, product_name, department_name, price, stock_quantity)
VALUES (98, "Boxing Gloves", "MMA", 49.70, 50); 

INSERT INTO products (id, product_name, department_name, price, stock_quantity)
VALUES (97, "Wrist Wraps", "MMA", 10.50, 32); 

INSERT INTO products (id, product_name, department_name, price, stock_quantity)
VALUES (96, "Shin Guards", "MMA", 100.00, 45); 

INSERT INTO products (id, product_name, department_name, price, stock_quantity)
VALUES (94, "Mouth Guard", "MMA", 8.50, 93); 

SELECT * FROM products; 