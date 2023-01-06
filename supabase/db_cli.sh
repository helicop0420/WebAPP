#!/bin/bash

BASE_DIR=$(realpath .)

# Load shared functions
source supabase/shared_functions.sh

case $1 in
    "commit") ./supabase/generate_migration.sh ${@:2};;
    "setup") remote_setup;;
    "up") npx ley up --dir "migrations/ley" ${@:2};;
    # "down") npx ley down --dir "migrations/ley" ${@:2};;
    "pull_remote_into_local") pull_remote_into_local;;
    "seed") generate_seed_data;;
    "local") ./supabase/db_local_cli.sh ${@:2};;
    *) echo -e "Invalid command, expected: \n- commit {name}\n- up [version]\n- down [version]\n- changes\n- reset\n- apply_remote"
esac