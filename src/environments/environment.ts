// This file can be replaced during build by using the `fileReplacements` array.
// `ng build --prod` replaces `environment.ts` with `environment.prod.ts`.
// The list of file replacements can be found in `angular.json`.

export const environment = {
  production: false,
  accelerationX: 0.4,
  stopSpeedLimit: 4,
  gravity: 0.98,
  stopAccelerationX: 0.15,
  canvasWidth: 600,
  canvasHeight: 450,
  obstacleSpeed: 0.5,
  jumpSpeed: 14,
  bigJumpSpeed: 28,
  speedXforBigJump: 10,
  initialObstaclesNumber: 5,
  timeToSpeedUp: 30
};

/*
 * For easier debugging in development mode, you can import the following file
 * to ignore zone related error stack frames such as `zone.run`, `zoneDelegate.invokeTask`.
 *
 * This import should be commented out in production mode because it will have a negative impact
 * on performance if an error is thrown.
 */
// import 'zone.js/dist/zone-error';  // Included with Angular CLI.
