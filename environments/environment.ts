// The file contents for the current environment will overwrite these during build.
// The build system defaults to the dev environment which uses `environment.ts`, but if you do
// `ng build --env=prod` then `environment.prod.ts` will be used instead.
// The list of which env maps to which file can be found in `.angular-cli.json`.

export const environment = {
  production: false,
  googleMapsApiKey: 'AIzaSyAsTM8XaktfkwpjEeDMXkNrojaiB2W5WyE',
  /*
  apiRoot: 'http://www-dev.usanpn.org', //'http://localhost:8000',
  dataApiRoot: 'http://data-dev.usanpn.org:3006',
  refugeApiRoot: '/api/refuge', //'https://npn-fws.firebaseio.com/refuge',
  */
  cacheTTL: 3600000, // 1 hour vs 5 minutes 300000,
  appConfig: {
      // this stuff is "system wide" and may need to be rolled into how an individual visualization is displayed
      // i.e. what someone wants one visualization on their dashbord with filterLqdSummary:true and another false
      // or a different # of days quality filter?
      num_days_quality_filter: 30,
      filterLqdSummary: true,
      filterLqdDisclaimer: 'For quality assurance purposes, only onset dates that are preceded by negative records are included in the visualization.',
      tagSpeciesTitle: 'common-name', // or 'scientific-name'
  }
};
