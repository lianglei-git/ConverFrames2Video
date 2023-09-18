import * as FFmpeg from 'ffmpeg.js/ffmpeg-mp4'
import { renderCanvasMock } from './canvasMock'
import { $ } from './utils';
let stdout = "";
let stderr = "";

type MEMFStype = { name: string, data: ArrayBuffer }

const createConverFrames = () => {
    let Ok: (buffers: MEMFStype[]) => any
    let c = 0;
    let frames: MEMFStype[] = []
    let time = setInterval(() => {
        const targetCanvas = renderCanvasMock()
        c++;
        if (c == 20) {
            clearInterval(time);
            Ok(frames);
        }
        targetCanvas?.toBlob(async (v) => {
            const buffer = await v?.arrayBuffer();
            if (buffer) {
                frames.push({
                    name: `${c}.png`,
                    data: buffer
                })
            }
        })
    }, 100)

    return new Promise(res => (Ok = res))
}




const imgToVideo = (frames) => {
    const time = '20000ms';
    const result = (FFmpeg as any)({
        arguments: ['-f', 'image2', '-framerate', '1', '-i', '%d.png', "-r", "25", "-pix_fmt", "yuv420p", "-preset", "ultrafast", '-t', "60", "-y", 'video.mp4'],
        MEMFS: frames,
        print: function (data) { stdout += data + "\n"; },
        printErr: function (data) { stderr += data + "\n"; },
        onExit: function (code) {
            console.log("Process exited with code " + code);
            console.log(stdout);
            console.log(stderr);
        },
    })
    console.log(result);
    const videoEl = $("#video")[0] as HTMLVideoElement;
    videoEl.src = URL.createObjectURL(new Blob([result.MEMFS[0].data], {
        type: 'video/mp4'
    }))
    const link = document.createElement('a')
    link.href = videoEl.src
    link.setAttribute('download', `${new Date().getTime()}.mp4`)
    link.click()
    document.body.appendChild(link)

}


createConverFrames()
    .then(imgToVideo)
