# Todo List RESTful API with Express.js, Mongoose.js, MongoDB

## Welcome to the Todo List RESTful API!

## Installation

1. Clone this repository:

    ```bash
    git clone https://github.com/mihirmore25/todo_list.git

    ```

2. `cd todo_list`

3. `npm install`

4. For Mongoose connection with MongoDB Use, user authentication & authorization or you can remove the code from line no. 11 to line no. 17 in `db/dbConnection.js`

```javascript
const connectionInstance = await mongoose.connect(`${process.env.MONGO_URI}/${DB_NAME}`)

// Add above code in dbConnection.js, without authentication or auhtorization 

```

### For Environment Variables Take a help from `.env_example` for your reference

## To run application development environment

5. `npm run dev`

### After running the above command in the terminal you should see something like:

```bash
$ npm run dev

> todo_list@1.0.0 dev
> nodemon server.js  

[nodemon] 3.1.4
[nodemon] to restart at any time, enter `rs`  
[nodemon] watching path(s): *.*
[nodemon] watching extensions: js,mjs,cjs,json
[nodemon] starting `node server.js`
Server is running/listening on port 3000
MONGODB CONNECTED! ON DB HOST: 127.0.0.1 ON PORT: 27017
```
