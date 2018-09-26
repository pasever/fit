// The file contents for the current environment will overwrite these during build.
// The build system defaults to the dev environment which uses `environment.ts`, but if you do
// `ng build --env=prod` then `environment.prod.ts` will be used instead.
// The list of which env maps to which file can be found in `.angular-cli.json`.

export const environment = {
  production: false,
  firebase: {
      apiKey: 'AIzaSyC3FatN6rDC-8PF9lx07DYcJi5PtRVtyKw',
      authDomain: 'ng-fitness-38c57.firebaseapp.com',
      databaseURL: 'https://ng-fitness-38c57.firebaseio.com',
      projectId: 'ng-fitness-38c57',
      storageBucket: 'ng-fitness-38c57.appspot.com',
      messagingSenderId: '1043413529391'
  }
};
