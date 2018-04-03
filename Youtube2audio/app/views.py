import os
from wsgiref.util import FileWrapper
import MySQLdb
from apscheduler.schedulers.background import BackgroundScheduler
from django.http import HttpResponse
import urllib
from threading import Thread
from urllib.request import urlopen
import pafy
from bs4 import BeautifulSoup
from django.shortcuts import render, render_to_response
from django.template.loader import render_to_string
from django.views.decorators.csrf import csrf_exempt
import sqlite3
from sqlite3 import Error
import requests
import json
import datetime
from apscheduler.schedulers.blocking import BlockingScheduler

def deleteJob():
    query="DELETE FROM cache_url WHERE date < (NOW() - INTERVAL 3 HOUR);"
    conn=create_connection()
    c=conn.cursor()
    c.execute(query)
    conn.commit()

scheduler = BackgroundScheduler()
scheduler.add_job(deleteJob, 'interval', hours=1)
scheduler.start()


theds=dict()
BASE_DIR = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
headers = {
    'x-youtube-sts': '17606',

    'accept-language': 'en-US,en;q=0.9',
    'x-youtube-page-label': 'youtube.ytfe.desktop_20180321_3_RC2',
    'x-chrome-uma-enabled': '1',
    'x-youtube-page-cl': '190047170',
    'x-spf-referer': 'https://www.youtube.com/watch?v=EELySnTPeyw',
    'x-spf-previous': 'https://www.youtube.com/watch?v=EELySnTPeyw',

    'x-youtube-client-version': '2.20180322',
    'user-agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/64.0.3282.186 Safari/537.36',
    'x-youtube-variants-checksum': 'a47c67ab6ca742c80e7286e8585ed2d3',
    'accept': '*/*',
    'referer': 'https://www.youtube.com/watch?v=EELySnTPeyw',
    'x-youtube-client-name': '1',
    'authority': 'www.youtube.com',

}

@csrf_exempt
def index(request):
    str=""
    if 'link' in request.POST:
        link = request.POST.get("link", "")
        video = pafy.new(link)
        audiostreams = video.audiostreams
        return HttpResponse(render_to_string("audio.html", {"lnk":audiostreams[0].url}))
    else:
        if 'search' in request.GET:
            textToSearch = request.GET.get('search')
            query = urllib.parse.quote(textToSearch)
            str = ""
            i = 1
            params = (
                ('search_query',query),
                ('pbj', '1'),
            )
            response = requests.get('https://www.youtube.com/results', headers=headers, params=params, verify=False)
            data = json.loads(response.content)
            content = \
            data[1]["response"]['contents']['twoColumnSearchResultsRenderer']['primaryContents']['sectionListRenderer'][
                'contents'][0]['itemSectionRenderer']['contents']
            for x in range(1, 20):
                try:
                    title=content[x]['videoRenderer']['title']['simpleText']
                    img = content[x]['videoRenderer']['thumbnail']['thumbnails'][0]['url']
                    link = content[x]['videoRenderer']['videoId']
                    str = str + render_to_string("result.html", {"img": img, "title": title, "link": link, "id": i})
                    i += 1
                except:
                    print
    return HttpResponse(render_to_string("base.html", {"bdy":str}))

@csrf_exempt
def save(request):
    playlist=request.POST.get("playlist", "")
    usr=request.session.get('user')
    link=request.POST.get("link", "")
    title=request.POST.get("title", "")
    img=request.POST.get("img", "")
    query="INSERT INTO `songs`(`plname`, `link`, `user`, `title`, `img`) VALUES ('"+playlist+"','"+link+"','"+usr+"','"+title+"','"+img+"') ON DUPLICATE KEY UPDATE USER=USER;;"
    conn=create_connection()
    c=conn.cursor()
    c.execute(query)
    conn.commit()
    return HttpResponse("")

@csrf_exempt
def remove(request):
    playlist=request.POST.get("playlist", "")
    usr=request.session.get('user')
    link=request.POST.get("link", "")
    query="DELETE FROM `songs` WHERE plname like '"+playlist+"' and user like '"+usr+"' and link like '"+link+"';"
    conn=create_connection()
    c=conn.cursor()
    c.execute(query)
    conn.commit()
    return HttpResponse("")

@csrf_exempt
def current(request):
    playlist=request.POST.get("playlist", "")
    usr=request.session.get('user')
    query="SELECT `plname`, `link`, `user`, `title`, `img` FROM `songs` WHERE plname like '"+playlist+"' and user like '"+usr+"';"
    conn = create_connection()
    c = conn.cursor()
    c.execute(query)
    rows = c.fetchall()
    data={}
    content={}
    i=1
    if rows.__len__() > 0:
        for x in rows:
            lst = {}
            lst['title']=x[3]
            lst['link']=x[1]
            lst['img']=x[4]
            content[i]=lst
            i+=1
    data['data']=content
    data['length']=i-1
    return HttpResponse(json.dumps(data, ensure_ascii=False))




