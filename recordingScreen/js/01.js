const video = document.getElementById('video');
const start = document.getElementById('start');
const stop = document.getElementById('stop');
const download = document.getElementById('download');


const displayMediaOptions = {
    video: {
        cursor: "never"
    },
    audio: true
}

start.addEventListener('click',function(evt){
    startCapture();
},false)

stop.addEventListener('click',function(evt){
    stopCapture();
},false)

download.addEventListener('click',function(evt){
    mydownload();
},false)


let captureStream;
let recorder;
async function startCapture() {
    log = "";
    try {
        captureStream = await navigator.mediaDevices.getDisplayMedia(displayMediaOptions);
    } catch (err) {
        console.log('Error: ' + err);
        return alert('capture is error or cancel!');
    }
    // 删除原来的blob
    window.URL.revokeObjectURL(video.src);
    video.srcObject = captureStream;
    recorder = new MediaRecorder(captureStream);
    recorder.start();

}

function stopCapture() {
    let tracks = video.srcObject.getTracks();
    tracks.forEach(track => {
        track.stop();
    });
    recorder.stop();
    recorder.addEventListener('dataavailable',(event)=>{
        let videoUrl = URL.createObjectURL(event.data,{type:'video/mp4'});
        video.srcObject = null;
        video.src = videoUrl;
    })

}

function mydownload(){
    const name = new Date().toISOString().slice(0,19).replace('T',' ').replace(' ','_').replace(/:/g,'-');
    const a = document.createElement('a');
    a.href = video.src;
    a.download = `${name}.mp4`;
    document.body.appendChild(a);
    a.click();

}
