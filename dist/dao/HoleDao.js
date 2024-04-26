"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.HoleDao = void 0;
const firebase_1 = require("../configs/firebase");
const CustomError_1 = require("../util/error/CustomError");
class HoleDao {
    async getHoles(roomId) {
        try {
            let holes = [];
            const holesRef = firebase_1.db.ref(`rooms/${roomId}/holes`);
            const snapshot = await holesRef.once('value');
            if (!snapshot.exists()) {
                throw new Error('No such room found.');
            }
            const holesData = snapshot.val();
            holes = Object.keys(holesData).map(key => ({
                id: key,
                ...holesData[key]
            }));
            return holes;
        }
        catch (error) {
            throw new CustomError_1.DatabaseError("Could not retrieve holes from database: " + error);
        }
    }
    async getHoleById(roomId, holeId) {
        try {
            const holeRef = firebase_1.db.ref(`rooms/${roomId}/holes/${holeId}`);
            const snapshot = await holeRef.once('value');
            if (!snapshot.exists()) {
                throw new Error('No such hole found in the specified room.');
            }
            const holeData = snapshot.val();
            return { id: holeId, ...holeData };
        }
        catch (error) {
            throw new CustomError_1.DatabaseError("Could not retrieve hole from database: " + error);
        }
    }
    async addHole(roomId, hole) {
        try {
            const holesRef = firebase_1.db.ref(`rooms/${roomId}/holes`);
            const newHolesRef = holesRef.push();
            await newHolesRef.set(hole);
            const updatedHoles = this.getHoles(roomId);
            return updatedHoles;
        }
        catch (error) {
            throw new CustomError_1.DatabaseError("Could not add hole to database: " + error);
        }
    }
    async updateHole(roomId, holeId, updatedHole) {
        try {
            const holeRef = firebase_1.db.ref(`rooms/${roomId}/holes`);
            await holeRef.child(holeId).update(updatedHole);
            const updatedHoles = this.getHoles(roomId);
            return updatedHoles;
        }
        catch (error) {
            throw new CustomError_1.DatabaseError("Could not update hole details: " + error);
        }
    }
    async deleteHole(roomId, holeId) {
        try {
            const holeRef = firebase_1.db.ref(`rooms/${roomId}/holes/${holeId}`);
            await holeRef.remove();
            const updatedHoles = this.getHoles(roomId);
            return updatedHoles;
        }
        catch (error) {
            throw new CustomError_1.DatabaseError("Could not delete hole from database: " + error);
        }
    }
}
exports.HoleDao = HoleDao;
