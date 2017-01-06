


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
      }).catch(error => {
        console.error(error);
      });
  });
});


function loginUser(vals) {
  return $.post(local, vals);
}
