echo "*** *********************** ***"
echo "*** open-browser.sh runs... ***"
echo "*** *********************** ***"

# Notes:
#   Trailing & will run this process in the background
#   DISPLAY Variable is set in the systemd service file
/usr/bin/chromium-browser --start-fullscreen --kiosk --noerrdialogs --disable-session-crashed-bubble --remote-debugging-port=9222 --disable-infobars http://127.0.0.1:5001/