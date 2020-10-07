let video;
// For displaying the label
let label = "Model is Loading"
let confidence;
// The classifier
let classifier;
let loading;
let modelURL = "https://teachablemachine.withgoogle.com/models/VYn46vwaE/";

// STEP 1: Load the model!
function preload() {
  classifier = ml5.imageClassifier(modelURL + "model.json");
}

function setup() {
  canv = createCanvas(640, 520);
  // Create the video
  video = createCapture(VIDEO);
  video.hide();
  // STEP 2: Start classifying
  classifyVideo();
  canv.class("card");
  canv.position(width / 2 + 50, height / 2 - 90);
}

// STEP 2 classify the video!
function classifyVideo() {
  classifier.classify(video, gotResults);
}

function draw() {
  background(255);

  // Draw the video
  image(video, 40, 40, 560, 400);

  // STEP 4: Draw the label
  drawText();
  drawConf();
  // Pick an emoji
  let emoji;
  if (label == "dog" || label == "Dog") {
    emoji = "🐶";
  } else if (label == "book" || label == "Book") {
    emoji = "📚";
  } else if (label == "bottle" || label == "Bottle") {
    emoji = "🍾";
  } else if (label == "mobile" || label == "Mobile") {
    emoji = "📱";
  } else if (label == "human" || label == "Human") {
    emoji = "🥱";
  }

  // Draw the emoji
  textSize(100);
  text(emoji, width / 2, height / 2 + 150);
}

function drawText(font) {
  textAlign(CENTER, CENTER);
  fill("#023047");
  textFont("PressStart2PRegular", 30);
  text(label, width / 2 + 10, height - 20);
}

function drawConf(font) {
  textAlign(CENTER, CENTER);
  fill("#ED225D");
  textFont("PressStart2PRegular", 20);
  text(confidence, width / 2 + 300, height - 20);
}

// STEP 3: Get the classification!
function gotResults(error, results) {
  // Something went wrong!
  if (error) {
    console.error(error);
    return;
  }
  // Store the label and classify again!
  label = results[0].label;
  confidence = results[0].confidence;
  classifyVideo();
}