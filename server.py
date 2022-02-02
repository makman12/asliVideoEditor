
from flask import Flask, request,redirect, url_for,render_template, jsonify, send_file
import os
from moviepy.editor import *
from moviepy.video.fx.all import crop


app = Flask(__name__,static_url_path='/static')
app.config['UPLOAD_FOLDER'] = app.root_path + "/static"


def cropVideoWithPercentage(c,x1,x2,y1,y2):
    w, h = c.size
    d=crop(c, x1=x1*w, y1=y1*h, x2=x2*w, y2=y2*h)
    return d

def videoMuteCrop(name,dur, kes, fix):
    print(name,dur)
    num=int(len(dur)/2)
    paths=[]
    for i in range(0,num):
        start=dur[0+(i*2)]
        end=dur[1+(i*2)]
        clip = VideoFileClip(app.config['UPLOAD_FOLDER']+ "/" + name).subclip(start, end)
        clip=clip.volumex(0)
        if fix:
            duration = clip.duration
            speed= duration/fix
            clip=clip.fx( vfx.speedx, speed)
        print("buraya geldim",kes)
        if kes:
            print("kesiyorum")
            x1,x2,y1,y2 = (kes)
            clip=cropVideoWithPercentage(clip, x1, x2, y1, y2)
        clip.write_videofile(app.config['UPLOAD_FOLDER']+ "/" +f"{name.split('.')[0]}-{start}-{end}.mp4")
        path= "static/" +f"{name.split('.')[0]}-{start}-{end}.mp4"
        paths.append(path)
    return paths
@app.route('/')
def index():
    return render_template("index.html")

name=""
@app.route('/postdata', methods=["POST"])
def postdata():
    global name
    print(name)

    if request.files:
        name = request.files["file"].filename
        full_filename = os.path.join(app.config['UPLOAD_FOLDER'], name)
        request.files["file"].save(full_filename)

    return name 

@app.route('/times', methods=["POST"])    
def sendTimes():
    request_data = request.get_json()
    dur=request_data["data"]["data"]
    kes= request_data["kes"]
    fix = float(request_data["fixed"])
    print("Editing Started.................",kes)
    result=videoMuteCrop(name,dur, kes, fix)
    return ({"data":result})

if __name__=="__main__":
    app.run(debug=True , host=os.getenv('IP', '0.0.0.0'), 
            port=int(os.getenv('PORT', 4444)))


