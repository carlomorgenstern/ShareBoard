# Code strcuture (folders and files) of ShareBoard

In the following document, the folder structure of the project will be listed and explained, along with specific important files:

Folder or File                  | Use
--------------------------------|---------------------------------------------------------------------------------------------------
.env                            | Contains environment variables needed for the backend, can also be replaced by actual environment variables
package.json                    | Dependencies and scripts of the applicaton
/backend                        | Containing folder of the backend part of the application
/backend/server.ts              | Entry point of the application server, also serves the frontend as a webserver in production mode
/backend/typings.d.ts           | Custom TypeScript typings for dependencies without existing types
/backend/api                    | Containing folder of all APIs of the backend
/backend/api/user (e.g.)        | Folder for a single API, should contain at least the API entry file (.api.ts), the database abstraction definition (.db.ts) and the unit test file (.spec.ts), as well as all implementations for the supported databases (.dbname.db.ts)
/backend/configuration          | Files with implementations for the basic functionality and setup/configuration of the backend server
/dist                           | Folder with all files of the production build (distribution)
/docs                           | Containing folder for all documentation files
angular.json                    | Configuration for the frontend Angular CLI tools
/frontend                       | Containing folder for the frontend part of the application
/frontend/.sass-lint.yml        | Configuration of the linting tool for the SASS source code
/frontend/e2e                   | Containing folder for the end-to-end / integration testing of the application
/frontend/e2e/src               | Source files for the end-to-end tests
/frontend/src                   | Source files of the frontend
/frontend/src/app               | TypeScript source files of the frontend
/frontend/src/app/components    | Angular components of the frontend, each in its own folder with HTML Template (.html), component specific SASS styles (.scss), unit test (.spec.ts) and TypeScript source (.ts)
/frontend/src/app/services      | Angular services of the frontend, each in its own folder with unit test (.spec.ts) and TypeScript source (.ts)
/frontend/src/app/app.module.ts | Root Angular module of the frontend, containing all component imports
/frontend/src/assets            | Static assets (e.g. fonts or images)
/frontend/src/environments      | Predefined Angular environments
/frontend/src/global-styles     | SCSS styles that are not component-specific, but global to the whole frontend
/frontend/src/vendor            | Containing folder for frontend dependencies that cannot be managed via npm
/frontend/src/main.ts           | Entry file for the Angular file
/frontend/src/test.ts           | Entry file for frontend unit tests
/shared                         | Typescript files/modules that are shared between the backend and frontend
tslint.json (in root and multiple folders) | Root and extending configuration for the TSLint, that lints all TypeScript files in the containing and all sub folders
tsconfig.json (in multiple folders)        | Configuration for the TypeScript compiler for all TypeScript files in the containing and all sub folders
-------------------------------------------------------------------------------------------------------------------------------------------
