let sentiment;
let statusEl;
let submitBtn;
let inputBox;
let sentimentResult;

function setup() {
  noCanvas();
  // initialize sentiment
  sentiment = ml5.sentiment('movieReviews', modelReady);

  // setup the html environment
  statusEl = createP('Loading Model...');
  statusEl.style("font-size", '45px');
  statusEl.style("color",'#000000')
  inputBox = createInput('Today is the happiest day and is full of rainbows!');
  inputBox.attribute('size', '60');
  inputBox.style('text-align','center');
  inputBox.style('margin-left','20em')
  inputBox.style('font-size','20px')
  submitBtn = createButton('submit');
  submitBtn.style('background-color','orange');
  submitBtn.style('font-size','20px');
  submitBtn.style('margin-left','0.7em')
  sentimentResult = createP('sentiment score:');
  sentimentResult.style('font-size','35px')

  // predicting the sentiment on mousePressed()
  submitBtn.mousePressed(getSentiment);
}

function getSentiment() {
  // get the values from the input
  const text = inputBox.value();

  // make the prediction
  const prediction = sentiment.predict(text);

  // display sentiment result on html page
  sentimentResult.html('Sentiment score: ' + prediction.score);
}

function modelReady() {
  // model is ready
  statusEl.html('Model Loaded');
}
