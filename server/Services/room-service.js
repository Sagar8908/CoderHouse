const RoomModel = require("../Models/Roommodel");

exports.create = async (payload) => {
    const { topic, roomType, ownerId } = payload;
    const room = await RoomModel.create({
        topic,
        roomType,
        ownerId,
        speakers: [ownerId],
    });
    return room;
}

exports.getAllRooms = async (types) => {
    const rooms = await RoomModel.find({ roomType: { $in: types } })
        .populate('speakers')
        .populate('ownerId')
        .exec();
    return rooms;
}

exports.getRoom = async(roomId) => {
    const room = await RoomModel.findOne({ _id: roomId });
    return room;
}