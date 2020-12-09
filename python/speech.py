import gtts
from mistyPy import Robot

# IP address
IP = "192.168.1.94"

# language for text to speech
lang = "es"

# file to save to
fname = "sound_for_misty.mp3"

# initialize misty robot object
misty = Robot(IP)

# create speech audio file
message = "hola"
sound = gtts.gTTS(message, lang=lang)
sound.save(fname)

# upload and play
misty.uploadAudio(fname, overwrite=True)
misty.playAudio(fname)

