#-- --------- --#
#-- SH SCRIPT --#
#-- --------- --#
# 1. Check if a file called DELETE_ME_TO_UPDATE_IMAGES.txt is in the flashdrive
# 2. If yes, Skip this script
# 3. If no, copy all files from flashdrive into static/images directory.
# 4. Once Done, create a blank text file in the flashdrive named DELETE_ME_TO_UPDATE_IMAGES.txt

echo "copy-files.sh runs..."

DRIVE_NAME="ALBUMS"
#-- --------------------------- --#
#-- LOCAL DEVELOPMENT VARIABLES --#
#-- --------------------------- --#
# PROJECT_ROOT="/Users/jeffreyfenster/Documents/02_Personal/01_Projects/frame_project/local_development"
# DRIVE_ROOT="/Volumes/$DRIVE_NAME"
#-- ------------- --#
#-- RPi VARIABLES --#
#-- ------------- --#
PROJECT_ROOT="/home/pi/Documents/frame_project_sockets"
DRIVE_ROOT="/mnt/flashdrive" #mounted here so that frame.service can wait for it to load

BLOCKERFILE_NAME="DELETE_ME_TO_UPDATE_IMAGES"
BLOCKERFILE=$DRIVE_ROOT/"$BLOCKERFILE_NAME".txt

if [ -d "$DRIVE_ROOT" ]; then
    echo "USB DRIVE is mounted: $DRIVE_ROOT"
    
    # Checks for the blocker file - we only want to copy files over if they are new/updated
    if test -f "$BLOCKERFILE"; then
        echo "Blocker File Exists, skipping copy files..."
    else
        echo "No Blocker File Exists, copying files from flashdrive..."

        echo "Copying albums from $DRIVE_ROOT ..."
        # For each subdirectory in the flashdrive, copy all files to project directory
        for SUBDIRECTORY in "$DRIVE_ROOT"/*; do
            #This if checks that $SUBDIRECTORY is a directory and a file
            if [ -d "$SUBDIRECTORY" ]; then

                DIRECTORY_LENGTH=$(find "$SUBDIRECTORY" -type f | wc -l)
                CURRENT_DIRECTORY_NAME=$( echo "$SUBDIRECTORY" | grep -oE "[^/]+$") # "/Volumes/ALBUMS/7_Home Owners" --> 7_Home Owners
                echo "DIRECTORY:" $DRIVE_ROOT
                echo "CURRENT_DIRECTORY_NAME:" $CURRENT_DIRECTORY_NAME
                echo "SUBDIRECTORY:" $SUBDIRECTORY
                echo "DIRECTORY LENGTH: $DIRECTORY_LENGTH"

                FROM="$SUBDIRECTORY"
                TO="$PROJECT_ROOT/static/images/$CURRENT_DIRECTORY_NAME"

                echo "FROM:" $FROM
                echo "TO:" $TO

                mkdir -p "$TO" #Create Directory
                cp -a "$FROM"/* "$TO" #Copy all friles in $FROM to $TO
            fi
        done

        touch "$DRIVE_ROOT/$BLOCKERFILE_NAME.txt"
    fi
else 
    echo "USB DRIVE is not mounted. Skipping..."
fi