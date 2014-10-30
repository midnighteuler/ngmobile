#!/bin/sh
export DPATH=`pwd`
export SRCDIR=`cd ../src && pwd`

# Set up paths
source $DPATH/node_version.sh
export NODEENV=$DPATH/.nodejsenv/$NODEJS_PREFIX
export PATH=$DPATH/.nodejsenv/$NODEJS_PREFIX/bin:$PATH

# Put cache for installation riff raff from node package manager here.
npm config set cache $DPATH/.npm

# Process package.json and install what we need
npm install

# Add environment paths for the command-line tools we need
# grunt, karma, bower, ionic, cordova
export PATH=`pwd`/node_modules/grunt-cli/bin:$PATH
export PATH=`pwd`/node_modules/karma/bin:$PATH
export PATH=`pwd`/node_modules/bower/bin:$PATH
export PATH=`pwd`/node_modules/ionic/bin:$PATH
export PATH=`pwd`/node_modules/cordova/bin:$PATH

# Use bower to fetch the javascript packages we need as defined in bower.json
# Note that .bowerrc is used such that the resulting libs live in src/app/lib
bower install

echo "Initialized frontend."
echo "Paths set:"
echo "  Nodejs: " `which node`
echo "  Node package manager: " `which npm`
echo "  Grunt: " `which grunt`
echo "  Bower: " `which bower`
echo "  Karma: " `which karma`
echo "  Ionic: " `which ionic`
echo "  Cordova: " `which cordova`
echo ""
echo "SRCDIR: " $SRCDIR
echo "---"