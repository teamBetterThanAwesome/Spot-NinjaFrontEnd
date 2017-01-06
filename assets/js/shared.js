$.ajaxSetup({
  crossDomain: true,
  xhrFields: {
    withCredentials: true
  }
});
API_URL = getHostURL();

function getHostURL() {
  if (window.location.host.indexOf('localhost') != -1) {
    return 'http://localhost:3000/auth';
  } else {
    return 'https://spotninja.herokuapp.com/auth';
  }
}


function setIdRedirect(result) {
  localStorage.user_id = result.id;
  window.location = `/profile.html?id=${result.id}`;
}


function redirectIfLoggedIn() {
  if (localStorage.user_id) {
    window.location = `/profile.html?id=${localStorage.user_id}`;
  }
}


function logout() {
  localStorage.removeItem('user_id');
  $.get(`${API_URL}/logout`)
    .then(result => {
      window.location = '/';
    });
}
