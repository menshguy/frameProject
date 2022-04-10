echo "*** ******************** ***"
echo "*** start-app.sh runs... ***"
echo "*** ******************** ***"

#-- ----------------------------- --#
#-- Pull lastest code from Github --#
#-- ----------------------------- --#
# @TODO -   Could not get this to work on boot. It would pull if I restarted the service, but I believe
#           it was not waiting for the network connection, and I could not figure out how to configure the service File
#           correctly--#
# echo "pulling from github..."
# cd /home/pi/Documents/frame_project_sockets && /usr/bin/git pull https://github.com/menshguy/frameProject.git frame_valentinesDay_subway
# echo "done pulling from github"

#-- --------------- --#
#-- Start Flask App --#
#-- --------------- --#
echo "Starting Flask App..."
# trailing '&' ensures this runs in the background and allows ExecStartPost= to run... 
/home/pi/Documents/frame_project_sockets/venv/bin/python3 /home/pi/Documents/frame_project_sockets/app.py &