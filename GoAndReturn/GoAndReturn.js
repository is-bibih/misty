/* -------------- code flow ----------------
 * 1) register for keyphrase recognition
 * 2) on keyphrase event, start driving forward
 * 3) when driving forward, register for TOF event
 * 4) on TOF event, stop driving
 * 5) register for head sensor event
 * 6) on head sensor event, turn around
 * 7) go back
*/

// --------------- listeners ---------------

function _registerKeyPhraseRecognition() {
  // stop existing keyphrase processes
  misty.StopKeyPhraseRecognition();
  // begin listening for keyphrase
  // (false so that it does not record audio)
  misty.StartKeyPhraseRecognition(false);

  // register event
  misty.RegisterEvent("KeyPhraseRec", "KeyPhraseRecognized", 1000);
}

function _registerTOF() {
  // restrict event to front center sensor
  misty.AddPropertyTest("FrontTOF", "SensorPosition", "==", "Center", "string");
  // restrict event to distance <= 20 cm
  misty.AddPropertyTest("FrontTOF", "DistanceInMeters", "<=", 0.3, "double");

  // register event (check every 250 ms)
  misty.RegisterEvent("FrontTOF", "TimeOfFlight", 250);
}

function _registerHeadTouch() {
  // filter out chin and scruff events (the rest are for the head)
  misty.AddPropertyTest("HeadTouch", "SensorPosition", "!==", "Chin", "string");
  misty.AddPropertyTest("HeadTouch", "SensorPosition", "!==", "Scruff", "string");
  // only events when the sensor is released
  misty.AddPropertyTest("HeadTouch", "IsContacted", "==", "false", "boolean");

  // register event
  misty.RegisterEvent("HeadTouch", "TouchSensor", 1000);
}

// --------------- callbacks ---------------

function _KeyPhraseRec(data) {
  misty.Debug("keyphrase recognized");
  // play audio
  misty.PlayAudio("001-Veep.wav", 50);

  goForward();
}

function _FrontTOF(data) {
  // get sensor data
  var frontTOF = data.PropertyTestResults[0].PropertyParent;
  // output sensor data
  misty.Debug("distance: " + frontTOF.DistanceInMeters);

  misty.Debug("stopping misty...");
  // stop misty
  misty.Stop();
  //play audio
  misty.PlayAudio("013-Surprised-Ahghh.wav", 50);
}

function _HeadTouch(data) {
  // get sensor data
  var headTouch =  data.PropertyTestResults[0].PropertyParent;
  // output which sensor was triggered
  misty.Debug("sensor touched: " + headTouch.SensorPosition);
  // play audio
  misty.PlayAudio("002-Growl-01.wav", 50);
}

// --------------- wrappers ----------------

function goForward() {
  misty.DriveTime(
    30,       // linear speed
    0,        // angular speed
    10000);   // time in ms

  _registerTOF();
  _registerHeadTouch();
}

// --------------- main code ---------------

misty.Debug("starting skill GoAndReturn");
_registerKeyPhraseRecognition();

