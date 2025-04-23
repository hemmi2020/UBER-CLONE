const socketIo = require('socket.io');
const userModel = require('./models/user.model');
const captainModel = require('./models/captain.model');

let io;

function initializeSocket(server) {
    io = socketIo(server, {
        cors: {
            origin: '*',
            methods: ['GET', 'POST']
        }
    });

    io.on('connection', (socket) => {
        console.log(`Client connected: ${socket.id}`);

        socket.on('join', async (data) => {
            const { userId, userType } = data;
        
            console.log(`User joined: ${userId}, Type: ${userType}, Socket ID: ${socket.id}`);
        
            try {
                if (userType === 'user') {
                    const updatedUser = await userModel.findByIdAndUpdate(
                        userId, 
                        { socketId: socket.id },
                        { new: true }  // Return the updated document
                    );
                    console.log(`Updated user ${userId} with socketId ${socket.id}`);
                    console.log(`User after update:`, updatedUser);
                } else if (userType === 'captain') {
                    const updatedCaptain = await captainModel.findByIdAndUpdate(
                        userId, 
                        { socketId: socket.id, status: "active" },
                        { new: true }  // Return the updated document
                    );
                    console.log(`Updated captain ${userId} with socketId ${socket.id} and status active`);
                    console.log(`Captain after update:`, updatedCaptain);
                    
                    // Verify the update was successful
                    const verifiedCaptain = await captainModel.findById(userId);
                    console.log(`Verified captain from DB:`, verifiedCaptain);
                    
                    if (verifiedCaptain.socketId !== socket.id) {
                        console.error(`Socket ID mismatch! Expected: ${socket.id}, Got: ${verifiedCaptain.socketId}`);
                    }
                }
            } catch (error) {
                console.error(`Error updating socketId for ${userType} ${userId}:`, error);
            }
        });

        socket.on('update-location-captain', async (data) => {
            const { userId, location } = data;
            console.log(`Updating location for captain ${userId}:`, location);

            if (!location || !location.ltd || !location.lng) {
                return socket.emit('error', { message: 'Invalid location data' });
            }

            try {
                await captainModel.findByIdAndUpdate(userId, {
                    location: {
                        lng: location.lng,
                        ltd: location.ltd,
                    },
                    geoLocation: {
                        type: "Point",
                        coordinates: [location.lng, location.ltd]
                    },
                    status: "active"
                });

                console.log(`Location updated for captain ${userId}`);

                const captain = await captainModel.findById(userId);
                if (captain && captain.geoLocation) {
                    const captainsInRadius = await captainModel.find({
                        _id: { $ne: userId },
                        status: "active",
                        geoLocation: {
                            $nearSphere: {
                                $geometry: captain.geoLocation,
                                $maxDistance: 10000
                            }
                        }
                    });
                    io.to(socket.id).emit('captains-in-radius', captainsInRadius);
                    captainsInRadius.forEach(captainInRadius => {
                        io.to(captainInRadius.socketId).emit('captain-location-updated', captain);
                    });
                }
            } catch (error) {
                console.error(`Error updating location for captain ${userId}:`, error);
                socket.emit('error', { message: 'Failed to update location' });
            }
        });

        socket.on('disconnect', async () => {
            console.log(`Client disconnected: ${socket.id}`);
            try {
                const captain = await captainModel.findOne({ socketId: socket.id });
                if (captain) {
                    await captainModel.findByIdAndUpdate(captain._id, { socketId: null, status: "inactive" });
                    console.log(`Captain ${captain._id} set to inactive due to disconnect`);
                }
                const user = await userModel.findOne({ socketId: socket.id });
                if (user) {
                    await userModel.findByIdAndUpdate(user._id, { socketId: null });
                    console.log(`User ${user._id} socketId cleared due to disconnect`);
                }
            } catch (error) {
                console.error('Error handling disconnect cleanup:', error);
            }
        });
    });
}

const sendMessageToSocketId = (socketId, messageObject) => {
    console.log(`Sending message to socketId: ${socketId}`, JSON.stringify(messageObject, null, 2));
  
    if (io && socketId) {
      io.to(socketId).emit(messageObject.event, messageObject.data);
      console.log(`Emitted ${messageObject.event} event to socket ${socketId}`);
    } else {
      console.error('Socket.io not initialized or invalid socketId:', socketId);
    }
  }

  async function verifyActiveCaptains() {
    try {
        const activeCaptains = await captainModel.find({ status: "active" });
        console.log(`Found ${activeCaptains.length} active captains:`);
        
        activeCaptains.forEach(captain => {
            console.log(`Captain ID: ${captain._id}, Socket ID: ${captain.socketId}, Status: ${captain.status}`);
            
            // Check if the socket is actually connected
            if (captain.socketId && io) {
                const socket = io.sockets.sockets.get(captain.socketId);
                console.log(`Socket ${captain.socketId} connected: ${!!socket}`);
            }
        });
        
        return activeCaptains;
    } catch (error) {
        console.error('Error verifying active captains:', error);
        return [];
    }
}

// Export the function
module.exports = { 
    initializeSocket, 
    sendMessageToSocketId, 
    verifyActiveCaptains 
};
