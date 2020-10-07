let model, webcam, predictionCallback, context;

// This function sets up the model trained in Teachable Machine.
// it takes in the URL to the model, and a function to be run
// each time the model makes a new prediction.
export async function setupModel(URL, predictionCB) {
  //store the prediction callback function
  predictionCallback = predictionCB;
  // the model.json file stores a reference to the trained model
  const modelURL = `${URL}model.json`;
  // the metatadata.json file contains the text labels of your model and additional information
  const metadataURL = `${URL}metadata.json`;

  // Load the model using the tmPose library
  model = await window.tmPose.load(modelURL, metadataURL);

  // this function from the tmImage library returns a video element that
  // shows a video feed from the webcam
  webcam = new window.tmPose.Webcam(300, 300, true); //width, height, flipped
  await webcam.setup(); // request access to the webcam
  await webcam.play();

  // get our canvas that we will draw the webcam and pose to
  const canvas = document.getElementById('webcam-pose-canvas');
  canvas.width = 300;
  canvas.height = 300;
  context = canvas.getContext('2d');

  // kick off the model prediction loop
  window.requestAnimationFrame(loop);
}

// This function will run forever in a loop
async function loop() {
  // update the webcam frame
  webcam.update();
  // make a prediction using the model
  await predict();
  // then call loop again
  window.requestAnimationFrame(loop);
}

// This function uses the model we loaded to
// get pose data from the webcam data, then make a prediction on that data
async function predict() {
  // Prediction #1: run the webcam through posenet
  // estimatePose can take in an image, video or canvas html element
  const {
    pose,
    posenetOutput
  } = await model.estimatePose(webcam.canvas);
  // Prediction 2: run pose data through teachable machine model
  const prediction = await model.predict(posenetOutput);

  // Update the visualization on the canvas
  drawWebcamAndPose(pose);

  // Call the prediction callback function now that we have new prediction data
  predictionCallback(prediction);
}

function drawWebcamAndPose(pose) {
  // draw the webcam image to the canvas
  context.drawImage(webcam.canvas, 0, 0);

  // draw the keypoints and skeleton to the canvas
  // from the pose prediction of our model
  if (pose) {
    const minPartConfidence = 0.1;
    window.tmPose.drawKeypoints(pose.keypoints, minPartConfidence, context);
    window.tmPose.drawSkeleton(pose.keypoints, minPartConfidence, context);
  }
}