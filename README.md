# Frame Project

## Detailed Setup and RPi Notes
https://docs.google.com/document/d/1VD0glMboO8HY1I23oZjOkPFzy_jcqtAYsdGe0Dx7LQw/edit#


## DEVELOPMENT
1. You can SSH into your Pi via a terminal, VSCode or VNC Viewer
`ssh pi@192.168.0.15` and enter password

2. Navigate to project directory
`cd /home/pi/Documents/frame_project_sockets`

3. Start the flask server in a Pi terminal window
`. venv/bin/activate` or `source venv/bin/activate`
`FLASK_ENV=development FLASK_APP=app.py flask run` # I think you can also just do `python3 app.py`

4. Open browser to localhost (should be https://locahost:5001 or http://127.0.0.1:5001)

## How this App runs on start
1. Autostart file will launch chromium on start with flags
`~/.config/lxsession/LXDE-pi/autostart`

2. systemd service file will launch the python app on start
`/lib/systemd/system/frame.service`



## Quick Setup
### autostart file updates
1. Create an autostart document in ~/.config/lxsession/LXDE-pi/
```
sudo nano ~/.config/lxsession/LXDE-pi/autostart
```

2. Updates its contents like so
```
@lxpanel --profile LXDE-pi
@pcmanfm --desktop --profile LXDE-pi
point-rpi

# Production Mode: This will start chromium in Kiosk Mode. This will make it 
# challenging to escape fullscreen mode, but all errors and dialogues will be hidden.
#@chromium-browser --start-fullscreen --kiosk --noerrdialogs --disable-session-crashed-bubble --disable-infobars http://127.0.0.1:5001/

# Development mode: This will start chromium without the kiosk flag. This will let you
# more easily escape fullscreen mode, but chromium will display errors and the "restore session" diaglogue
@chromium-browser --start-fullscreen --noerrdialogs --disable-session-crashed-bubble --disable-infobars http://127.0.0.1:5001/

@unclutter -idle 2

```

### .service file updates
1. Create a new .service file in /lib/systemd/system/ and name it whatever you'd like (i.e. frame.service)
```sudo nano /lib/systemd/system/frame.service```

2. Give it the following contents
*Make sure that you have python3 installed in a virtual environment, and that you are running that instance of Python.
*Make sure the routes here point to your files correctly
```
[Unit] 
Description=Start Frame Project 
After=multi-user.target

[Service]
ExecStart=/home/pi/Documents/frame_project_sockets/venv/bin/python3 /home/pi/Documents/frame_project_sockets/app.py

[Install]
WantedBy=multi-user.target

```

### Create your Application
1. Setup your application in /home/pi/Documents/... or wherever.
The Example sockets project is setup in `/home/pi/Documents/frame_project_sockets`


## Debugging
### Frontend
Touch and hold on screen to open menu. 
Select Exit Fullscreen
Select Inspect to open console

### Backend
1. Open a terminal (you can SSH in via your computer. If there is no network you will need to connect a monitor to the pi. Right click or touch and hold to open menu, exit fullscreen, and use the raspberry pi quick menu to open a terminal
2. Run this to view service logs:
`systemctl status frame.service`
4. To restart the service, run
```
sudo systemctl stop frame.service
sudo systemctl start frame.service 
```
