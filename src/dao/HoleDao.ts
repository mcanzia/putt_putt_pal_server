import { db } from '../configs/firebase';
import { HoleDTO } from '../models/dto/HoleDTO';
import { DatabaseError } from '../util/error/CustomError';
import redisClient from '../redisClient';
import { inject, injectable } from 'inversify';
import { TYPES } from '../configs/types';
import { Server } from 'socket.io';

@injectable()
export class HoleDao {

    constructor(@inject(TYPES.SocketIO) private io: Server) {}

    async getHoles(roomId: string) {
        try {
            const cacheKey = `holes:${roomId}`;
            const cachedHoles = await redisClient.get(cacheKey);
            if (cachedHoles) {
                return JSON.parse(cachedHoles);
            }

            let holes: Map<String, HoleDTO> = new Map();

            const holesRef = db.ref(`rooms/${roomId}/holes`);
            const snapshot = await holesRef.once('value');

            if (!snapshot.exists()) {
                throw new Error('No such room found.');
            }

            holes = snapshot.val();
            
            await redisClient.set(cacheKey, JSON.stringify(holes), {
                EX: 60
            });

            return holes;
        } catch (error) {
            throw new DatabaseError("Could not retrieve holes from database: " + error);
        }
    }

    async getHoleById(roomId: string, holeId: string) {
        try {
            const cacheKey = `hole:${roomId}:${holeId}`;
            const cachedHole = await redisClient.get(cacheKey);
            if (cachedHole) {
                return JSON.parse(cachedHole);
            }

            const holeRef = db.ref(`rooms/${roomId}/holes/${holeId}`);
            const snapshot = await holeRef.once('value');
    
            if (!snapshot.exists()) {
                throw new Error('No such hole found in the specified room.');
            }

            const holeData = snapshot.val();
            const hole = { ...holeData };

            await redisClient.set(cacheKey, JSON.stringify(hole), {
                EX: 60
            });

            return hole;
        } catch (error) {
            throw new DatabaseError("Could not retrieve hole from database: " + error);
        }
    }

    async addHole(roomId: string, hole: HoleDTO) {
        try {
            const holesRef = db.ref(`rooms/${roomId}/holes`);
            const newHolesRef = holesRef.push();

            hole.id = newHolesRef.key!;

            await newHolesRef.set(hole);

            await redisClient.del(`holes:${roomId}`);

            const updatedHoles = await this.getHoles(roomId);
            return updatedHoles;
        } catch (error) {
            throw new DatabaseError("Could not add hole to database: " + error);
        }
    }

    async updateHole(roomId: string, holeId: string, updatedHole: HoleDTO) {
        try {
            const holeRef = db.ref(`rooms/${roomId}/holes`);

            await holeRef.child(holeId).update(updatedHole);

            await redisClient.del(`hole:${roomId}:${holeId}`);
            await redisClient.del(`holes:${roomId}`);

            return updatedHole;
        } catch (error) {
            throw new DatabaseError("Could not update hole details: " + error);
        }
    }

    async deleteHole(roomId: string, holeId: string) {
        try {
            const holeRef = db.ref(`rooms/${roomId}/holes/${holeId}`);
            await holeRef.remove();

            await redisClient.del(`hole:${roomId}:${holeId}`);
            await redisClient.del(`holes:${roomId}`);

            const updatedHoles = await this.getHoles(roomId);
            return updatedHoles;
        } catch (error) {
            throw new DatabaseError("Could not delete hole from database: " + error);
        }
    }
}
