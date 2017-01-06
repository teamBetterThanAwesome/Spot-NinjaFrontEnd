$(document).ready(() => {
  $('#loginBtn').click((event) => {
    event.preventDefault();
    let formVals = {
        email: $('#email').val(),
        password: $('#password').val()
    };
    loginUser(formVals)
      .then(result => {
        console.log(result);
        window.location = `/profile.html?id=${result.id}`
      }).catch(error => {
        console.error(error);
      });
  });
});


function loginUser(vals) {
  return $.post(`${Heroku}/auth/login`, vals);
}
