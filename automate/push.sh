#!/bin/bash

# Save logs
date >> /tmp/NotesRun.out

# Notes
tommorow=$(date -v +1d +%d-%m-%Y)
cd ~/Documents/Git/Notes/Daily
touch "${tommorow}.md"

# Make commit
commit=$(date +%d-%m-%Y)
cd ~/Documents/Git/Notes
git add .
git -c commit.gpgsign=false commit -m "${commit}"
git push
