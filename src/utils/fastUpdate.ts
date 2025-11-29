// Clean up console logs for production builds
import { logger } from './logger';

const cleanConsole = (message: string, ...args: any[]) => {
  logger.log(message, ...args);
};

export { cleanConsole, logger };