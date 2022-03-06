// This file can be replaced during build by using the `fileReplacements` array.
// `ng build` replaces `environment.ts` with `environment.prod.ts`.
// The list of file replacements can be found in `angular.json`.

export const environment = {
  production: false,

  // API Url
  BASE_API_URL: 'http://127.0.0.1:5000/',

  // Recaptcha
  RECAPTCHA_V3_SITE_KEY: '6LfAjaAeAAAAACPr7rpb3nQtLJP5uXHk6TzFKjfn',

  // Cookies
  COOKIE_SID: 'SID-MYPONYASIA',
  COOKIE_SIDR: 'SIDR-MYPONYASIA',
  COOKIE_DOMAIN: 'localhost',
  COOKIE_SECURE: false,
  COOKIE_HTTP_ONLY: false,
};

/*
 * For easier debugging in development mode, you can import the following file
 * to ignore zone related error stack frames such as `zone.run`, `zoneDelegate.invokeTask`.
 *
 * This import should be commented out in production mode because it will have a negative impact
 * on performance if an error is thrown.
 */
// import 'zone.js/plugins/zone-error';  // Included with Angular CLI.
