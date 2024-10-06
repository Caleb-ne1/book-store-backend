const express = require('express');
const router = express.Router();
const {Order, OrderItem, User, Book } = require('../models');
const {validateToken } = require('../Middleware/jwt')


router.post('/', validateToken, async(req, res) => {
    const userId = req.userId
    const {items} = req.body;

    try {
        const totalAmount = items.reduce((sum, item) => sum + (item.price * item.quantity), 0);
        const newOrder = await Order.create({
            userId : userId,
            totalAmount: totalAmount,
            orderDate: new Date()
        });

        const orderItems = items.map(item => ({
            orderId: newOrder.id,
            productId: item.productId,
            quantity: item.quantity,
            price: item.price
        }));

        await OrderItem.bulkCreate(orderItems);

        return res.status(201).json({message: 'order placed successfully', order: newOrder, items: orderItems})
    } catch (err) {
        res.status(500).json({Error: "Internal server error"})
    }
})

//get order details
router.get('/', validateToken, async (req, res) => {
    try {
        const orders = await Order.findAll({
            include: [{
                model: User,
                attributes: ['name']
            }],
            attributes: ['id', 'totalAmount', 'orderDate', 'orderStatus']
        })

        if(!orders) {
            res.status(404).json({message: "No orders found"})
        } else {
            const orderDetails = orders.map(order => ({
                order_id: order.id,
                customer: order.User.name,
                date: order.orderDate,
                total: order.totalAmount,
                orderStatus: order.orderStatus
              }));

              return res.status(200).json(orderDetails);
        }
    } catch (error) {
        res.status(400).json({Error: error})
    }
})

//order detail

router.get('/order-detail/:id', async (req, res) => {
    const { id } = req.params;

    try {
        const order = await Order.findOne({
            where: { id },
            include: [
                {
                    model: OrderItem,
                    attributes: ['productId', 'quantity', 'price'],
                    where: { orderId: id },
                    include: [
                        {
                            model: Book,
                            attributes: ['id', 'title'],
                            required: true
                        }
                    ]
                }
            ]
        });

        if (!order) {
            return res.status(404).json({ error: 'Order not found' });
        }

        res.json({ order });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Internal server error' });
    }
});


//update the order status
router.put('/:id', validateToken, async (req, res) => {
    const { id } = req.params;
    const { orderStatus } = req.body;

    try {
        const order = await Order.findByPk(id);
        if (!order) {
            return res.status(404).json({ error: 'Order not found' });
        }

        if (orderStatus) {
            order.orderStatus = orderStatus;
            await order.save();
        }
        res.status(200).json({ message: 'Order status updated successfully', order });
    } catch (error) {
        console.error('Error updating order status:', error);
        res.status(500).json({ error: 'Internal server Error' });
    }
});

//order count
router.get('/count', validateToken, async(req, res) => {
    try {
        const ordersCount = await Order.count();
        res.status(200).json({total: ordersCount})
    } catch (error) {
        res.json({Error: error})
    }
})




module.exports = router;
