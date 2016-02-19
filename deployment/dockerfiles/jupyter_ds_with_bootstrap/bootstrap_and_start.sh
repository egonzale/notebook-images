#!/bin/bash

if [ ! -z "$BOOTSTRAP_URL" ]; then
    su $NB_USER -c "wget $BOOTSTRAP_URL"
    filename=$(basename $BOOTSTRAP_URL)
    case $filename in
        *.bash|*.sh)
            /usr/bin/bash $filename
        ;;
    esac
fi

exec /usr/bin/start-notebook.sh