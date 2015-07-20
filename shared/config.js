var setty = require('setty'),
    path = require('path'),
    fs = require('fs'),
    util = require('util');

var settingsDirAbsolutePath = path.join(__dirname, 'settings');

setty.load({
  profile: '.config',
  configFileName: 'config.json',
  settingsDir: settingsDirAbsolutePath
});

var environment = setty.get('environment:type');

console.log('User config file is ',fs.readFileSync(path.join(settingsDirAbsolutePath, '.config'), 'utf8').trim());
console.log('Settings loaded. Environment is: ' + environment);

var config = {
  mongo: setty.get('mongo'),
  environment: {
    type: environment,
    isDev: environment === 'development',
    isStaging: environment === 'staging',
    isPreStage: environment === 'prestage',
    isProd: environment === 'production',
    httpPort: setty.get('environment:httpPort')
  },
  socketUrl: setty.get('socketServerUrl'),
  domain: setty.get('domain'),
  protocol: setty.get('protocol'),
  root: setty.get('root'),
  redis: {
    session: {
      host: setty.get('redis:session:host'),
      port: setty.get('redis:session:port')
    },
    queue: {
      host: setty.get('redis:queue:host'),
      port: setty.get('redis:queue:port')
    }
  }
};

module.exports = config;