@csrf_exempt
def player(request):
    link = request.POST.get("link", "")
    res=""
    conn = create_connection()
    c = conn.cursor()
    query="select url from cache_url where ID='"+link+"' and date >= DATE_SUB(NOW(),INTERVAL 1 HOUR));"
    c.execute(query)
    rows = c.fetchall()
    if rows.__len__()>0:
        res=rows[0]
    else:
        video = pafy.new('https://www.youtube.com/watch?v=' + link)
        audiostreams = video.audiostreams
        res =audiostreams[0].url
        query = "INSERT INTO cache_url(ID,URL) VALUES ('" + link + "','" + res + "') ON DUPLICATE KEY UPDATE ID=ID;;"
        with conn:
            c.execute(query)
        conn.commit()
    return HttpResponse(res)

@csrf_exempt
def search(request):
    str=""
    if 'squery' in request.POST:
        textToSearch = request.POST.get('squery')
        query = urllib.parse.quote(textToSearch)
        str = ""
        i = 1
        params = (
            ('search_query', textToSearch),
            ('pbj', '1'),
        )
        response = requests.get('https://www.youtube.com/results', headers=headers, params=params, verify=False)
        data = json.loads(response.content)
        content = \
            data[1]["response"]['contents']['twoColumnSearchResultsRenderer']['primaryContents']['sectionListRenderer'][
                'contents'][0]['itemSectionRenderer']['contents']
        for x in range(1, 20):
            try:
                title = content[x]['videoRenderer']['title']['simpleText'].replace("'", " ")
                img = content[x]['videoRenderer']['thumbnail']['thumbnails'][0]['url']
                link = content[x]['videoRenderer']['videoId']
                str = str + render_to_string("androidPlayer.html", {"img": img, "title": title, "link": link, "id": i})
                i += 1
            except:
                print
    return HttpResponse(str)


def create_connection():
    """ create a database connection to the SQLite database
        specified by the db_file
    :param db_file: database file
    :return: Connection object or None
    """
    try:
        db = MySQLdb.connect(host="localhost",  # your host
                         user="root",  # username
                         passwd="root",  # password
                         db="you2song")  # name of the database
        return db
    except Error as e:
        print(e)

    return None
@csrf_exempt
def preload(request):
    conn = create_connection()
    c = conn.cursor()
    video = pafy.new('https://www.youtube.com/watch?v=' + request.POST.get('link'))
    audiostreams = video.audiostreams
    res = audiostreams[0].url
    query = "INSERT INTO cache_url(ID,URL) VALUES ('" + request.POST.get('link') + "','" + res + "') ON DUPLICATE KEY UPDATE ID=ID;"
    with conn:
        c.execute(query)
    conn.commit()
    return HttpResponse("")

@csrf_exempt
def createplaylist(request):
    conn = create_connection()
    c = conn.cursor()
    if 'action' in request.POST:
        query="DELETE FROM `playlist` where email like '{0}' and pname like '{1}'".format(request.session.get('user'),request.POST.get('name'))
        c.execute(query)
        conn.commit()
        q="DELETE FROM `songs` where user like '{0}' and plname like '{1}'".format(request.session.get('user'),request.POST.get('name'))
        c.execute(q)
        conn.commit()
    else:
        query="INSERT INTO `playlist`(`email`, `pname`) VALUES ('{0}','{1}') ON DUPLICATE KEY UPDATE email=email; ".format(request.session.get('user'),request.POST.get('name'))
        c.execute(query)
        conn.commit()
    return HttpResponse("")

@csrf_exempt
def playlist(request):
    conn = create_connection()
    c = conn.cursor()
    query="SELECT `email`, `pname` FROM `playlist` WHERE email like '{0}'".format(request.session.get('user'))
    c.execute(query)
    rows = c.fetchall()
    i=1
    d={}
    c={}
    for x in rows:
        c[i]=x[1]
        i+=1
    d['length']=i-1
    d['data']=c
    return HttpResponse(json.dumps(d, ensure_ascii=False))

@csrf_exempt
def play_song(request):
    if request.session.get('user')==None:
        if 'email' in request.POST:
            request.session['user'] = request.POST.get('email')
            return HttpResponse(render_to_string("index.html"))
        else:
            return HttpResponse(render_to_string("login.html"))
    else:
        return HttpResponse(render_to_string("index.html"))


def download(request):
    return HttpResponse(render_to_string("index.html"))