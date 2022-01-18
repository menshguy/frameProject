#!/home/pi/Documents/frame_project_sockets/venv/bin/python3

from flask import Flask, request, jsonify, render_template
from flask_socketio import SocketIO, emit
from gpiozero import Button, LED
import requests
from subprocess import check_output

# Flask and Sockets Setup
print("server runs")
app = Flask(__name__)
app.config['SECRET_KEY'] = 'secret!'
socketio = SocketIO(app)

# Pi Board - See frame_schematic.pdf for board setup
button = Button(10)
led_light = LED(18)
pi_ip_address = '192.168.0.15' # This addres is static:  https://www.makeuseof.com/raspberry-pi-set-static-ip/ 
host = '127.0.0.1'
port = 5001
local_url = 'http://{}:{}/'.format(host, port)
print("local_url: ", local_url)

# Sockets
current_client = None
clients = []
def send_background_update(client_id, data):
	socketio.emit('update_svg', data, room=client_id)
def print_clients():
	print("current client", current_client)
	print("clients:", clients)

# Button Functions
# url = '{}/switch'.format(local_url)
def button_pressed():
	data = { "status" : "on", "color" : "green" }
	# Sockets:
	led_light.on()
	send_background_update(current_client, data)
	## Ajax:
	# requests.get(url, params=data)
def button_unpressed():
	data = { "status": "off", "color" : "red" }
	# Sockets:
	led_light.off()
	send_background_update(current_client, data)
	## Ajax:
	# requests.get(url, params=data)

# Append functions to RPi Pins
button.when_pressed = button_pressed
button.when_released = button_unpressed


# ----- SOCKET EVENTS -----#
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
# ----- END SOCKET EVENTS -----#


# ----- API ROUTES ----- #
@app.route('/')
def index():
	return render_template('index.html')

# If you want to use AJAX on the FE instead of Sockets, you can leverage the methods below *(Requires a network connection)
#@app.route('/led', methods=['GET'])
#def led():
#   print("/led")
#   status = request.args.get('status')
#   if status == "on":
#       led_light.on()
#       return jsonify({"message": "Led successfully turned on!"})
#   elif status == "off":
#       led_light.off()
#       return jsonify({"message": "Led successfully turned off!"})
#   else:
#       return jsonify({"message": "Not a valid status"})

# @app.route('/switch', methods=['GET'])
# def switch():
# 	status = request.args.get('status')
# 	if status == "on":
# 		led_light.on()
# 		data = { "color" : "green" }
# 		send_background_update(current_client, data)
# 		return jsonify({"message": "button pressed, light on", "status": status})
# 	if status == "off":
# 		led_light.off()
# 		data = { "color" : "#17a2b8" }
# 		send_background_update(current_client, data)
# 		return jsonify({"message": "button unpressed, light off", "status": status})
# 	else:
# 		return jsonify({"message": "invalid status", "status": status})

# ----- END API ROUTES ----- #

# ----- RUN APP ----- #
if __name__ == '__main__':
	socketio.run(app, host=host, port=port)
