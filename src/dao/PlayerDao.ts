import { db } from '../configs/firebase';
import { Player } from '../models/dao/Player';
import { PlayerDTO } from '../models/dto/PlayerDTO';
import { DatabaseError } from '../util/error/CustomError';

export class PlayerDao {

    async getPlayers(roomId: string) {
        try {
            let players: Array<PlayerDTO> = [];

            const playersRef = db.ref(`rooms/${roomId}/players`);
            const snapshot = await playersRef.once('value');

            if (!snapshot.exists()) {
                throw new Error('No such room found.');
            }

            const playersData = snapshot.val();
            players = Object.keys(playersData).map(key => ({
                id: key,
                ...playersData[key]
            }));

            
            return players;
        } catch (error) {
            throw new DatabaseError("Could not retrieve players from database: " + error);
        }
    }

    async getPlayerById(roomId: string, playerId: string) {
        try {
            const playerRef = db.ref(`rooms/${roomId}/players/${playerId}`);
            const snapshot = await playerRef.once('value');
    
            if (!snapshot.exists()) {
                throw new Error('No such player found in the specified room.');
            }

            const playerData = snapshot.val();
            return { id: playerId, ...playerData };
        } catch (error) {
            throw new DatabaseError("Could not retrieve player from database: " + error);
        }
    }

    async addPlayer(roomId: string, player : Player){
        try {
            const playersRef = db.ref(`rooms/${roomId}/players`);
            const newPlayersRef = playersRef.push();

            await newPlayersRef.set(player);

            const updatedPlayers = this.getPlayers(roomId);
            return updatedPlayers;
        } catch (error) {
            throw new DatabaseError("Could not add player to database: " + error);
        }
    }

    async updatePlayer(roomId : string, playerId : string, updatedPlayer : Player) {
        try {
            const playerRef = db.ref(`rooms/${roomId}/players`);

            await playerRef.child(playerId).update(updatedPlayer);

            const updatedPlayers = this.getPlayers(roomId);
            return updatedPlayers;
        } catch(error) {
            throw new DatabaseError("Could not update player details: " + error);
        }
    }

    async deletePlayer(roomId: string, playerId: string) {
        try {
            const playerRef = db.ref(`rooms/${roomId}/players/${playerId}`);
            await playerRef.remove();

            const updatedPlayers = this.getPlayers(roomId);
            return updatedPlayers;
        } catch (error) {
            throw new DatabaseError("Could not delete player from database: " + error);
        }
    }


}