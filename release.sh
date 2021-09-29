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
[ ! -e "./hc-dna/workdir/dna_origin.yaml" ] && cp ./hc-dna/workdir/dna.yaml ./hc-dna/workdir/dna_origin.yaml
cp ./sdp-expression/dna.yaml ./hc-dna/workdir/dna.yaml
cd sdp-expression
npm install && npm run build-nix
cd ..

#Check if sdp directory exists, if not create
[ ! -d "./release/sdp" ] && mkdir -p "./release/sdp"

#Copy the build files to the release dir
cp ./sdp-expression/build/bundle.js ./release/sdp/bundle.js
cp ./hc-dna/workdir/sdp-expression.dna ./release/sdp/sdp-expression.dna

mv ./hc-dna/workdir/dna_origin.yaml ./hc-dna/workdir/dna.yaml