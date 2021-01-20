var video;
var container;
var canvas;
let delay = 2000;
let idx = 0;
var data;
var v_audio_mute;
var v_display;
var v_alert;

let timerId = setTimeout(function request() {
    delay = 1000;
    video = document.getElementsByClassName("video-stream")[0];
    container = document.querySelector("#movie_player > div.html5-video-container");

    chrome
        .storage
        .sync
        .get(["v_audio_mute"], function (result) {
            //console.log("v_audio_mute", result.v_audio_mute);
            if(result.v_audio_mute == undefined ||result.v_audio_mute == null  )
            {
                v_audio_mute = "checked"
            }
            v_audio_mute = result.v_audio_mute;
        });
    chrome
        .storage
        .sync
        .get(["v_display"], function (result) {
            //console.log("v_display", result.v_display);
            if(result.v_display == undefined ||result.v_display == null)
            {
                v_display = "checked"
            }
            v_display = result.v_display;
        });
    chrome
        .storage
        .sync
        .get(["v_alert"], function (result) {
            //console.log("v_alert", result.v_alert);
            if(result.v_alert == undefined ||result.v_alert == null)
            {
                v_alert = "checked"
            }
            v_alert = result.v_alert;
        });

    if (video.currentTime == undefined) {
        delay *= 2;
    } else {
        currentSec = parseFloat(video.currentTime);
        console.log("currentSec :", currentSec);
        createArray(function (hs) {

            if (hs) {
                console.log("Hate Speech Detect");

                if (!video.muted) {
                    // 음소거를 해줘야 하는 부분
                    console.log("muted = true");
                    if (v_audio_mute == "checked") 
                        video.muted = true;
                    
                    if (container.childElementCount == 1 ) {
                        createElement(function () {
                            canvas = document.querySelector(
                                "#movie_player > div.html5-video-container > canvas"
                                
                            );
                            if(v_display == "unchecked"){
                                canvas.style.display = "none";
                            }
                            
                            createElementDiv(function(){
                                div = document.querySelector('#movie_player > div.html5-video-container > div');
                                if(v_alert == "unchecked"){
                                    div.style.display = "none";
                                }
                            });
                            // ctx = canvas.getContext("2d"); ctx.drawImage('/image/icon.png',0,0);
                        });
                    } else {
                        canvas.width = video.offsetWidth;
                        canvas.height = video.offsetHeight;
                        div.style.display = "block";
                        canvas.style.display = "block";
                        
                        // div.style.visibility  = "visible"
                    }
                }
            } else {
                if (video.muted) {
                    console.log("muted = false");
                    video.muted = false;
                    div.style.display = "none";
                    canvas.style.display = "none";
                    
                    // div.style.visibility  = "hidden"
                }
            }
        });
    }
    timerId = setTimeout(request, delay); // (*)
}, delay);

function createArray(callback) {
    chrome
        .storage
        .sync
        .get(["data"], function (result) {
            data = result;
            dataLength = result.data.length;
            flag = true;

            for (let i = 0; i < dataLength; i++) {
                time = result
                    .data[i]
                    .split("~");
                // console.log("time: ", time[0]);
                start = time[0];
                end = time[1];

                if (parseFloat(currentSec) >= parseFloat(start) && parseFloat(currentSec) <= parseFloat(end)) {
                    console.log("hate part : ", result.data[i]);
                    console.log("start :", start[0]);
                    console.log("end :", end[0]);
                    flag = true;
                    callback(flag);
                    return;
                }
            }
            callback(!flag);
        });
}

function createElement(callback) {
    console.log("appendChild");
    c = document.createElement("canvas");
    c.width = video.offsetWidth;
    c.height = video.offsetHeight;
    c.style.position = "absolute";
    c.style.zIndex = "2147483647";
    c.style.display = "block";
    c.style.backgroundColor = "black";
    container.appendChild(c);

    callback();
}

function createElementDiv(callback) {
    d = document.createElement("div");
    d.innerHTML = " -- HSG working : HATE SPEECH DETECT -- </br>[option] AudioMute : checked / black-display : checked / alert : checked"
    d.color = "white"
    d.style.fontSize = "medium"
    d.style.position = "absolute";
    d.style.zIndex = "2147483647";
    d.style.fontFamily = "courier new";
    d.style.textAlign="center";
    d.style.left = "50%";
    d.style.transform = "translateX(-50%)";
    container.appendChild(d);

    callback();
}

