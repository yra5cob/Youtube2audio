
//search ajax request
function search() {
    $("#searchResult").html("<div class='nav_item' id='holder'><img src='/static/loading-icon.gif'/  height='94' width='168'></div>");
    var query = $('#search').val();
    $.post("search",
        {
            squery: query

        },
        function (data, status) {
            $("#holder").hide()
            $("#searchResult").html(data);
        });

}

$(document).ready(function () {
    console.log("ready!");

    $('#search').keypress(function (e) {
        var key = e.which;
        if (key == 13)  // the enter key code
        {
            search();
            return false;
        }
    });
    $('#searchbtn').click(function () {
        console.log("here");
        search();
    });
});


function btnClick(lnk, id, title,img) {
    //post("/index",{link:lnk});
    $('audio')[0].play();
    $('audio')[0].pause();
    $.post("player",
        {
            link: lnk

        },
        function (data, status) {
            var url = data;
            lst=[{
                'icon': img,
                'title': title,
                'file': url
            }];
            window.AP.updateAndPlay(lst);

        });
}

function btnAdd(lnk, id, title,img) {
    //post("/index",{link:lnk});
    $.post("player",
        {
            link: lnk

        },
        function (data, status) {
            var url = data;
            lst=[{
                'icon': img,
                'title': title,
                'file': url
            }];
            window.AP.update(lst);

        });
}