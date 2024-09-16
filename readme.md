### before running the app:
1. make sure that you have docker installed on your machine.
2. make sure that you have docker-compose installed on your machine.
3. make sure that for each request you have the api-key header:
```bash
api-key: api-key-Connect
```

# how to run the app:
1. clone the repository.
2. open the terminal and navigate to the project folder.
3. run the next command:
```bash
docker-compose up --build
```
4. the app will be running on localhost:3000
5. to stop the app and remove the containers:
```bash
docker-compose down -v 
```


after you attached the api-key header to the request, you can use the following endpoints:
1. POST /items - to add a new item.
2. GET /categories/:id - to get the category by id and all the items in this category.
3. GET /items - to get all the items.
4. GET /item/:id - to get the item by id.
6. GET /items/search - to search for items or catergories by name.
7. POST /categories - to add a new category.

### after you attached the api-key you can check first that everything is working by:
1. go to the browser and open the app on localhost:3000 - you should see hello world.
2. the DB is running and we can connect to it using the terminal.
 run the next command:
 ```bash
 docker ps
 ```
 find the <container_id> of the postgres:latest container so we can connect to the database using the terminal.
 for connecting to the database using the terminal:
 ```bash
 docker exec -it <container_id> psql -U Connect -d Connect_DB
 ```

 to see the tables in the database:
 ```bash
    \dt
```

to see the content of the table:
```bash
    SELECT * FROM items;
    SELECT * FROM items_volumes;
    SELECT * FROM categories;
```


Database Management: You can connect to your PostgreSQL database using any database client (like pgAdmin, DBeaver, etc.) with the following connection settings:

Host: localhost
Port: 5432
User: Connect
Password: Connect
Database: Connect_DB