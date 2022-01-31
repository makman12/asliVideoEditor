
from flask import Flask, request,redirect, url_for,render_template, jsonify, send_file
import os
from moviepy.editor import *


app = Flask(__name__,static_url_path='/static')
app.config['UPLOAD_FOLDER'] = app.root_path + "/static"

def videoMuteCrop(name,dur):
    print(name,dur)
    num=int(len(dur)/2)
    paths=[]
    for i in range(0,num):
        start=dur[0+(i*2)]
        end=dur[1+(i*2)]
        clip = VideoFileClip(app.config['UPLOAD_FOLDER']+ "/" + name).subclip(start, end)
        clip=clip.volumex(0)
        duration = clip.duration
        speed= duration/3
        clip=clip.fx( vfx.speedx, speed)
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
        print("Başarılı Dosya Geldi")
        name = request.files["file"].filename
        full_filename = os.path.join(app.config['UPLOAD_FOLDER'], name)
        request.files["file"].save(full_filename)

    return name 

@app.route('/times', methods=["POST"])    
def sendTimes():
    request_data = request.get_json()
    dur=request_data["data"]
    print(name)
    result=videoMuteCrop(name,dur)
    return ({"data":result})

if __name__=="__main__":
    app.run(debug=True , host=os.getenv('IP', '0.0.0.0'), 
            port=int(os.getenv('PORT', 4444)))


