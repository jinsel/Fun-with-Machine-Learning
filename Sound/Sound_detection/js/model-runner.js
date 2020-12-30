let model, predictionCallback;

// This function sets up the model trained in Teachable Machine.
// it takes in the URL to the model, and a function to be run
// each time the model makes a new prediction.
export async function setupModel(URL, predictionCB) {
    //store the prediction and audio callback functions
    predictionCallback = predictionCB;
    // the model.json file stores a reference to the trained model
    const modelURL = `${URL}model.json`;
    // the metatadata.json file contains the text labels of your model and additional information
    const metadataURL = `${URL}metadata.json`;

    // Load the model using the speechCommands library
    model = window.speechCommands.create('BROWSER_FFT', undefined, modelURL, metadataURL);
    await model.ensureModelLoaded();

    // this tells the model how to run when listening for audio
    const modelParameters = {
        invokeCallbackOnNoiseAndUnknown: true, // run even when only background noise is detected
        includeSpectrogram: true, // give us access to numerical audio data
        overlapFactor: 0.5 // how often per second to sample audio, 0.5 means twice per second
    };

    model.listen(
        //This callback function is invoked each time the model has a prediction.
        prediction => {
            // prediction.scores contains the probability scores that correspond to model.wordLabels().
            predictionCallback(prediction.scores);
        },
        modelParameters
    );
}
