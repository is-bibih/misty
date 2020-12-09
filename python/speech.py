import os
import time
import gtts
from mistyPy import Robot

# if known: greet (wave + speech + image)
# if unknown: learn

def misty_tts(robot, message, lang='en', fname='temp.mp3'):
    # generate file
    sound = gtts.gTTS(message, lang=lang)
    sound.save(fname)
    # upload and play
    robot.uploadAudio(fname, overwrite=True)
    robot.playAudio(fname)
    os.remove(fname)

def learn_face(robot):
    misty_tts(robot,
              'Por favor ve a la computadora.',
              lang='es')
    name = input('Introduce tu nombre.\n')
    misty_tts(robot,
              'Por favor pon tu cara 30 centímetros'
              + 'en frente de mí',
              lang='es')
    time.sleep(7)
    misty.learnFace(name)
    # check whether it was learned
    if name in robot.getLearnedFaces():
        message = 'He aprendido tu cara.'
    else:
        message = 'No pude aprender tu cara.'
    misty_tts(robot, message, lang='es')
    time.sleep(5)

def greet(robot, name, image='e_Admiration.jpg'):
    robot.changeImage(image)
    # arm, position, speed percent 
    robot.moveArmDegrees('right', -89, 30)
    misty_tts(robot, 'hola, ' + name, lang='es')
    time.sleep(2)
    robot.moveArmDegrees('right', 50, 30)
    robot.changeImage('e_DefaultContent.jpg')

# IP address
IP = "192.168.1.94"

# initialize misty robot object
misty = Robot(IP)

learn_face(misty)

