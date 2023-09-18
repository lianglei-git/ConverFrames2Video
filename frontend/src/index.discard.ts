import { $ } from "./utils"

// import {} from 'ffmpeg.js/ffmpeg-mp4'
import { FFmpeg } from '@ffmpeg/ffmpeg'


const rootel = $("#root")[0]


const ffmpeg = new FFmpeg()


// 异步加载 FFmpeg 库文件
const loadFFmpeg = async () => {
    await ffmpeg.load();
};

// 将图片帧转换为视频
const convertFramesToVideo = async (frameFiles, outputFileName) => {
    // 启动 FFmpeg 进程
    ffmpeg.writeFile( "input.txt", frameFiles);

    // 设置输入参数
    const inputArgs = [
        "-f",
        "concat",
        "-safe",
        "0",
        "-i",
        "input.txt",
        "-c",
        "copy",
        outputFileName,
    ];

    // 运行 FFmpeg 进程
    await ffmpeg.exec(inputArgs);

    // 获取输出文件
    const data = await ffmpeg.readFile("readFile", outputFileName);

    // 将输出文件保存到本地
    return new Blob(data, { type: "video/mp4" });
};

// 使用示例
const main = async () => {
    await loadFFmpeg();

    const frameFiles = [
        { name: "frame1.jpg", data: await fetchFile("frame1.jpg") },
        { name: "frame2.jpg", data: await fetchFile("frame2.jpg") },
        // 添加更多的图片帧文件
    ];

    const outputFileName = "output.mp4";
    const videoData = await convertFramesToVideo(frameFiles, outputFileName);

    // 在这里可以使用 videoData，比如将其保存到本地或进行其他操作
};

main();