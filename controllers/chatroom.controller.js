import Message from "../models/message.model.js"
import Room from "../models/room.model.js"

export const createNewChatRoom = async (req, res) => {
    try {
        const newRoom = new Room(req.body)

        const saved = await newRoom.save()

        res.status(200).json({ message: "Create New Chatroom Successfully!", data: saved })
    } catch (error) {
        res.status(500).json({ message: error.message })
    }
}

export const getAllMessagesByRoomId = async (req, res) => {
    try {

        const { roomId } = req.params
        const limit = parseInt(req.query.limit) || 10
        const skip = parseInt(req.query.skip) || 0



        const messages = await Message
            .find({ roomId: roomId })
            .populate('sender', '_id')
            .sort({ created_at: -1 })
            .skip(skip)
            .limit(limit)

        if (!messages || messages.length === 0) {
            return res.status(404).json({ message: 'Không tìm thấy tin nhắn!' });
        }

        res.status(200).json({ message: "Gửi tin nhắn thành công!", data: messages })
    } catch (error) {
        res.status(500).json({ message: error.message })
    }
}

export const createNewMessage = async (req, res) => {
    try {
        const newMessage = new Message(req.body)

        const saved = await newMessage.save()
        const populatedMessage = await Message.findById(saved._id)
            .populate('sender')
            .exec();

        res.status(200).json({ message: "Thêm tin nhắn thành công!", data: populatedMessage })
    } catch (error) {
        res.status(500).json({ message: error.message })
    }
}

export const getAllRooms = async (req, res) => {
    try {

        const userId = req.user._id


        const rooms = await Room.find({ members: userId })
            .populate({ path: 'members', select: 'username image' })
            .populate('lastMessage.senderId', 'username image')
            .lean()

        const formattedRooms = rooms.map((room) => {
            if (room.roomType == 'private') {
                const otherMember = room.members.find((member) => member._id.toString() !== userId.toString())
                return {
                    ...room,
                    roomName: otherMember.username || 'Unknown User',
                    roomImage: otherMember.image
                }
            }

            return room
        })
        res.status(200).json({ message: 'Get All Rooms Successfully', data: formattedRooms });
    } catch (error) {
        res.status(500).json({ message: 'Get All Rooms Occurred Error', error: error.message });
    }
}

export const findChatRoomByQueries = async (req, res) => {
    try {
        const { userId, userProfileId } = req.query

        const foundChatRoom = await Room.findOne({
            roomType: 'private',
            members: {
                $all: [userId, userProfileId]
            }
        })

        if (foundChatRoom) {
            res.status(200).json({ message: "Get Chatroom Successfully!", data: foundChatRoom })
        } else {
            const roomId = [userId, userProfileId].sort().join("_");
            const newRoom = new Room({
                _id: roomId,
                roomType: "private",
                members: [userId, userProfileId],
                createdBy: userId
            })

            const saved = await newRoom.save()

            res.status(200).json({ message: "Create New Chatroom Successfully!", data: saved })
        }

    } catch (error) {
        res.status(500).json({ message: error.message })
    }
}

export const updateLastMessageForRoomChatById = async (req, res) => {
    try {

        const roomId = req.params.roomId
        const lastMessage = req.body

        const updatedRoom = await Room.findByIdAndUpdate(roomId, { lastMessage: lastMessage }, { new: true })

        res.status(200).json({ message: 'Get All Rooms Successfully', data: updatedRoom });
    } catch (error) {
        res.status(500).json({ message: 'Get All Rooms Occurred Error', error: error.message });
    }
}

export const getRoomById = async (req, res) => {
    try {

        const roomId = req.params.id
        const data = await Room.findById(roomId).populate('members')

        res.status(200).json({ message: 'Lấy dữ liệu chatroom thành công', data: data });
    } catch (error) {
        res.status(500).json({ message: 'Get All Rooms Occurred Error', error: error.message });
    }
}

