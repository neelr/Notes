#!/bin/bash

commit=$(date +'%m-%d-%Y')
cd ~/Documents/Git/Notes
git add .
git commit -m "${commit}"
git push