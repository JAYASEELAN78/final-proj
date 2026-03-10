import Order from '../models/Order.js';

export const createOrder = async (req, res) => {
    try {
        const order = new Order(req.body);
        await order.save();
        res.status(201).json(order);
    } catch (err) { res.status(400).json({ error: err.message }); }
};

export const getOrders = async (req, res) => {
    try {
        const orders = await Order.find()
            .populate('company_id')
            .populate('user_id', 'name email')
            .sort({ createdAt: -1 });
        res.json(orders);
    } catch (err) { res.status(500).json({ error: err.message }); }
};

export const updateOrder = async (req, res) => {
    try {
        const order = await Order.findByIdAndUpdate(req.params.id, req.body, { new: true });
        res.json(order);
    } catch (err) { res.status(400).json({ error: err.message }); }
};