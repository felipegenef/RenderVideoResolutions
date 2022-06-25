const path = require("path");
var ffmpeg = require("fluent-ffmpeg");
const arg = require("arg");
const cliProgress = require("cli-progress");

// create new progress bar
const bar = new cliProgress.SingleBar({
  format: "Render Progress |" + "{bar}" + "| {percentage}%",
  barCompleteChar: "\u2588",
  barIncompleteChar: "\u2591",
  hideCursor: true,
});
bar.start(100, 0);
function parseArgumentsIntoOptions(rawArgs) {
  const args = arg(
    {
      "--input": String,
      "--output": String,
    },
    { argv: rawArgs.slice(2) }
  );
  return {
    inputFile: args["--input"] || "video.mp4",
    videoName: args["--output"] || args["--input"].split(".")[0],
  };
}
const { videoName, inputFile } = parseArgumentsIntoOptions(process.argv);
const firstDate = new Date();
ffmpeg(inputFile)
  .output(path.resolve(__dirname, "1080" + videoName + ".mp4"))
  .videoCodec("libx264")
  .size("1920x1080")

  .output(path.resolve(__dirname, "720" + videoName + ".mp4"))
  .videoCodec("libx264")
  .size("1280x720")

  .output(path.resolve(__dirname, "480" + videoName + ".mp4"))
  .videoCodec("libx264")
  .size("852x480")

  .output(path.resolve(__dirname, "360" + videoName + ".mp4"))
  .videoCodec("libx264")
  .size("640x360")

  .output(path.resolve(__dirname, "240" + videoName + ".mp4"))
  .videoCodec("libx264")
  .size("426x240")

  .output(path.resolve(__dirname, "144" + videoName + ".mp4"))
  .videoCodec("libx264")
  .size("256x144")

  .on("error", function (err) {
    console.log("An error occurred: " + err.message);
  })
  .on("progress", function (progress) {
    bar.update(Number(progress.percent.toFixed(2)));
  })
  .on("end", function () {
    const secondDate = new Date();
    var minutes = Math.floor((secondDate - firstDate) / 60000).toFixed(2);
    console.log("\n\nFinished processing after ", minutes, " minutes.");
    process.exit();
  })
  .run();
