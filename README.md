# Frame Project

![Demo Gif](github_demo.gif)
(2x speed)

## Detailed Setup and RPi Notes
https://docs.google.com/document/d/1VD0glMboO8HY1I23oZjOkPFzy_jcqtAYsdGe0Dx7LQw/edit#


## Pi Details
*IP: 192.168.0.15
*Username: pi
*Password: [reptile-lowercase][##]

## For A More basic version of this project
1. Checkout the `basic-project` branch
`git checkout basic-project`


## How This Project Works
### 1. Upload Images to Flashdrive and plug in
1. Make sure Flashdrive is mounted - the service will not start without it.
2. Flashdrive will get mounted to `/mnt/flashdrive`. This is so we can be sure the flashdrive is available with the service starts
### 2. On boot, the pi will run the `autostart` script and `frame.service` will start
1. Autostart file - just hides the mouse
> `sudo nano ~/.config/lxsession/LXDE-pi/autostart`
2. Frame service - Copies files from flashdrive, starts frame.service (flask app), opens the flask app in browser
> `sudo nano /lib/systemd/system/frame.service`

## How To Add Pictures to this Project
### 1. Plug flashdrive into the computer.
### 2. Each Directory will create a new subway stop named after the dirctory and ordered according the prefix.
For example, a directory titled `01_Cats and Dogs` will be ordered according to the 01 prefix, and will create a new subway stop titled "Cats and Dogs"

### 4. If you'd like to order the photos, you can number them with a prefix just like with the albums. Otherwise they will appear in a random kind of order.
### Supported Image Types
`png`, `jpg`, `heic`, `.gif`
> NOTE: the copy-files script will hande any .heic pictures by converting them to .png, optimizing them, and rotating 90deg



## Setup
### Setup the Pi Service and Autostart files
1. Pull this repo onto your pi `/home/pi/Documents` (The full file path must be `~/Documents/frame_project_sockets`. If you change the location, you must update the frame.service file)
2. Make sure the appropriate lines in app.py are uncommented - so that it can run on the pi vs local
3. Copy and paste the `autostart` and `frame.service` files from the repo into the proper location on the Pi (name files as they are in the repo).
Service file: `/lib/systemd/system/frame.service`
Autostart file: `~/.config/lxsession/LXDE-pi/autostart`
4. Make sure the DELETE file is deleted on the flashdrive :)
### Setup the Flask App
4. Enable the frame.service to run on boot: `sudo systemctl enable frame.service`
5. From the frame_project_sockets directory, create a venv `python3 -m venv env`
6. Activate the venv: `source venv/bin/activate`
7. pip install `python3 -m pip install -r requirements.txt` - venv must be activated in order to install packages correctly
8. Flashdrive must be mounted in order for the application to start correctly. (It must be that specific flashdrive - or one with same name "flashdrive")
9. If all of the above is done correctly, the service should launch on boot and open in a new browser window
*If it does not boot, check the logs:
```
systemctl status frame.service //For truncated logs
journalctl -u frame.service //For the full logs
```
10. For Development, see Development section below
### Setup the Pi configuration/settings
1. Install Chrome: `sudo apt-get install chromium-browser`
2. Flip Chrome Flags for hardware Accelleration
3. chrome://flags
```
GPU rasterization: Disabled
Accelerated 2D canvas: Disabled
Override software rendering list: Disabled
Hardware-accelerated video decode: Enabled
```
4. Setup the Flashdrive mount. Create the Flash Drive directory
`sudo mkdir /mnt/flashdrive`
5. Open this file:
`sudo nano /etc/fstab`
5. Add this line: `UUID=A11A-1A1D /mnt/flashdrive vfat defaults,nofail,x-systemd.device-timeout=1 0 2` <img width="652" alt="image" src="https://user-images.githubusercontent.com/6055029/182486448-c71a69cb-f6f1-4b84-8940-1d0a7e42a0ca.png">
6. Disable Screen Blanking: https://www.radishlogic.com/raspberry-pi/how-to-disable-screen-sleep-in-raspberry-pi/#:~:text=Steps%20to%20disable%20Screen%20Blanking,Screen%20Blanking%20row%2C%20click%20Disable%20
7. Setup hardware accelleration. In Raspi-config (`sudo raspi-config`) Navigate to Advanced Options. Turn on `OpenGL with fake KMS switch`
8. Try upping the RAM in `sudo raspi-config` > Performance Options > GPU Memory (try 128)







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
3. To view the app that is running on the pi locally, Run this line of code in the terminal (Note that the `--remote-debugging-port=9222` flag must be presetn in the chromium start script)
```
ssh -L 0.0.0.0:9223:localhost:9222 localhost -N
```
... and open the port on your local machine like so:
```
http://[RPI_IP_ADDRESS]:9223
```
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
### To view computer processes/performance
`htop`
### To view Service Status (and start/stop)
To Start/Stop the service
`sudo systemctl restart frame.service`
`sudo systemctl stop frame.service`
`sudo systemctl start frame.service`
To restart the daemon:              `sudo systemctl daemon-reload` (MUST do after editing the service files)
To View status and truncated logs:  `systemctl status frame.service`
To View Full Logs:                  `journalctl -u frame.service`
