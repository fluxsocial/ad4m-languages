#!/bin/bash
set -e

if ! nix-shell --help &> /dev/null
then
    echo "nix-shell could not be found! Are you sure it is installed correctly?"
    exit
fi

echo "Creating three releases of languages inside ./release"

[ ! -d "./release" ] && mkdir "./release"

echo "Create SDP expression release..."

#Get new dna.yaml with correct props & build language
cp ./hc-dna/workdir/dna.yaml ./hc-dna/workdir/dna_origin.yaml
cp ./sdp-expression/dna.yaml ./hc-dna/workdir/dna.yaml
cd sdp-expression
npm run build-nix

#Check if sdp directory exists, if not create
[ ! -d "./release/sdp" ] && mkdir "./release/sdp"

#Copy the build files to the release dir
cp ./build/bundle.js ./release/sdp/bundle.js
cp ./hc-dna/workdir/sdp.dna ./release/sdp/sdp.dna
mv ./hc-dna/workdir/dna_origin.yaml ./hc-dna/workdir/dna.yaml