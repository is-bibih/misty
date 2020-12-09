from mistyPy import Robot
import time

# IP address
IP = "192.168.1.69"
# person's name
name = "vivi"

# create robot instance
misty = Robot(IP)

# learn a face
print("about to start face learning...")
time.sleep(5)
misty.learnFace(name)

# check if face was learned
if name in misty.getLearnedFaces():
    print(name + "'s face learned successfully")
else:
    print("face not learned")
print("learned faces:\n" + misty.getLearnedFaces())

