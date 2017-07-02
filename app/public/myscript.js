$('[data-toggle="tooltip"]').tooltip();

//Auth
var auth_url = "http://auth.c100.hasura.me";
var data_url = "http://data.c100.hasura.me";


//login
$('#login_form').on('click', function () {
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
            'Content-Type': 'application/json'
        },
        data: JSON.stringify($user)
    }).done(function (data) {
        console.log(data);
        user_id = data.hasura_id;
        Cookies.set('id', user_id, {
            expires: 7
        });
        //window.location="/";
    }).fail(function (error) {
        $('#login_form').attr("disabled", false);
        console.log(error);
        alert(JSON.parse(error.responseText).message);
    })
})
//signup
$('#signup_form').on('click', function () {
    $(this).attr("disabled", true);
    var $usern = $('#username');
    var $pass = $('#password');
    var $email = $('#email');
    var $user = {
        username: $usern.val(),
        password: $pass.val(),
        email: $email.val()
    };

    $.ajax({
        method: 'POST',
        //url: 'http://auth.priyesh18.hasura.me/signup',
        url: 'http://auth.c100.hasura.me/signup',
        xhrFields: {
            withCredentials: true
        },
        headers: {
            'Content-Type': 'application/json'
        },
        data: JSON.stringify($user)
    }).done(function (data) {
        console.log(data);
        user_id = data.hasura_id;
        Cookies.set('id', user_id, {
            expires: 7
        });
        var $profile = {
                    type: 'insert',
                    args: {
                        table: 'profile',
                        objects: [{
                            'name': $usern.val(),
                            'user_id': user_id
                        }]
                    }
                };
        $.ajax({
            method: 'POST',
            //url: 'http://data.priyesh18.hasura.me/v1/query',
            url: 'http://data.c100.hasura.me/v1/query',
            xhrFields: {
                withCredentials: true
            },
            headers: {
                'Content-Type': 'application/json'
            },
            data: JSON.stringify($profile)
        }).done(function (data) {
            console.log(data);
            

            //window.location="/";
        }).fail(function (error) {
            $('#signup_form').attr("disabled", false);
            console.log(error);
            alert(JSON.parse(error.responseText).message);
        })
        //window.location="/";
    }).fail(function (error) {
        $('#signup_form').attr("disabled", false);
        console.log(error);
        alert(JSON.parse(error.responseText).message);
    })
})


//logout
$('#logout').on('click', function () {
    $(this).attr("disabled", true);
    $.ajax({
        method: 'POST',
        //url: 'http://auth.c100.priyesh18.me/user/logout',
        url: 'http://auth.c100.hasura.me/user/logout',
        xhrFields: {
            withCredentials: true
        },
        headers: {
            'Content-Type': 'application/json'
        }

    }).done(function (data) {
        console.log(data);
        Cookies.remove('id');
        //window.location="/";
    }).fail(function (error) {
        $('#logout').attr("disabled", false);
        console.log(error);
    })
})
