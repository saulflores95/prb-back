let url = 'https://statim.serveo.net'
var ids = {
  facebook: {
    clientID: 'FAKEDATA',
    clientSecret: 'FAKEDATA',
    callbackURL: `${url}/auth/facebook/callback`
  },
  google_plus: {
    clientID: 'THISISFAKEDATA.apps.googleusercontent.com',
    clientSecret: 'FAKEDATA',
    callbackURL: ''
  }
};

module.exports = ids;
