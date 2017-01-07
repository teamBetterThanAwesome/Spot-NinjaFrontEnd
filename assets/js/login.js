redirectIfLoggedIn();

$(document).ready(() => {
  $('#loginBtn').click((event) => {
    event.preventDefault();
    let formVals = {
        email: $('#email').val(),
        password: $('#password').val()
    };
    loginUser(formVals)
      .then(result => {
        setIdRedirect(result);
      }).catch(error => {
        console.error(error);
      });
  });
});


function loginUser(vals) {
  return $.post(`${API_URL}/auth/login`, vals);
}
