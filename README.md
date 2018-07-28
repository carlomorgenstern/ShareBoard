# ShareBoard

An open source interactive whiteboard & collaboration app.

## Installation

1. Download the source code.
2. Make sure to have a recent version (latest LTS is recommended) of [Node.js](https://nodejs.org/) installed.
3. Install all dependencies by navigating to the root folder of the downloaded source code and running `npm install` in the command line of your choice.

   >**Note**: Some dependencies might have native code that is not prebuilt for your environment. If such errors happen, make sure to follow the install and troubleshooting guide for [node-gyp](https://github.com/nodejs/node-gyp).

4. Configure the [required environment variables](docs/required-environment-variables.md) via the ".env" file or your system environment.
5. Build the application by running `npm run build` in your command line.
6. **Optional**: Distribute the static web content of the frontend in "dist/frontend" to your web server or CDN. Make sure that all routes starting with `/auth` and `/api` are proxied to whereever you deploy the application server.
7. Distribute the "node_modules" and "dist" folders (+ your environment configuration) to your application server and start it with the command `node dist/backend/server.js`

## Development

- Follow the installation instructions up to point 5
- Then start your development server with the command `npm run start`

## Changelog

[Read up on changes between versions here](CHANGELOG.md).

## License

MIT
