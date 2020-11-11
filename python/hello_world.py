import random as rd
from mistyPy import Robot

# IP address
IP = "192.168.1.73"

# create robot instance
misty = Robot(IP)

# change LED to random color
(r, g, b) = [rd.randint(0, 255) for i in range(3)]
misty.changeLED(r, g, b)

# get list of saved images
images = misty.getImageList()
# set random image
img = rd.choice(images)
print(img)
misty.changeImage(img)

# get list of saved audio files
audios = misty.getAudioList()
# play random audio
aud = rd.choice(audios)
print(aud)
misty.playAudio(aud)

