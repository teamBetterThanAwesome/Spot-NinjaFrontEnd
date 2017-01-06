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
        window.location = `/profile.html?id=${result.id}`;
      }).catch(error => {
        console.error(error);
      });
  });
});

function signUp(user) {
  return $.post(`${Heroku}/signup`, user)
}
