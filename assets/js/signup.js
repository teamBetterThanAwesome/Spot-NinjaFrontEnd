redirectIfLoggedIn();

$(() => {
  $('form').submit((event) => {
    event.preventDefault();
    let user = {
      name: $('#userName').val(),
      email: $('#email').val(),
      password: $('#password').val()
    };
    signUp(user)
      .then(result => {
        setIdRedirect(result);
      }).catch(error => {
        console.error(error);
      });
  });
});

function signUp(user) {
  return $.post(`${API_URL}/auth/signup`, user)
}
