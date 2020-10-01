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
  misty.RegisterEvent("KeyPhraseRec", "KeyPhraseRecognized", 1000, false);
}

function _registerTOF() {
  // restrict event to front center sensor
  misty.AddPropertyTest("FrontTOF", "SensorPosition", "==", "Center", "string");
  // restrict event to distance <= 20 cm
  misty.AddPropertyTest("FrontTOF", "DistanceInMeters", "<=", 0.3, "double");

  // register event (check every 250 ms)
  misty.RegisterEvent("FrontTOF", "TimeOfFlight", 250);
}

// --------------- callbacks ---------------

function _KeyPhraseRec(data) {
  misty.Debug("keyphrase recognized...");

  goForward();
}

function _FrontTOF(data) {
  // get sensor data
  var frontTOF = data.PropertyTestResults[0].PropertyParent;
  // output sensor data
  misty.Debug("distance: " + frontTOF.DistanceInMeters);
  misty.Debug("sensor Position: " + frontTOF.SensorPosition);

  // stop misty
  misty.Debug("stopping misty...");
  misty.Stop();
}

// --------------- wrappers ----------------

function goForward() {
  misty.DriveTime(
    30,       // linear speed
    0,        // angular speed
    10000);   // time in ms

  _registerTOF();
}

// --------------- main code ---------------

misty.Debug("starting skill GoAndReturn");
_registerKeyPhraseRecognition();

