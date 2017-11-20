// The file contents for the current environment will overwrite these during build.
// The build system defaults to the dev environment which uses `environment.ts`, but if you do
// `ng build --env=prod` then `environment.prod.ts` will be used instead.
// The list of which env maps to which file can be found in `.angular-cli.json`.

/*
IMPORTANT: use of environment needs to be reviewed entirely.  For some reason an
ng build --env=prod is NOT picking up this file vs the dev version so for
now toggling the production flag in environment.ts which is frustrating.
 */
export const environment = {
  production: true,
  googleMapsApiKey: 'AIzaSyAsTM8XaktfkwpjEeDMXkNrojaiB2W5WyE',
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
