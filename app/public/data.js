//upvote
$("[id^=tu-]").on('click', function () {
    var str = $(this).attr("id");
    var r_url = str.slice(3);
    var $vote = {
        "type": "insert",
        "args": {
            "table": "votes",
            "objects": [
                {
                    "user_id": Cookies.get('id'),
                    "resource": r_url,
                    "value": 1
			}
			]
        }
    }
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
        data: JSON.stringify($vote)
    }).done(function (data) {
        console.log(data);
        update(r_url);

        //window.location = "/";
    }).fail(function (error) {
        if (error.status == 400) {
            delete_vote(r_url);
        }
        console.log(error.status);
        //alert(JSON.parse(error.responseText).message);
    })

})
//down vote
$("[id^=td-]").on('click', function () {
    var str = $(this).attr("id");
    var r_url = str.slice(3);
    var $vote = {
        "type": "insert",
        "args": {
            "table": "votes",
            "objects": [
                {
                    "user_id": Cookies.get('id'),
                    "resource": r_url,
                    "value": -1
			}
			]
        }
    }
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
        data: JSON.stringify($vote)
    }).done(function (data) {
        console.log(data);
        update(r_url);

        //window.location = "/";
    }).fail(function (error) {
        if (error.status == 400) {
            delete_vote(r_url);
        }
        console.log(error);
        //alert(JSON.parse(error.responseText).message);
    })

})


//delete vote function
function delete_vote(rurl) {
    //console.log(rurl+ " inside function");
    var $delete_original = {
        type: 'delete',
        args: {
            table: 'votes',
            where: {
                user_id: Cookies.get('id'),
                resource: rurl
            }

        }

    }
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
        data: JSON.stringify($delete_original)
    }).done(function (data) {
        console.log(data);
        update(rurl);

        //window.location = "/";
    }).fail(function (error) {

        console.log(error);
        //alert(JSON.parse(error.responseText).message);
    })
}

//update the total votes count
function update(uurl){
    //var id = 'tv-'+url;
    var $update = {
            type: 'select',
            args: {
                table: 'resource_info',
                columns: ['total_votes'],
                where: {
                    resource_url: uurl
                }
            }
        }
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
        data: JSON.stringify($update)
    }).done(function (data) {
        var x = JSON.stringify(data[0].total_votes);
        if(x=='null'){
            x='0';
        }
        document.getElementById('tv-'+uurl).innerHTML=x;
        //window.location = "/";
    }).fail(function (error) {

        console.log(error);
        //alert(JSON.parse(error.responseText).message);
    })
    //console.log($id);
    
}
