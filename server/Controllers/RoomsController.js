const RoomDto = require('../dtos/rooms');
const { create, getAllRooms,getRoom } = require("../Services/room-service");

exports.create = async (req, res) => {
    const { topic, roomType } = req.body;
    // console.log("kjsdsd");
    if (!topic || !roomType) {
        return res
            .status(400)
            .json({ message: 'All fields are required!' });
    }

    const room = await create({ 
        topic,
        roomType,
        ownerId: req.user._id,
    });

    return res.json(new RoomDto(room));
}

exports.index = async (req, res) => {
    const rooms = await getAllRooms(['open','social','private']);
    // console.log("dsjf");
    const allRooms = rooms.map((room) => new RoomDto(room));
    return res.json(allRooms);
}

exports.show = async(req, res) => {
    const room = await getRoom(req.params.roomId);
    // console.log(room);
    return res.json(room);
}

