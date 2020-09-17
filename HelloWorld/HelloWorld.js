// hello world tutorial: https://docs.mistyrobotics.com/misty-ii/get-started/hello-world/

// the misty object allows us to issue commands to the robot in the local environment

// sends a message to debug listeners (e.g. the console)
misty.Debug("the HelloWorld skill is starting")

// returns a random integer between min and max
function getRandomInt(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

// timer events invoke a callback function called _eventName
// we declare it
function _look_around(repeat = true) {
  // moves misty's head to random position within range of motion
  misty.MoveHeadDegrees(
    getRandomInt(-40, 20),  // pitch
    getRandomInt(-30, 30),  // roll
    getRandomInt(-40, 40),  // yaw
    null,                   // speed (we use duration instead)
    1);                     // movement duration (in s)

  // register the timer even again so it becomes a loop
  // (while repeat is true)
  if (repeat) misty.RegisterTimerEvent(
    "look_around",
    getRandomInt(5, 10) * 1000,
    false);
}

// wrapper function to wave right arm
function waveRightArm() {
  misty.MoveArmDegrees(
    "right",    // right arm
    -80,        // raise 80 degrees,
    30);        // 30% speed
  misty.Pause(3000);
  misty.MoveArmDegrees("both", 80, 30);
}

// wrapper function for face recognition
// (works with previously learned faces from command center)
function _registerFaceRec() {
  // cancel any running face recognition
  misty.StopFaceRecognition();
  // start face recognition
  misty.StartFaceRecognition();
  // add a property test to limit when the callback function should be invoked
  // if the test was not there, all FaceRecognition events would invoke the callback
  misty.AddPropertyTest(
    "FaceRec",          // name of the event to check for properties
    "Label",            // property to check
    "exists",           // comparison condition
    "", "string");
  // register for FaceRecognition events
  misty.RegisterEvent(
    "FaceRec",          // event name
    "FaceRecognition",  // message type
    1000,               // debounce (how often message is received)
    false);             // keepAlive
    // keepAlive: should misty remain registered for event after callback
}

// callback function for FaceRec events
function _FaceRec(data) {
  // store value of detected face
  var faceDetected = data.PropertyTestResults[0].PropertyParent.Label;
  // log detected face
  misty.Debug("misty sees " + faceDetected);

  // wave if person is recognized, act confused if not
  var faceID = "vivi";
  if (faceDetected == faceID) {
    misty.DisplayImage("e_Joy.jpg");
    misty.PlayAudio("001-OooOooo.wav", 80);
    waveRightArm();
  }
  else if (faceDetected == "unkown person") {
    misty.DisplayImage("e_Contempt.jpg");
    misty.PlayAudio("002-Weerp.wav");
  }

  // register for a timer event to invoke callback function
  // the callback function loops throught the event after 7 s
  misty.RegisterTimerEvent("registerFaceRec", 7000, false);
}

// misty.RegisterTimerEvent(eventName, callbackTimeInMs, keepAlive)
// keepAlive: should misty remain registered for event after callback
misty.RegisterTimerEvent("look_around", getRandomInt(5, 10) * 1000, false);

// pulses from one color to another
// misty.TransitionLED() continues until misty is powered off or receives new LED command
misty.TransitionLED(
  140, 0, 220,    // first color in RGB (purple)
  0, 0, 0,        // second color (black, off)
  "Breathe",      // transitionType (Blink/Breathe/Transition)
  1000);          // timeMs

// play audio file
// misty.PlayAudio(fileName, volumePercent)
misty.PlayAudio("001-Veep.wav", 100);
misty.Pause(3000);

// move misty with DriveTime(linearVelocity, angularVelocity, duration)
// velocities are percentages of max velocity
// there has to be a pause between commands so they do not override previous ones
misty.DriveTime(0, 30, 5000);   // rotate misty to left
misty.Pause(6000);              // wait to complete movement + 1 s
misty.DriveTime(0, -30, 5000);  // rotate to right
misty.Pause(6000);              // wait to complete movement + 1 s
misty.Stop();                   // stop driving motors

// wave arm :)
waveRightArm();

// start face recognition
_registerFaceRec();

