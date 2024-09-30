
// Classifier Variable
let classifier;

// Model URL
let imageModelURL = 'https://teachablemachine.withgoogle.com/models/X7wbXVogs/';

// Video
let video;

// Handpose Variables
let handPose;
let hands = [];

// To store the classification
let label = "Waiting for the TM model...";

// Font and text settings
let currentFont = 'Comic Sans MS'; // Set Comic Sans as the initial font
let displayString = "No one likes Comic Sans, let's change it!"; // Initial string
let fontsize = 16; // Initial character spacing
let pinchThreshold = 1000; // Threshold for pinch detection
let updatedSize; 

// Load the model first
function preload() {
  classifier = ml5.imageClassifier(imageModelURL + 'model.json');
  handPose = ml5.handPose({flipped: true});
}

function setup() {
  createCanvas(600, 600);
  // Create the video
  video = createCapture(VIDEO, {flipped: true});
  video.size(320, 260);
  video.hide();
  
  //Getting drawing context
  //ctx = renderer.drawingContext;

  // Start classifying
  classifyVideo();

  // Start detecting hands
  handPose.detectStart(video, gotHands);
}


function draw() {
  background(0, 0, 139); // Dark blue background color (RGB)

  // Calculate the position to center the video
  let videoX = (width - video.width) / 2;
  let videoY = (height - video.height) / 2;

  // Draw the video at the calculated center position
  image(video, videoX, videoY);

  // Adjust character spacing based on hand gestures
  updatedSize = adjustFontSize();
  console.log(updatedSize);

  // Set the font and string based on the detected label
  if (label === "Serif") {
    currentFont = 'Times New Roman'; // Change to Times New Roman for Serif
    displayString = "Ah, a classic choice."; // Display this string for Serif
  } else if (label === "Sans Serif") {
    currentFont = 'Helvetica'; // Change to Helvetica for Sans Serif
    displayString = "Phew, thank god for Helvetica"; // Display this string for Sans Serif
  } else if (label === "Classify Again") {
    // Do not change the currentFont or displayString when label is 'Classify Again'
  }

  // Set the font for the text
  textFont(currentFont);
  //drawingContext.letterSpacing = charSpacing; // Apply character spacing

  // Draw the classification label below the video
  fill(255);
  textSize(16);
  textAlign(CENTER, CENTER);
  text(label, width / 2, videoY + video.height + 40); // Positioned 40px below the video

  // Draw the display string below the classification label
  textSize(updatedSize);
  text(displayString, width / 2, videoY + video.height + 80); // Positioned 80px below the video
}

// Get a prediction for the current video frame
function classifyVideo() {
  classifier.classify(video, gotResult);
}

// When we get a result
function gotResult(results) {
  label = results[0].label;
}

// Callback function to process handpose predictions
function gotHands(results) {
  hands = results;
  console.log(hands); // Log hands to see predictions
}

// Adjust character spacing based on hand gestures
function adjustFontSize() {
  if (hands.length > 0) {
    // Checking if hand keypoints are detected
    const thumbTip = hands[0].keypoints.find(point => point.name === "thumb_tip");
    const indexFingerTip = hands[0].keypoints.find(point => point.name === "index_finger_tip");
    if (thumbTip && indexFingerTip) {
      const pinchDist = dist(indexFingerTip.x, indexFingerTip.y, thumbTip.x, thumbTip.y);
  console.log(pinchDist);

      // Adjust character spacing based on pinch distance
      if (pinchDist < pinchThreshold) {
        updatedSize = map(pinchDist, 0, pinchThreshold, 0, 100); // Adjust font size based on pinch distance
      } else {
        updatedSize = 0; // Reset character spacing if not pinching
      }
    }
  }
  return updatedSize; 
}
