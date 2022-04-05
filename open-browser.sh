echo "open-browser.sh runs..."
# Production Mode: Kiosk gets rid of the chrome "restore session" modal, but makes it harder to escape the browser)
# @chromium-browser --start-fullscreen --kiosk --noerrdialogs --disable-session-crashed-bubble --disable-infobars http://127.0.0.1:5001/

# Development mode: No Kiosk - for debugging
#@chromium-browser --start-fullscreen --noerrdialogs --disable-session-crashed-bubble --disable-infobars http://127.0.0.1:5001/
# https://wiki.mozilla.org/Firefox/CommandLineOptions#-browser
firefox-esr -kiosk -private-window http://127.0.0.1:5001/