#!/bin/bash
# simple installer: copy files to target directory (default /var/www/barber_prestige)
TARGET=${1:-/var/www/barber_prestige}
echo "Installing Barber PRESTIGE to $TARGET"
mkdir -p "$TARGET"
cp -r * "$TARGET"
echo "Installed. If running on a server, make sure to serve $TARGET over HTTP/HTTPS."
