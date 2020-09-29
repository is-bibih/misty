
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

// --------------- callbacks ---------------

function _KeyPhraseRec(data) {
  misty.Debug("keyphrase recognized...");

// --------------- main code ---------------

_registerKeyPhraseRecognition();

