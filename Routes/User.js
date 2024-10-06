const express = require('express')
const router = express.Router()
const bcrypt = require('bcrypt');
const { User } = require("../models");
const { generateToken, validateToken } = require('../Middleware/jwt');



router.post('/register', async (req, res) => {
    try {
        const { name, email, password, role } = req.body;
        const hashPassword = await bcrypt.hash(password, 10);

        await User.create({
            name,
            email,
            password: hashPassword,
            role,
        });

        res.status(201).json({ message: "Registration successful" });
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
});

router.post('/login', async (req, res) => {
    const { email, password } = req.body;

    if (!email || !password) {
        return res.status(400).json({ error: "Email and password are required" });
    }

    try {
        const user = await User.findOne({ where: { email: email } });

        if (!user) {
            return res.status(400).json({ error: "User does not exist" });
        }

        const hashedPassword = user.password;
        const match = await bcrypt.compare(password, hashedPassword);

        if (!match) {
            return res.status(400).json({ error: "Wrong username or password" });
        }

        const accessToken = generateToken(user);

        res.cookie("accessToken", accessToken, {
            httpOnly: true,
            maxAge: 2592000000
        });

        return res.json({ message: `Welcome ${user.name}`, userId: user.id });

    } catch (err) {
        console.error(err);
        return res.status(500).json({ error: "Internal server error" });
    }
});

router.put('/update-profile',  validateToken, async (req, res) => {
    try {
        const { name, email, password } = req.body;
        const userId = req.user.id;


        const user = await User.findByPk(userId);
        if (!user) {
            return res.status(404).json({ error: 'User not found' });
        }


        if (name) {
            user.name = name;
        }

        if (email) {
            user.email = email;
        }


        if (password) {
            const hashPassword = await bcrypt.hash(password, 10);
            user.password = hashPassword;
        }

        await user.save();

        res.status(200).json({ message: 'Profile updated successfully' });
    } catch (err) {
        res.status(500).json({ error: 'An error occurred while updating profile' });
    }
});

//get all users
router.get('/all', validateToken, (req, res) => {
    const user = User.findAll()
    .then(users => {
        res.json(user);
    })
    .catch(err => {
        console.error('Error fetching users:', err);
    });
})

//count users
router.get('/count', async (req, res) => {
    try {
        const usersCount = await User.count()
        res.status(200).json({total : usersCount})
    } catch (error) {
        res.json({Error: err})
    }
})

router.put('/profile/update', validateToken, async (req, res) => {
    try {
        const id = req.params.userId
        const userId = req.userId;
        const { name, email } = req.body;

        if (!userId) {
            return res.status(404).json({ error: 'User not authenticated' });
        }

        const user = await User.findOne( {where: {userId: id}});

        if (!user) {
            return res.status(404).json({ error: 'User not found' });
        }

        user.name = name || user.name;
        user.email = email || user.email;

        await user.save();

        res.json({ success: true, message: 'Profile updated successfully', user });
    } catch (error) {
        console.error("Error updating profile:", error);
        res.status(500).json({ error: 'An error occurred while updating profile' });
    }
});



module.exports = router
