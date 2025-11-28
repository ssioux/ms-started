import { transports, format } from 'winston';
import { WinstonModule, utilities as nestWinstonModuleUtilities } from 'nest-winston';

export const LoggerFactory = (appName: string) => {
  let consoleFormat;

  const DEBUG = process.env.DEBUG;
  const DEBUB_JSON_LOGGER = process.env.DEBUB_JSON_LOGGER;

  if (DEBUB_JSON_LOGGER === 'true') {
    consoleFormat = format.combine(format.ms(), format.timestamp(), format.json());
  } else {
    consoleFormat = format.combine(
      format.timestamp(),
      format.ms(),
      nestWinstonModuleUtilities.format.nestLike(appName, {
        colors: true,
        prettyPrint: true,
      }),
    );
  }

  return WinstonModule.createLogger({
    level: DEBUG ? 'debug' : 'info',
    transports: [new transports.Console({ format: consoleFormat })],
  });
};
