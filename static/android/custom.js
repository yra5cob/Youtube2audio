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

    Hammer(document.getElementById('cont')).on('swiperight', function (e) {
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
    Hammer(document.getElementById('fade')).on('swiperight', function (e) {
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


    Hammer(document.getElementById('cont')).on('swipeleft', function (e) {
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
