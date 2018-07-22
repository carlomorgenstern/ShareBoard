import * as dotenv from 'dotenv';
dotenv.config();

// List of environment variables that the application relies on; is parsed into an object in code below
const environmentVariables = [
  'NODE_ENV',
  'PORT',
  'CONSOLE_LOG_LEVEL',
  'FILE_LOG_LEVEL',
  'COOKIE_SECRET',
  'DATABASE_URI',
];

// Build environment variables object from dotenv & process.env and error, if one is not defined
export const processEnvironment = environmentVariables.reduce<{[key: string]: any}>((environment, variable) => {
  const variableValue = process.env[variable];
  if (variableValue !== undefined) {
    // do type conversion for variables that need it
    switch (variable) {
      case 'PORT':
        if (Number.isNaN(Number.parseInt(variableValue, 10))) throw new Error("Required environment variable 'PORT' is not an integer");
        environment[variable] = Number.parseInt(variableValue, 10);
        break;
      default:
        environment[variable] = process.env[variable];
        break;
    }
  } else {
    // set defaults for optional environment variables
    switch (variable) {
      case 'NODE_ENV':
        environment[variable] = 'development';
        break;
      case 'PORT':
        environment[variable] = 3000;
        break;
      case 'CONSOLE_LOG_LEVEL':
        environment[variable] = 'info';
        break;
      case 'FILE_LOG_LEVEL':
        environment[variable] = 'debug';
        break;
      default:
        throw new Error(`Required environment variable '${variable}' is not set.`);
    }
  }

  return environment;
}, {}) as {
  NODE_ENV: string;
  PORT: number;
  CONSOLE_LOG_LEVEL: string;
  FILE_LOG_LEVEL: string;
  COOKIE_SECRET: string;
  DATABASE_URI: string;
};
