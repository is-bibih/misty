
// stop mapping processes
misty.Debug("stopping mapping...");
misty.StopMapping();
misty.Debug("done");

// start mapping
misty.Debug("starting mapping...");
misty.StartMapping();
misty.Debug("done");

// wait for pose
let hasPose = false;
let i = 0;
// first define callback
function _GetSlamStatus(data) {
  statusString = JSON.stringify(data.Result.StatusList);
  misty.Debug(statusString); // print status
  if (statusString.includes("HasPose")) {
    hasPose = true;
    misty.Debug("misty has pose")
  }
}
// repeat until pose is acquired
misty.Debug("getting pose...");
while (!hasPose & i < 10) {
  misty.Debug("attempt " + i + " at getting pose");
  misty.GetSlamStatus();
  i++;
  misty.Pause(2000);
}
if (hasPose) {
  misty.Debug("pose acquired!");
} else {
  misty.Debug("failed to acquire pose");
}

// manually move misty

// stop mapping
misty.Debug("stopping mapping...");
misty.StopMapping();
misty.Debug("done");
misty.Debgug("ending skill...");

