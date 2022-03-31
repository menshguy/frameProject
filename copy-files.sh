# SH SCRIPT:
# 1. Check if a file called DELETE_TO_UPDATE.txt is in the flashdrive

# 2. If yes, Skip this script

# 3. If no, copy all files from flashdrive into static/images directory.
#     a. Make sure you maintain the name of the Directories
#     b. Make sure you re-number the images 0 through X

# 4. Once Done, create a blank text file in the flashdrive named DELETE_TO_UPDATE.txt

# Bash If statments and file checks: 
#   https://linuxize.com/post/bash-check-if-file-exists/

DRIVE_NAME="Frame_Project_Pics"
#-- LOCAL --#
PROJECT_ROOT="/Users/jeffreyfenster/Documents/02_Personal/01_Projects/frame_project/local_development"
DRIVE_DIRECTORY="/Volumes/$DRIVE_NAME"
#-- RPi --#
# PROJECT_ROOT="/home/pie/Documents/frame_project_sockets"
# DRIVE_DIRECTORY="/media/pi/$DRIVE_NAME"

BLOCKERFILE_NAME="DELETE_ME_TO_UPDATE_IMAGES"
BLOCKERFILE=$DRIVE_DIRECTORY/"$BLOCKERFILE_NAME".txt

# Checks for the blocker file - we only want to copy files over if they are new/updated
if test -f "$BLOCKERFILE"; then
    echo "Blocker File Exists, skipping copy files..."
else
    echo "No Blocker File Exists, copying files from flashdrive..."

    # For each subdirectory in the flashdrive, copy all files to project directory
    for SUBDIRECTORY in "$DRIVE_DIRECTORY"/*; do
        #This if checks that $SUBDIRECTORY is a directory and a file
        if [ -d "$SUBDIRECTORY" ]; then
            DIRECTORY_LENGTH=$(find "$SUBDIRECTORY" -type f | wc -l)
            CURRENT_DIRECTORY_NAME=$( echo "$SUBDIRECTORY" | grep -oE "[^/]+$") #"/Volumes/Frame_Project_Pics/7_Home Owners" --> /7_Home Owners
            echo "DIRECTORY:" $DRIVE_DIRECTORY
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

    touch "$DRIVE_DIRECTORY/$BLOCKERFILE_NAME.txt"
fi
