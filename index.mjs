import app from './src/server.mjs';
import logger from './src/utils/logger.mjs';

const server = app.listen(app.get('port'), () => logger.info(`Server listening on port ${server.address().port}`));
