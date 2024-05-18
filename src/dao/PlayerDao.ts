import { db } from '../configs/firebase';
import { PlayerDTO } from '../models/dto/PlayerDTO';
import { DatabaseError } from '../util/error/CustomError';

export class PlayerDao {

    async getPlayers(roomId: string) {
        try {
            let players: Map<string, PlayerDTO> = new Map();

            const playersRef = db.ref(`rooms/${roomId}/players`);
            const snapshot = await playersRef.once('value');

            if (!snapshot.exists()) {
                throw new Error('No such room found.');
            }

            players = snapshot.val();

            return players;
        } catch (error) {
            throw new DatabaseError("Could not retrieve players from database: " + error);
        }
    }

    async getPlayerById(roomId: string, playerId: string): Promise<PlayerDTO> {
        try {
            const playerRef = db.ref(`rooms/${roomId}/players/${playerId}`);
            const snapshot = await playerRef.once('value');
    
            if (!snapshot.exists()) {
                throw new Error('No such player found in the specified room.');
            }

            const playerData = snapshot.val();
            return new PlayerDTO(
                playerId,
                playerData.name,
                playerData.isHost,
                playerData.color
            );
        } catch (error) {
            throw new DatabaseError("Could not retrieve player from database: " + error);
        }
    }

    async addPlayer(roomId: string, player: PlayerDTO) {
        try {
            const roomsRef = db.ref('rooms');
            const playersRef = await roomsRef.child(`${roomId}/players`).push();

            player.id = playersRef.key!;

            console.log(`ADDPLAYER ${JSON.stringify(player)}`);

            await playersRef.set(player);

            const updatedPlayers = await this.getPlayers(roomId);
            return updatedPlayers;
        } catch (error) {
            throw new DatabaseError("Could not add player to database: " + error);
        }
    }

    async updatePlayer(roomId: string, playerId: string, updatedPlayer: PlayerDTO): Promise<Map<string, PlayerDTO>> {
        try {
            const playerRef = db.ref(`rooms/${roomId}/players/${playerId}`);

            await playerRef.update(updatedPlayer);

            const updatedPlayers = await this.getPlayers(roomId);
            return updatedPlayers;
        } catch (error) {
            throw new DatabaseError("Could not update player details: " + error);
        }
    }

    async deletePlayer(roomId: string, playerId: string): Promise<Map<string, PlayerDTO>> {
        try {
            const playerRef = db.ref(`rooms/${roomId}/players/${playerId}`);
            await playerRef.remove();

            const updatedPlayers = await this.getPlayers(roomId);
            return updatedPlayers;
        } catch (error) {
            throw new DatabaseError("Could not delete player from database: " + error);
        }
    }
}
