import * as FFmpeg from 'ffmpeg.js/ffmpeg-mp4'
import { renderCanvasMock } from './canvasMock'
import { $ } from './utils';
let stdout = "";
let stderr = "";

type MEMFStype = { name: string, data: ArrayBuffer }

const createConverFrames = (maxWidth = 1080, maxHeight = 1080) => {
    let Ok: (buffers: MEMFStype[]) => any
    let c = 0;
    let bufferSizeMB = 0;
    let frames: MEMFStype[] = []
    const targetCanvas = renderCanvasMock();

    if (targetCanvas) {
        /** 比例最大限度缩放 */
        const cWidth = targetCanvas.width;
        const cHeight = targetCanvas.height;
        var scale = Math.min(maxWidth / cWidth, maxHeight / cHeight);
        var width = ~~(cWidth * scale);
        var height = ~~(cHeight * scale);
        if (width % 2) {
            width += 1;
        }
        if (height % 2) {
            height += 1;
        }
        targetCanvas.width = width;
        targetCanvas.height = height;
    }

    let time = setInterval(() => {
        const targetCanvas = renderCanvasMock()
        if (!targetCanvas) return void 0;

        c++;
        if (c == 20) {
            clearInterval(time);
            Ok(frames);
        }
        targetCanvas?.toBlob(async (v) => {
            const buffer = await v?.arrayBuffer();

            if (buffer) {
                bufferSizeMB += buffer.byteLength / (1024 * 1024);
                console.log('createConverFrames ~~ bufferSizeMB -->', bufferSizeMB);
                frames.push({
                    name: `${c}.png`,
                    data: buffer
                })
            }
        })
    }, 300)

    return new Promise(res => (Ok = res))
}


const downloadMp4 = (data, fileName) => {
    const src = URL.createObjectURL(
        new Blob([data], {
            type: 'video/mp4'
        })
    );
    const link = document.createElement('a');
    link.href = src;
    link.setAttribute('download', `${fileName}.mp4`);
    link.click();
    document.body.appendChild(link);
    link.remove();
};



const imgToVideo = (frames) => {
    const time = '20000ms';
    const result = (FFmpeg as any)({
        arguments: [
            '-f',
            'image2',
            '-framerate',
            // 0.33秒每张图片
            '3', // 1 / 0.33
            '-i',
            '%d.png',
            // '-vcodec',
            // 'libx264',
            //   '-r',
            //   '24',
            '-pix_fmt',
            'yuv420p',
            '-preset',
            'ultrafast',
            // '-s',
            // 'INITIAL_MEMORY=4146435072',
            //   '-t',
            //   '18s',
            //   '-bufsize',
            //   '99M',
            //   '-t',
            //   '18',
            // '-vb',
            // '200M',
            '-y',
            'video.mp4'
        ],
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
    downloadMp4(result.MEMFS[0].data, 'frame2video')

}




$('#create')[0].onclick = () => createConverFrames()
    .then(imgToVideo)
