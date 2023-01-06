TEST_DB_URL="postgresql://postgres:postgres@localhost:54322/postgres"

link_migration_files(){
  # Switch to migrations dir to get fileame without extra path
  cd $BASE_DIR/migrations/up
  for filename in *.sql; do
    if [ ! -L "$BASE_DIR/supabase/migrations/$filename" ]; then    
      ln -s $BASE_DIR/migrations/up/$filename $BASE_DIR/supabase/migrations/$filename
    fi
  done
  cd $BASE_DIR
}

delink_migration_files(){
  cd $BASE_DIR/migrations/up
  for filename in *.sql; do
    if [ -L "$BASE_DIR/supabase/migrations/$filename" ]; then    
      rm $BASE_DIR/supabase/migrations/$filename
    fi
  done
  cd $BASE_DIR
}


start_supabase(){
    CURRENT_STATUS="$(supabase status)"
    INACTIVE_STATUS="supabase local development setup is not running."
    if [ "$CURRENT_STATUS" != "$INACTIVE_STATUS" ]; then
        supabase status
        return
    fi

    # Linking migration files here, `supabase start` setus up the db on every start
    # We're manually linking instead of running migrations because after running migrations
    # The backup file fails to load due to identity fields being already filled
    supabase start
    SUPABASE_DB_URL=$TEST_DB_URL npm run db up
}


pull_remote_into_local(){
  # Start supabase if not already running
  start_supabase
  supabase db reset

  # Load env
  export $(cat .env.local | xargs)
  
  echo "Fetching remote schema (not the data)..."
  pg_dump --if-exists --clean --schema=public --schema-only $SUPABASE_DB_URL > migrations/remote.sql
  
  echo "Applying remote schema..."
  psql -f migrations/remote.sql $TEST_DB_URL
}

remote_setup(){
    # Source env to get the SUPABASE_DB_URL
    export $(cat .env.local | xargs)

    # Push the 0000_init.sql migration to the remote database.
    # This pushes `migrations` table to the remote database (needed because the one ley autogenerates uses an "identity" column that the schema diff util doesn't like)
    # This is the single only migration that will be applied via supabase. Every other migration will be applied via ley.
    supabase db remote set $SUPABASE_DB_URL
    supabase db push

    # Then, brings database up to date using ley
    npm run db up
}

generate_local_env(){
  echo "NEXT_PUBLIC_SUPABASE_KEY=$(npm run db local start | grep anon | sed -e 's/^[[:space:]]*anon key: //')"
  echo "NEXT_PUBLIC_SUPABASE_URL=$(npm run db local start | grep API | sed -e 's/^[[:space:]]*API URL: //')"
  echo "NEXT_SERVER_SUPABASE_KEY=$(npm run db local start | grep service_role | sed -e 's/^[[:space:]]*service_role key: //')"
}

generate_types(){
  supabase gen types typescript --local  > supabase/generated/types.ts
}

generate_view_defs_from_local(){
  VIEWS_SQL_FILE="supabase/generated/views.sql"
  # pg_dump --schema-only --table '*_view' --no-privileges --no-owner $TEST_DB_URL > $VIEWS_SQL_FILE.tmp

  # # Filter out the comments and the SET comments
  # sed -n -e '/-- Name: */,$p' $VIEWS_SQL_FILE.tmp | npx sql-formatter > $VIEWS_SQL_FILE
  # rm $VIEWS_SQL_FILE.tmp

  psql $TEST_DB_URL -c "SELECT table_name as view, pg_get_viewdef(table_name, true) as query FROM information_schema.views WHERE table_schema = 'public'" > $VIEWS_SQL_FILE
}

generate_seed_data() {
  export $(cat .env.local | xargs)
  tsx supabase/seed/populate_seed_data.ts
}