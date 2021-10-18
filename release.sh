#!/bin/bash
set -e

if ! nix-shell --help &> /dev/null
then
    echo "nix-shell could not be found! Are you sure it is installed correctly?"
    exit
fi

echo "Creating three releases of languages inside ./release"

[ ! -d "./release" ] && mkdir "./release"

################### SDP expression release ###################
echo "Create SDP expression release..."

# Get new dna.yaml with correct props & build language
[ ! -e "./hc-dna/workdir/dna_origin.yaml" ] && cp ./hc-dna/workdir/dna.yaml ./hc-dna/workdir/dna_origin.yaml
cp ./sdp-expression/dna.yaml ./hc-dna/workdir/dna.yaml
cd sdp-expression
npm install && npm run build-nix
cd ..

# Check if sdp directory exists, if not create
[ ! -d "./release/sdp" ] && mkdir -p "./release/sdp"

# Copy the build files to the release dir
cp ./sdp-expression/build/bundle.js ./release/sdp/bundle.js
cp ./hc-dna/workdir/sdp-expression.dna ./release/sdp/sdp-expression.dna

################### IceCandidate expression release ###################
echo "Create IceCandidate expression release..."

# Get new dna.yaml with correct props & build language
[ ! -e "./hc-dna/workdir/dna_origin.yaml" ] && cp ./hc-dna/workdir/dna.yaml ./hc-dna/workdir/dna_origin.yaml
cp ./icecandidate-expression/dna.yaml ./hc-dna/workdir/dna.yaml
cd icecandidate-expression
npm install && npm run build-nix
cd ..

# Check if icecandidate directory exists, if not create
[ ! -d "./release/icecandidate" ] && mkdir -p "./release/icecandidate"

# Copy the build files to the release dir
cp ./icecandidate-expression/build/bundle.js ./release/icecandidate/bundle.js
cp ./hc-dna/workdir/icecandidate-expression.dna ./release/icecandidate/icecandidate-expression.dna

################### ShortForm expression release begin ###################
echo "Create ShortForm expression release..."

# Get new dna.yaml with correct props & build language
[ ! -e "./hc-dna/workdir/dna_origin.yaml" ] && cp ./hc-dna/workdir/dna.yaml ./hc-dna/workdir/dna_origin.yaml
[ ! -e "./dna_origin.js" ] && cp ./dna.js ./dna_origin.js
cp ./shortform-expression/dna.yaml ./hc-dna/workdir/dna.yaml
cp ./shortform-expression/dna.js ./dna.js
npm install && npm run build-nix

# Check if shortform directory exists, if not create
[ ! -d "./release/shortform" ] && mkdir -p "./release/shortform"

# Copy the build files to the release dir
cp ./build/bundle.js ./release/shortform/bundle.js
cp ./hc-dna/workdir/shortform-expression.dna ./release/shortform/shortform-expression.dna

################### Group expression release begin ###################
echo "Create Group expression release..."

# Get new dna.yaml with correct props & build language
[ ! -e "./hc-dna/workdir/dna_origin.yaml" ] && cp ./hc-dna/workdir/dna.yaml ./hc-dna/workdir/dna_origin.yaml
[ ! -e "./dna_origin.js" ] && cp ./dna.js ./dna_origin.js
cp ./group-expression/dna.yaml ./hc-dna/workdir/dna.yaml
cp ./group-expression/dna.js ./dna.js
npm install && npm run build-nix

# Check if release/group directory exists, if not create one
[ ! -d "./release/group" ] && mkdir -p "./release/group"

# Copy the build files to the release dir
cp ./build/bundle.js ./release/group/bundle.js
cp ./hc-dna/workdir/group-expression.dna ./release/group/group-expression.dna

################### Finish release process, move original files back ###################
mv ./hc-dna/workdir/dna_origin.yaml ./hc-dna/workdir/dna.yaml
mv ./dna_origin.js ./dna.js