#!/bin/bash

BASE_DIR=$(realpath .)

# Load shared functions
source supabase/shared_functions.sh

case $1 in
    "reset") supabase db reset;;
    "up")  SUPABASE_DB_URL=$TEST_DB_URL npm run db up;;
    "stop") supabase stop;;
    "start") start_supabase;;
    "status") supabase status;;
    "generate_env") generate_local_env>$2;;
    "generate_view_defs") generate_view_defs_from_local;;
    "generate_types") generate_types;;    
    *) echo -e "Invalid command, expected: \n- reset\n- up\n- stop\n- start\n- status"
esac