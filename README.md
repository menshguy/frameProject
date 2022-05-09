# Frame Project

![Demo Gif](github_demo.gif)

## Detailed Setup and RPi Notes
https://docs.google.com/document/d/1VD0glMboO8HY1I23oZjOkPFzy_jcqtAYsdGe0Dx7LQw/edit#


## Pi Details
IP: 192.168.0.15
Username: pi
Password: [reptile-lowercase][##]



## How This Project Works
### 1. Upload Images to Flashdrive and plug in
1. Make sure Flashdrive is mounted - the service will not start without it.
2. Flashdrive will get mounted to `/mnt/flashdrive`. This is so we can be sure the flashdrive is available with the service starts
### 2. On boot, the pi will run the `autostart` script and `frame.service` will start
1. Autostart file - just hides the mouse
`sudo nano ~/.config/lxsession/LXDE-pi/autostart`
2. Frame service - Copies files from flashdrive, starts frame.service (flask app), opens the flask app in browser
`sudo nano /lib/systemd/system/frame.service`

## How To Add Pictures to this Project
### 1. Plug flashdrive into the computer.
### 2. Each Directory will create a new subway stop named after the dirctory and ordered according the prefix.
For example, a directory titled `01_Cats and Dogs` will be ordered according to the 01 prefix, and will create a new subway stop titled "Cats and Dogs"
### 3. Any .heic pictures will be converted to .png, optimized, and rotated 90deg
### 4. If you'd like to order the photos, you can number them. Otherwise they will appear in a random kind of order.
### Supported Image Types
`png`, `jpg`, `heic`, `.gif`


## Setup
1. Pull this repo onto your pi `/home/pi/Documents/frame_project_sockets` (If you change the location, you must update the frame.service file)
2. Make sure the appropriate lines in app.py are uncommented - so that it can run on the pi vs local
3. Dont forget to copy and paste the autostart and frame.service files from the repo into the proper location on the Pi with the same file names
4. Enable the frame.service to run on boot: `sudo systemctl enable frame.service`
5. Dont forget that the Flashdrive must be mounted in order for the application to start correctly. (It must be that specific flashdrive - or one with same name "flashdrive")
6. If all of the above is done correctly, the service should launch on boot and open in a new browser window
*If it does not boot, check the logs:
```
systemctl status frame.service //For truncated logs
journalctl -u frame.service //For the full logs
```
7. For Development, see below


## Development
### Option 1: On local machine
1. Clone this github repo: https://github.com/menshguy/frameProject.git
2. Comment out noted lines in app.py
3. Un-Comment out the Test buttons in templates/index.html (Pi pins wont work, have to mock them)
4. Start Flask App Locally & Open port in browser
`FLASK_APP=app.py flask run --host=0.0.0.0`
5. Develop and push
5. SSH into Pi and pull changes
### Option 2: On Pi
1. Open VSCode on local machine and SSH Into the Pi (192.168.0.15)
2. Open VSCode terminal to interact with the Pi
3. To view the app that is running on the pi locally, Run this line of code in the terminal
`ssh -L 0.0.0.0:9223:localhost:9222 localhost -N`
    ... and open the port on your local machine like so:
`http://192.168.0.15:9223`
5. Now you can code while refreshing the local browser to see updates
### Option 3: VNC viewer
1. You can also connect to the pi via VNC viewer and some combination of the above 2



## Important File Locations
### Flask App (& this git repo)
`~/Documents/frame_project_sockets`
### Autostart Script
`sudo nano ~/.config/lxsession/LXDE-pi/autostart`
### Frame Service File
`sudo nano /lib/systemd/system/frame.service`
### Flash Drive Mount Location
`mnt/flashdrive`



## Helpful Pi Scripts
### Kill Chromium/Firefox
`pkill -o chromium`
`pkill -o firefox`
### To Refresh Chromum
`xdotool search --onlyvisible --class Chrome windowfocus key ctrl+r`
### To view computer processeses/pefromance
`htop`
### To view Service Status (and start/stop)
To Start/Stop the service
`sudo systemctl restart frame.service`
`sudo systemctl stop frame.service`
`sudo systemctl start frame.service`
To restart the daemon (MUST do after editing the service files)
`sudo systemctl daemon-reload`
To View status and truncated logs
`systemctl status frame.service`
To View Full Logs
`journalctl -u frame.service`
