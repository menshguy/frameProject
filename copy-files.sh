#-- --------- --#
#-- SH SCRIPT --#
#-- --------- --#
# 1. Check if a file called DELETE_ME_TO_UPDATE_IMAGES.txt is in the flashdrive
# 2. If yes, Skip this script
# 3. If no, copy all files from flashdrive into static/images directory.
# 4. Once Done, create a blank text file in the flashdrive named DELETE_ME_TO_UPDATE_IMAGES.txt

echo "*** ********************* ***"
echo "*** copy-files.sh runs... ***"
echo "*** ********************* ***"


#-- --------------------------- --#
#-- LOCAL DEVELOPMENT VARIABLES --#
#-- --------------------------- --#
# DRIVE_NAME="ALBUMS"
# PROJECT_ROOT="/Users/jeffreyfenster/Documents/02_Personal/01_Projects/frame_project/local_development"
# DRIVE_ROOT="/Volumes/$DRIVE_NAME"
#-- ------------- --#
#-- RPi VARIABLES --#
#-- ------------- --#
PROJECT_ROOT="/home/pi/Documents/frame_project_sockets"
DRIVE_ROOT="/mnt/flashdrive" #mounted here so that frame.service can wait for it to load

IMAGES_ROOT="$PROJECT_ROOT/static/images"
BLOCKERFILE_NAME="DELETE_ME_TO_UPDATE_IMAGES"
BLOCKERFILE=$DRIVE_ROOT/"$BLOCKERFILE_NAME".txt

if [ -d "$DRIVE_ROOT" ]; then
    echo "USB DRIVE is mounted: $DRIVE_ROOT"
    
    # Checks for the blocker file - we only want to copy files over if they are new/updated
    if test -f "$BLOCKERFILE"; then
        echo "Blocker File Exists, skipping copy files..."
    else
        echo "No Blocker File Exists, copying files from $DRIVE_ROOT..."

        if [ -d "$IMAGES_ROOT" ]; then
            echo "Removing contents of $IMAGES_ROOT..."
            rm -rf "$IMAGES_ROOT"/*
            mkdir "$DRIVE_ROOT"/x_trash #Make a trash directory to store HEIC images so we dont have to delete them after we convert them to png
        fi

        # For each subdirectory in the flashdrive, copy all files to static directory for the project
        echo "Copying albums from $DRIVE_ROOT ..."
        for DRIVE_SUBDIRECTORY in "$DRIVE_ROOT"/*; do
            #This if checks that $DRIVE_SUBDIRECTORY is a directory and not a file, otherwise it will attempt this code against the DELETE_ME file
            if [ -d "$DRIVE_SUBDIRECTORY" ]; then
                DIRECTORY_LENGTH=$(find "$DRIVE_SUBDIRECTORY" -type f | wc -l)
                CURRENT_DIRECTORY_NAME=$( echo "$DRIVE_SUBDIRECTORY" | grep -oE "[^/]+$") # renames "/Volumes/ALBUMS/7_Home Owners" --> 7_Home Owners
                echo "Current Directory: $CURRENT_DIRECTORY_NAME ( $DRIVE_SUBDIRECTORY,  $DIRECTORY_LENGTH )"

                #Convert all iphone HEIC files to PNG so that they can be displayed in HTML
                myarray=$(find "$DRIVE_SUBDIRECTORY" -maxdepth 1 -name "*.HEIC" )
                if [ ${#myarray[@]} -gt 0 ]; then 
                    echo "Found HEIC file(s) in $DRIVE_SUBDIRECTORY, converting to PNG and optimizing image..."
                    mogrify -format png -resize 800 -rotate 90 -quality 25 "$DRIVE_SUBDIRECTORY"/*.HEIC #format as png
                    # mogrify -resize 800 -quality 50 *.png #resize all png files to 800px wide and reduce quality
                    mv "$DRIVE_SUBDIRECTORY"/*.HEIC "$DRIVE_ROOT"/x_trash # move all the .HEIC images to trash directory so we dont have to delete anything 
                else 
                    echo "No HEIC files found in $DRIVE_SUBDIRECTORY, skipping..."
                fi

                # Copy each directory from the DRIVE_ROOT to the static image directory 
                FROM="$DRIVE_SUBDIRECTORY"
                TO="$IMAGES_ROOT/$CURRENT_DIRECTORY_NAME"

                echo "COPY FROM: ( $FROM ), TO: ( $TO )"

                mkdir -p "$TO" #Create Directory
                cp -a "$FROM"/* "$TO" #Copy all friles in $FROM to $TO
            fi
        done

        touch "$DRIVE_ROOT/$BLOCKERFILE_NAME.txt"
    fi
else 
    echo "USB DRIVE is not mounted. Skipping..."
fi