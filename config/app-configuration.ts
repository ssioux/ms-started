import * as _ from 'lodash';

/**
 * @DividedByFile
  export default registerAs('database', () => ({
  host: process.env.DB_HOST || 'localhost',
  port: Number(process.env.DB_PORT) || '3306',
  etc...
}));
 */

export default () => ({
    logger: {
        debug: _.get(process.env, 'DEBUG') === 'true',
        debugJson: _.get(process.env, 'DEBUG_JSON_LOGGER') === 'true',
    },
    app: {
        name: _.get(process.env, 'APP_NAME'),
        description: _.get(process.env, 'APP_DESCRIPTION'),
        version: _.get(process.env, 'APP_VERSION'),
        port: Number(_.get(process.env, 'APP_PORT')),
    },
    database: {
        host: _.get(process.env, 'DB_HOST'),
        port: Number(_.get(process.env, 'DB_PORT')),
        user: _.get(process.env, 'DB_USER'),
        name: _.get(process.env, 'DB_NAME'),
        password: _.get(process.env, 'DB_PASSWORD'),
        synchronize: _.get(process.env, 'DATABASE_SYNCHRONIZE') === 'true',
    }
});
