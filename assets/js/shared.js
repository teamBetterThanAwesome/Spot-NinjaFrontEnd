$.ajaxSetup({
  crossDomain: true,
  xhrFields: {
    withCredentials: true
  }
});

const Heroku = 'https://spotninja.herokuapp.com/auth/login';
const local = 'http://localhost:3000/auth/login';
