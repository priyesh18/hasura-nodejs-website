$('[data-toggle="tooltip"]').tooltip();

//Auth
var auth_url = "http://auth.c100.hasura.me";
var data_url = "http://data.c100.hasura.me"; 


//login
$('#login_form').on('click', function(){
    $(this).attr("disabled", true);
    var $usern = $('#username');
    var $pass = $('#password');
    var $user = {
        username: $usern.val(),
        password: $pass.val()
    };
    
    $.ajax({
        method: 'POST',
        //url: 'http://auth.priyesh18.hasura.me/login',
        url: 'http://auth.c100.hasura.me/login',
        xhrFields: {
      withCredentials: true
   },
        headers: {
            'Content-Type':'application/json'
        },
        data: JSON.stringify($user)
    }).done(function(data){
        console.log(data);
        window.location="/";
    }).fail(function(error){
        $('#login_form').attr("disabled", false);
        console.log(error);
        alert(JSON.parse(error.responseText).message);
    })
})
/*signup
function signup() {
    fetch('http://auth.c100.hasura.me/signup', {
        method: 'post',
        credentials: 'same-origin',
        headers,
        body: JSON.stringify({
            username: document.getElementById('username').value,
            password: document.getElementById('password').value,
            email: document.getElementById('email').value
        })
    }).then(function(res) {
            console.log(res);
            return res.json();
        }).then(function(json) {
            console.log(json);})
}
*/

//logout
$('#logout').on('click',function(){
    $.ajax({
        method: 'POST',
        //url: 'http://auth.c100.priyesh18.me/user/logout',
        url: 'http://auth.c100.hasura.me/user/logout',
        xhrFields: {
      withCredentials: true
   },
        headers: {
            'Content-Type':'application/json'
        }
        
    }).done(function(data){
        console.log(data);
        //window.location="/";
    }).fail(function(error){
       // $('#login_form').attr("disabled", true);
        console.log(error);
    })
})

