import cron from 'node-cron';
import Logger from './util/logs/logger';
import { TYPES } from './configs/types';
import { RoomController } from './controllers/RoomController';
import { container } from './configs/inversify.config';

const roomController = container.get<RoomController>(TYPES.RoomController);

export function startCronJobs(): void {
    cron.schedule('0 * * * *', async () => {
        try {
            Logger.info(`Cron job running to delete inactive rooms - ${new Date().toISOString()}`);
            await roomController.deleteInactiveRooms();
            Logger.info('Inactive rooms deleted successfully');
        } catch (error) {
            Logger.error('Error running cron job to delete inactive rooms:', error);
        }
    });
}
