echo "app.sh runs..."

# Pull lastest code from Github
cd /home/pi/Documents/frame_project_sockets && /usr/bin/git pull https://github.com/menshguy/frameProject.git frame_valentinesDay_subway

# @TODO- Copy Files from Flashdrove?

# Start Flask App
/home/pi/Documents/frame_project_sockets/venv/bin/python3 /home/pi/Documents/frame_project_sockets/app.py