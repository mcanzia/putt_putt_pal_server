import { db } from '../configs/firebase';
import { Hole } from '../models/dao/Hole';
import { HoleDTO } from '../models/dto/HoleDTO';
import { DatabaseError } from '../util/error/CustomError';

export class HoleDao {

    async getHoles(roomId: string) {
        try {
            let holes: Map<String, HoleDTO> = new Map();

            const holesRef = db.ref(`rooms/${roomId}/holes`);
            const snapshot = await holesRef.once('value');

            if (!snapshot.exists()) {
                throw new Error('No such room found.');
            }

            holes = snapshot.val();
            
            return holes;
        } catch (error) {
            throw new DatabaseError("Could not retrieve holes from database: " + error);
        }
    }

    async getHoleById(roomId: string, holeId: string) {
        try {
            const holeRef = db.ref(`rooms/${roomId}/holes/${holeId}`);
            const snapshot = await holeRef.once('value');
    
            if (!snapshot.exists()) {
                throw new Error('No such hole found in the specified room.');
            }

            const holeData = snapshot.val();
            return { ...holeData };
        } catch (error) {
            throw new DatabaseError("Could not retrieve hole from database: " + error);
        }
    }

    async addHole(roomId: string, hole : HoleDTO){
        try {
            const holesRef = db.ref(`rooms/${roomId}/holes`);
            const newHolesRef = holesRef.push();

            hole.id = newHolesRef.key!;

            await newHolesRef.set(hole);

            const updatedHoles = this.getHoles(roomId);
            return updatedHoles;
        } catch (error) {
            throw new DatabaseError("Could not add hole to database: " + error);
        }
    }

    async updateHole(roomId : string, holeId : string, updatedHole : HoleDTO) {
        try {
            const holeRef = db.ref(`rooms/${roomId}/holes`);

            await holeRef.child(holeId).update(updatedHole);

            const updatedHoles = this.getHoles(roomId);
            return updatedHoles;
        } catch(error) {
            throw new DatabaseError("Could not update hole details: " + error);
        }
    }

    async deleteHole(roomId: string, holeId: string) {
        try {
            const holeRef = db.ref(`rooms/${roomId}/holes/${holeId}`);
            await holeRef.remove();

            const updatedHoles = this.getHoles(roomId);
            return updatedHoles;
        } catch (error) {
            throw new DatabaseError("Could not delete hole from database: " + error);
        }
    }

}