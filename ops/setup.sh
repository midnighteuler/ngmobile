#!/bin/bash
export DPATH=`pwd`

# Retrieves and locally extracts nodejs binaries
# Set desired version in "node_version.sh"
source $DPATH/node_version.sh
export NODEENV=$DPATH/.nodejsenv/$NODEJS_PREFIX
export PATH=$DPATH/.nodejsenv/$NODEJS_PREFIX/bin:$PATH

mkdir -p .nodejsenv
cd .nodejsenv && wget $NODEJS_URL$NODEJS_PREFIX.tar.gz
tar xvzf $NODEJS_PREFIX.tar.gz

cd $DPATH && source init.sh && cd $DPATH
echo "---"
echo "Done! Installed nodejs at " $NODEENV
echo "Next time, just run 'source init.sh' in this directory."
echo "---"