const Jimp = require('jimp');
const path = require('path');
const sharp = require('sharp');

const { findUser, createUser } = require("../Services/user-service");
const UserDto = require('../dtos/user-dtos');

exports.activate = async (req, res) => {
    const { name, avatar } = req.body;
    if (!name || !avatar) {
        res.status(400).json({ message: 'All fields are required!' });
        return;
    }

    // Image Base64
    const buffer = Buffer.from(
        avatar.replace(/^data:image\/(png|jpg|jpeg);base64,/, ''),
        'base64'
    );

    const imagePath = `${Date.now()}-${Math.round(
        Math.random() * 1e9
    )}.png`;
    // 32478362874-3242342342343432.png

    try {
        // Resize image
        sharp(buffer)
        .resize(150, null) // Resize to width 150px, maintain aspect ratio
            .toFile(`./storage/${imagePath}`)
            .then(() => {
                // Image resized successfully
            })
            .catch(err => {
                // Error handling
            });

    } catch (err) {
        res.status(500).json({ message: 'Could not process the image' });
        return;
    }

    const userId = req.user._id;

    try {
        const user = await findUser({ _id: userId });
        if (!user) {
            res.status(404).json({ message: 'User not found!' });
        }
        user.activated = true;
        user.name = name;
        user.avatar = `/storage/${imagePath}`;
        user.save();
        res.json({ user: new UserDto(user), auth: true });
        return;
    } catch (err) {
        res.status(500).json({ message: 'Something went wrong!' });
        return;
    }

}