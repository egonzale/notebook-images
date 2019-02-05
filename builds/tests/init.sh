#!/bin/bash

# Change to default working directory
cd /home/jovyan/work/

# git reflog requires a name and email if user is not in passwd
# even if you're only cloning
export GIT_COMMITTER_NAME=anonymous
export GIT_COMMITTER_EMAIL=anon@localhost

# Clone notebooks to ~/work/notebooks
git clone https://github.com/thiippal/ENG-3072/

# Go to notebooks folder
# cd /home/jovyan/work/ENG-3072/

jupyter notebook --notebook-dir='/home/jovyan/work/ENG-3072/'
