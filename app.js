const express = require('express');
const app = express();
const cors = require('cors');
const cookieParser = require('cookie-parser');
app.use(express.json());
app.use(cookieParser());
app.use(cors({
    origin: 'http://localhost:3000',
    credentials: true
}))

// import models
const db = require('./models')

//import route
const userRoute = require('./Routes/User');
app.use('/api/users', userRoute)

//books route
const bookRoute = require('./Routes/Book');
app.use('/api/books', bookRoute);

//category route
const categoryRoute = require('./Routes/Category');
app.use('/api/category', categoryRoute);

//order route
const orderRoute = require('./Routes/Order');
app.use('/api/order', orderRoute);


const PORT = 3004;

db.sequelize.sync().then(() => {
    app.listen(PORT, () => {
        console.log(`Connected....... on ${PORT}`);
    })
})
