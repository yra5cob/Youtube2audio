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
    $.post("load",
        {
            playlist: 'current'

        },
        function (data, status) {
            var obj = JSON.parse(data);
            len = obj['length'];
            console.log(obj);
            for (i = 1; i <= len; i++) {
                lst = [{
                    'icon': obj['data'][String(i)]['img'],
                    'title': obj['data'][i]['title'],
                    'file': '',
                    'link': obj['data'][i]['link']
                }];
                $.post("preload",
                    {
                        link: obj['data'][i]['link']

                    },
                    function (data, status) {


                    });
                window.AP.update(lst);
            }
        });

});


function btnClick(lnk, id, title, img) {
    //post("/index",{link:lnk});
    $('audio')[0].play();
    $('audio')[0].pause();

    lst = [{
        'icon': img,
        'title': title,
        'file': '',
        'link': lnk
    }];
    window.AP.updateAndPlay(lst);
    $.post("preload",
        {
            link: lnk

        },
        function (data, status) {


        });
    $.post("save",
        {
            link: lnk,
            title: title,
            img: img,
            playlist: 'current'

        },
        function (data, status) {


        });

}

function btnAdd(lnk, id, title, img) {
    //post("/index",{link:lnk});

    lst = [{
        'icon': img,
        'title': title,
        'file': '',
        'link': lnk
    }];
    window.AP.update(lst);
    $.post("preload",
        {
            link: lnk

        },
        function (data, status) {


        });
    $.post("save",
        {
            link: lnk,
            title: title,
            img: img,
            playlist: 'current'

        },
        function (data, status) {


        });
}


$(document).ready(function (e) {

    var startX, curX, startY, curY; // Variables
    var newXScroll, newYScroll, genXScroll; // More Variables!

    // Change the height of the sidebar, as well as a few things to do with the main content area, so the user
    // can actually scroll in the content area.
    // function sideBarHeight() {
    //
    // 	var docHeight = $(document).height();
    // 	var winHeight = $(window).height();
    //
    // 	$('.slide-in').height(winHeight);
    // 	$('#main-container').height(winHeight);
    // 	$('#sub-container').height($('#sub-container').height());
    // }
    //
    // sideBarHeight();

    var outIn = 'in';

    Hammer(document.getElementById('cont')).on('swipeleft', function (e) {
        /*			$('.slide-in').toggleClass('on');
         $('#main-container').toggleClass('on');
         outIn = 'out';*/
        $('.bar').toggleClass('animate');
        $('.hamburger-menu').toggleClass('slide');
        $('.back_btn').toggleClass('slide');
        $('.nav_menu').toggleClass('open');
        $('.player_fade').toggleClass('player_fade_on');
        console.log("right")

    });
    Hammer(document.getElementById('cont')).on('swipeup', function (e) {
        /*			$('.slide-in').toggleClass('on');
         $('#main-container').toggleClass('on');
         outIn = 'out';*/
        $('.player_playlist').toggleClass('playlist_on');
        $('.glyphicon-menu-left').toggleClass('back_btn_on');
        $('.waves').toggleClass('waves_up');
        $('.album_wrap').toggleClass('album_up');
        $('.song_playing').toggleClass('song_playing_up');
        $('.timeline_wrap').toggleClass('timeline_wrap_up');
        $('.player_btns').toggleClass('player_btns_up');
        $('.line_played').toggleClass('line_played_up');
        $('.full_line').toggleClass('full_line_up');
        $('.time_of_song').toggleClass('time_of_song_up');
        $('.progress-bar-pointer').toggleClass('progress-bar-pointer_up');
        $('.line_preload').toggleClass('line_preload_up');

    });


    Hammer(document.getElementById('fade')).on('swiperight', function (e) {
        /*			$('.slide-in').toggleClass('on');
         $('#main-container').toggleClass('on');
         outIn = 'in';*/
        $('.bar').toggleClass('animate');
        $('.hamburger-menu').toggleClass('slide');
        $('.back_btn').toggleClass('slide');
        $('.nav_menu').toggleClass('open');
        $('.player_fade').toggleClass('player_fade_on');
        console.log("left")
    });

    Hammer(document.getElementById('pl')).on('swipedown', function (e) {
        /*			$('.slide-in').toggleClass('on');
         $('#main-container').toggleClass('on');
         outIn = 'in';*/
        e.prevent_default;
        console.log("down");
        $('.player_playlist').toggleClass('playlist_on');
        $('.glyphicon-menu-left').toggleClass('back_btn_on');
        $('.waves').toggleClass('waves_up');
        $('.album_wrap').toggleClass('album_up');
        $('.song_playing').toggleClass('song_playing_up');
        $('.timeline_wrap').toggleClass('timeline_wrap_up');
        $('.player_btns').toggleClass('player_btns_up');
        $('.line_played').toggleClass('line_played_up');
        $('.full_line').toggleClass('full_line_up');
        $('.time_of_song').toggleClass('time_of_song_up');
        $('.progress-bar-pointer').toggleClass('progress-bar-pointer_up');
        $('.line_preload').toggleClass('line_preload_up');
    });


    function runAnimation() {

        if (outIn == 'out') {

            $('.slide-in').toggleClass('on');
            $('#main-container').toggleClass('on');
            outIn = 'in';

        } else if (outIn == 'in') {

            $('.slide-in').toggleClass('on');
            $('#main-container').toggleClass('on');
            outIn = 'out';

        }

    }
});
/*
 $('.menu-icon')[0].addEventListener('touchend', function(e) {
 $('.slide-in').toggleClass('on');
 $('#main-container').toggleClass('on');
 });

 $('.menu-icon').click(function() {
 $('.slide-in').toggleClass('on');
 $('#main-container').toggleClass('on');
 });
 */

