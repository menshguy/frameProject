#!/home/pi/Documents/frame_project_sockets/venv/bin/python3

# TO DEVELOP LOCALLY YOU MUST:
# 1. YOU ABSOLUTELY MUST REMOVE "DEVICE" FROM THE "from gpiozero import Device, Button, LED" 
# 		and ""from gpiozero.pins.mock import MockFactory" LINEs Below!!! (NOT SURE WHY)
# 2. COMMENT OUT THE "Device.pin_factory = MockFactory()" LINE BELOW!
# 4. YOU MUST COMMENT OUT THE TEST BUTTONS IN THE INDEX.HTML

import os
from flask import Flask, request, jsonify, render_template
from flask_socketio import SocketIO, emit
from subprocess import check_output

#-- ------------------------------------ --#
#-- LOCAL DEVELOPMENT IMPORTS & VARIABLES--#
#-- ------------------------------------ --#
# from gpiozero import Device, Button, LED
# from gpiozero.pins.mock import MockFactory
# Device.pin_factory = MockFactory() #Mock RPi Pins (https://gpiozero.readthedocs.io/en/stable/api_pins.html#mock-pins)
# projectRoot = "/Users/jeffreyfenster/Documents/02_Personal/01_Projects/frame_project/local_development"
#-- ----------------------- --#
#-- RPI IMPORTS & Variables --#
#-- ----------------------- --#
from gpiozero import Button, LED
projectRoot = "/home/pi/Documents/frame_project_sockets"


print("App.py runs...")

# ----- Setup ----- #
app = Flask(__name__)
app.config['SECRET_KEY'] = 'secret!'
socketio = SocketIO(app)
current_client = None
clients = []
# ----- End Setup ----- #

# ----- Pi Board ----- #
# See frame_schematic.pdf for board setup
button = Button(10)
led_light = LED(18)
# was_held = False # https://github.com/gpiozero/gpiozero/issues/685
pi_ip_address = '192.168.0.15' # This addres is static:  https://www.makeuseof.com/raspberry-pi-set-static-ip/ 
host = '127.0.0.1'
port = 5001
local_url = 'http://{}:{}/'.format(host, port)
print("local url: ", local_url)
# ----- End Pi Board ----- #

# ----- Methods ----- #
def send_update(event, client_id, data):
	socketio.emit(event, data, room=client_id)
def print_clients():
	print("current client", current_client)
	print("clients:", clients)
def button_pressed():
	print("button_pressed")
	global was_held
	was_held = False
def button_unpressed():
	print("button_unpressed")
	data = {}
	global was_held
	if not was_held:
		send_update('next_image', current_client, data)
	was_held = False
def button_held():
	print("button_held")
	data = {}
	global was_held
	was_held = True
	send_update('next_album', current_client, data)
button.when_pressed = button_pressed
button.when_released = button_unpressed
button.when_held = button_held
# ----- End Methods ----- #

# ----- Socket listeners -----#
@socketio.on('connect')
def test_connect():
	emit('connected', {'data': 'Connected to Socket.io'})
	print('Client Connected')
	current_client = request.sid
	clients.append(request.sid)
	print_clients()

@socketio.on('disconnect')
def test_disconnect():
	print('Client disconnected')
	current_client = None
	clients.remove(request.sid)
	print_clients()

@socketio.on("toggle_light")
def toggle_light(status):
	print("toogle_light event", str(status))
	if str(status) == "on":
		led_light.on()
	if str(status) == "off":
		led_light.off()
	else:
		print("failed toogle_light")
# ----- End Socket listeners -----#


# ----- API Routes ----- #
@app.route('/')
def index():
	return render_template('index.html')

@app.route('/albums/')
def albums():
    albums = []
    albumNames = os.listdir(projectRoot + '/static/images')
    for albumName in albumNames:
        images = os.listdir(projectRoot + '/static/images/' + albumName)
        albums.append( dict(dir=albumName, length=len(images), images=images) )
    return jsonify(albums)
# ----- End Api Routes ----- #

# ----- Run App ----- #
if __name__ == '__main__':
	socketio.run(app, host=host, port=port)
# ----- End Run App ----- #
