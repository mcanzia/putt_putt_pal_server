const functions = require('firebase-functions');
const admin = require('firebase-admin');
admin.initializeApp();

const db = admin.database();

// Scheduled function to delete inactive rooms every hour
exports.deleteInactiveRooms = functions.pubsub.schedule('every 60 minutes').onRun(async () => {
    const roomsRef = db.ref('rooms');
    const now = Date.now();
    const oneHourAgo = now - 3600000; // 3600000 ms = 1 hour

    try {
        const snapshot = await roomsRef.once('value');
        if (!snapshot.exists()) {
            console.log('No rooms found');
            return null;
        }

        const updates = {};
        snapshot.forEach(childSnapshot => {
            const roomId = childSnapshot.key;
            const roomData = childSnapshot.val();
            if (roomData.lastActivity && roomData.lastActivity < oneHourAgo) {
                console.log(`Deleting inactive room ${roomId}`);
                updates[`rooms/${roomId}`] = null;
            }
        });

        await roomsRef.update(updates);
        console.log('Deleted inactive rooms');
    } catch (error) {
        console.error('Error deleting inactive rooms:', error);
    }

    return null;
});
