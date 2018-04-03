//search ajax request

var songClipboard;

function search() {
    $("#searchResult").html("<div class='nav_item' id='holder'><img src='/static/loading-icon.gif'/  height='94' width='168'></div>");
    var query = $('#search').val();
    $.post("http://"+window.location.hostname+":8000/search",
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
    $.post("http://"+window.location.hostname+":8000/current",
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
                preloadr(obj['data'][i]['link']);
                window.AP.update(lst);
            }
        });
        loadPlaylist();
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
    preloadr(lnk);
    save(lnk,title,img,'current');

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
    preloadr(lnk);
    save(lnk,title,img,'current');
}


$(document).ready(function (e) {

    var startX, curX, startY, curY; // Variables
    var newXScroll, newYScroll, genXScroll; // More Variables!

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
      Hammer(document.getElementById('cont')).on('swiperight', function (e) {
        document.getElementById("mySidenav").style.width = "70%";
      });
            Hammer(document.getElementById('mySidenav')).on('swipeleft', function (e) {
        document.getElementById("mySidenav").style.width = "0%";
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

function preloadr(lnk) {
        $.post("http://"+window.location.hostname+":8000/preload",
        {
            link: lnk

        },
        function (data, status) {


        });

}

function save(lnk,title,img,playlist) {
        $.post("http://"+window.location.hostname+":8000/save",
        {
            link: lnk,
            title: title,
            img: img,
            playlist: playlist

        },
        function (data, status) {


        });
}

function openPlaylist(lnk,title,img) {
        songClipboard = [{
        'icon': img,
        'title': title,
        'file': '',
        'link': lnk
    }];
   $('#playlistmodal').modal('show');

}

function loadPlaylist() {
      $.post("http://"+window.location.hostname+":8000/playlist",
        {

        },
        function (data, status) {
            var obj = JSON.parse(data);
            len = obj['length'];
            console.log(obj);
            for (i = 1; i <= len; i++) {
                $('#mySidenav').append('<div class="row '+obj["data"][i].replace(" ", "_")+'"><div class="col"><a href="#" onclick="loadPlaylistSong(\''+obj["data"][i]+'\')"><span class="glyphicon glyphicon glyphicon-music" aria-hidden="true"></span> '+obj["data"][i]+'</a></div> <div class="col"><span class="glyphicon glyphicon-trash" aria-hidden="true" style="margin: 10px" onclick="deletePL(\''+obj["data"][i]+'\')"></span></div></div>');
                $('#plcontainer').append('<li class="list-group-item '+obj["data"][i].replace(" ", "_")+'" onclick="addToPlaylist(this)">'+obj["data"][i]+'</li>')
            }
        });
}

function showCreatePl() {
    $('#exampleModal').modal('show');
    $('#playlistmodal').modal('hide');
}

function createPlaylist() {
        var name=$("#playlistname").val()
      $.post("http://"+window.location.hostname+":8000/createplaylist",
        {
            name: name

        },
        function (data, status) {


        });
    $('#plcontainer').append('<li class="list-group-item '+name.replace(" ", "_")+'" onclick="addToPlaylist(this)">'+name+'</li>');
    $('#mySidenav').append('<div class="row '+name.replace(" ", "_")+'"><div class="col"><a href="#" onclick="loadPlaylistSong(\''+name+'\')"><span class="glyphicon glyphicon glyphicon-music" aria-hidden="true"></span> '+name+'</a></div> <div class="col"><span class="glyphicon glyphicon-trash" aria-hidden="true" style="margin: 10px" onclick="deletePL(\''+name+'\')"></span></div></div>');
    $('#playlistmodal').modal('show');
    $('#exampleModal').modal('hide');
}

function addToPlaylist(s) {
    console.log(s.innerText);
    save(songClipboard[0]['link'],songClipboard[0]['title'],songClipboard[0]['icon'],s.innerText);
    $('#playlistmodal').modal('hide');
}

function loadPlaylistSong(name) {
    window.AP.clearAll()
    $.post("http://"+window.location.hostname+":8000/current",
        {
            playlist: name

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
                preloadr(obj['data'][i]['link']);
                window.AP.update(lst);
            }
        });
}


function deletePL(name) {
  $("."+name.replace(' ', '_')).hide();
       $.post("http://"+window.location.hostname+":8000/createplaylist",
        {
            name: name,
            action: 'delete'

        },
        function (data, status) {


        });
}