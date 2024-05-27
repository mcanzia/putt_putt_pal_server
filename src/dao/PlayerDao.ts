import { db } from '../configs/firebase';
import { PlayerDTO } from '../models/dto/PlayerDTO';
import { DatabaseError } from '../util/error/CustomError';
import { inject, injectable } from 'inversify';
import { TYPES } from '../configs/types';
import { Server } from 'socket.io';
import { getCachedValue, setCachedValue, deleteCachedValue } from '../util/cache/useCache';

@injectable()
export class PlayerDao {
    
    constructor(@inject(TYPES.SocketIO) private io: Server) {}

    async getPlayers(roomId: string) {
        try {
            const cacheKey = `players:${roomId}`;
            const cachedPlayers = await getCachedValue(cacheKey);
            if (cachedPlayers) {
                return JSON.parse(cachedPlayers);
            }

            let players: Map<string, PlayerDTO> = new Map();

            const playersRef = db.ref(`rooms/${roomId}/players`);
            const snapshot = await playersRef.once('value');

            if (!snapshot.exists()) {
                throw new Error('No such room found.');
            }

            players = snapshot.val();

            await setCachedValue(cacheKey, JSON.stringify(players), {
                EX: 60
            });

            return players;
        } catch (error) {
            throw new DatabaseError("Could not retrieve players from database: " + error);
        }
    }

    async getPlayerById(roomId: string, playerId: string): Promise<PlayerDTO> {
        try {
            const cacheKey = `player:${roomId}:${playerId}`;
            const cachedPlayer = await getCachedValue(cacheKey);
            if (cachedPlayer) {
                return JSON.parse(cachedPlayer);
            }

            const playerRef = db.ref(`rooms/${roomId}/players/${playerId}`);
            const snapshot = await playerRef.once('value');
    
            if (!snapshot.exists()) {
                throw new Error('No such player found in the specified room.');
            }

            const playerData = snapshot.val();
            const player = new PlayerDTO(
                playerId,
                playerData.name,
                playerData.isHost,
                playerData.color
            );

            await setCachedValue(cacheKey, JSON.stringify(player), {
                EX: 60
            });

            return player;
        } catch (error) {
            throw new DatabaseError("Could not retrieve player from database: " + error);
        }
    }

    async addPlayer(roomId: string, player: PlayerDTO) {
        try {
            const roomsRef = db.ref('rooms');
            const playersRef = await roomsRef.child(`${roomId}/players`).push();

            player.id = playersRef.key!;

            await playersRef.set(player);

            await deleteCachedValue(`players:${roomId}`);

            return player;
        } catch (error) {
            throw new DatabaseError("Could not add player to database: " + error);
        }
    }

    async updatePlayer(roomId: string, playerId: string, updatedPlayer: PlayerDTO): Promise<Map<string, PlayerDTO>> {
        try {
            const playerRef = db.ref(`rooms/${roomId}/players/${playerId}`);

            await playerRef.update(updatedPlayer);

            await deleteCachedValue(`player:${roomId}:${playerId}`);
            await deleteCachedValue(`players:${roomId}`);

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

            await deleteCachedValue(`player:${roomId}:${playerId}`);
            await deleteCachedValue(`players:${roomId}`);

            const updatedPlayers = await this.getPlayers(roomId);

            return updatedPlayers;
        } catch (error) {
            throw new DatabaseError("Could not delete player from database: " + error);
        }
    }
}
