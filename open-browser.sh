echo "*** *********************** ***"
echo "*** open-browser.sh runs... ***"
echo "*** *********************** ***"

# Notes:
#   Trailing & will run this process in the background
#   DISPLAY Variable is set in the systemd service file

#   To Open Dev tools, run this on raspberry pi terminal:
#        ssh -L 0.0.0.0:9223:localhost:9222 localhost -N
#    and on Local Computer, open:
#        http://192.168.0.15:9223
/usr/bin/chromium-browser --start-fullscreen --kiosk --noerrdialogs --disable-session-crashed-bubble --remote-debugging-port=9222 --disable-infobars http://127.0.0.1:5001/