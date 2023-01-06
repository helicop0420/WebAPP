# Elmbase: WebApp Repo

This repo houses the front-end application for Elmbase. It is a React-NextJS-TypeScript project, with Supabase backend.

## Getting Started

- Clone this repo
- `npm ci` to install all React dependencies (Installs dependencies as specified in package-lock.json, do `npm install` to update to version appropriate packages)
- Make sure that you have the following tools installed:
  - supabase cli
  - postgres cli (ex: `brew install postgresql`)
- Visit [supabase.com](https://supabase.com), sign in/up and create a new project.
- Once the project is setup, create an `env.local` file from `env.example`. Copy the following values to the file
  - `NEXT_PUBLIC_SUPABASE_URL` - (Project URL) Provided on the welcome screen after creating a project; Also available under `Settings>API`
  - `NEXT_PUBLIC_SUPABASE_KEY` - (`anon` `public`) Provided on the welcome screen after creating a project; Also available under `Settings>API`
  - `NEXT_SERVER_SUPABASE_KEY` - (`service role`) Provided on the welcome screen after creating a project; Also available under `Settings>API`
  - `SUPABASE_DB_URL` - Available under `Settings>Database` | Scroll to Connection String and select URI tab
- Go to SQL Editor tab in your Supabase remote instance. We will need to grant `postgres` user superuser priviledges (this is because making changes via the Supabase UI
  makes changes under the `supabase_admin` user, which is superuser, and supabase only gives us login capabilities for `postgres` user).

```
ALTER USER postgres WITH SUPERUSER;
```

- Run `npm run db setup`, which brings your remote Supabase instance up to date with all migrations.
- You'll then need to enable realtime in your remote Supabase instance (these changes aren't captured in migrations). To do this, navigate to your remote Supabase instance, click "Table Editor", click the context menu dropdown for the "notifications" table, "Edit Table", "Enable realtime", Save.
- `npm run dev` to start the local server, running at localhost:3000
- `npm run db seed` to add seed data to your remote env. You will need to add in some TEST_USER env vars first.
- Send your TEST_USER a magic link via the SupabaseUI. Right now, it's only possible for approved users to be able to login to the system. To approve a user, you need to send a Magic Link in the Supabase UI. It'll send an email link (it may take a few minutes), after clicking, you'll be able to login.
- Proceed to the next section to setup your development environment and understand the commands available to you.

## Development Setup and Available Commands

The development setup consists of a remote Supabase instance as well as a local Supabase instance (used for tests).

### IDE

- Required setup: VSCode, with extensions 1) Prettier 2) Github Copilot (Elmbase will pay for this, reach out to Ajay for details) 3) Tailwind extension for autocomplete (wip)
- Make sure you enable the following in your settings.json (from https://daveceddia.com/vscode-use-eslintrc):

```
  "editor.inlineSuggest.enabled": true,
  "editor.formatOnPaste": true,
  "editor.formatOnSave": true,
  "eslint.format.enable": true,
  "editor.codeActionsOnSave": {
    "source.fixAll.eslint": true
  },
  "editor.defaultFormatter": "esbenp.prettier-vscode",
```

### Supabase Local Instance

The local instance of supabase is only used for running tests and for generating migrations.

The following commands are available for the instance:

- `npm run db local start`: Starts local supabase instance and brings it up to date with migrations
- `npm run db local stop`: Stops local supabase instance and clears associated containers
- `npm run db local status`: Check status of supabase instance
- `npm run db local reset`: Resets your local Supabase instance, without running any migrations
- `npm run db local up`: Applies all migrations to your local Supabase instance

### Supabase Remote Instance

Only make schema changes and add in development data to your remote database instance.

The following commands are available for the database:

- `npm run db setup`: Need to run once at the beginning before running any other Supabase command; sets up the remote Supabase `migrations` table correctly.
- `npm run db commit {name}`: Creates a migration with the given name and updates the remote database to this migration
- `npm run db up [version]`: Migrate to a specific version or the latest
- `npm run db pull_remote_into_local`: Pulls the entire remote db and populates it into the local db
- `npm run db seed`: Runs seed scripts, populates the remote instance with data. Safe to re-run if needed, it doesn't clear out db, only upserts.

**NB** Do not use `supabase` commands directly, these won't handle database data and schema backup and restoration correctly

### Running Tests

Before running tests make sure you have `.env.test.local` file, you can create one from `.env.example` or by running `npm run db local generate_env .env.test.local`

Run `npm test` to run tests

IMPORTANT: Tests must be written in a way they can be parallelized. Meaning, all tests can run at the same time without interfering with one another.

### Sentry

We use Sentry for error monitoring. It's relevant for production, so local envs don't need to set this up.

For production environments, the `SENTRY_AUTH_TOKEN` needs to be set (or you need to have the auth token in .sentryclirc).

## Style Conventions

- no class based state management. ONLY HOOKS.
- Global state should be in [zustand](https://zustand-demo.pmnd.rs).

  Three benefits:

  1. Doesn't need to be passed down as props or wrap components in providers
  2. Abstracts away details of the state into a method, which is reusable
  3. You get clearer typing, and don't need to do null checks, and cleaner for IDE

  When using zustand avoid doing full state reads. e.g.

  ```js
  const state = useGlobalState();
  ```

  This will make the component update whenever any part of state is changed. Instead select individual states, e.g.:

  ```js
  const loading = useGlobalState((state) => state.loading);
  ```

  This provides atomic updates which means that the component is only updated when the value `loading` is updated

- prefer `interface` over `type` (https://stackoverflow.com/questions/37233735/interfaces-vs-types-in-typescript#:~:text=Relevant%20in%202021)
- useState vs useReducer: useReducer is usually preferable to useState when you have complex state logic that involves multiple sub-values or when the next state depends on the previous one (https://reactjs.org/docs/hooks-reference.html#usereducer)
- Component names in React must be capitalized (necessary so that the instance is not considered as DOM/HTML tags)
- Hooks are prefixed with “use” like useEffect, useSomething.
  - [linting plugin](https://www.npmjs.com/package/eslint-plugin-react-hooks) to enforce conventions
- no component inheritance hierarchies. Props and composition give you all the flexibility you need to customize a component’s look and behavior in an explicit and safe way. Remember that components may accept arbitrary props, including primitive values, React elements, or functions. https://reactjs.org/docs/composition-vs-inheritance.html
- use of React.FC is frowned upon for typing props for components. Better to explicitly write out children with React.Node. It's fine to use PropsWithChildren, but prefer against it. See: https://www.carlrippon.com/react-children-with-typescript/
- components should be defined as function expressions, NOT function declarations
- always add descriptive comments to your props using the TSDoc notation `/** comment */`

General resources

- React best practices: https://www.sitepoint.com/react-with-typescript-best-practices/
- TypeScript React: https://react-typescript-cheatsheet.netlify.app/docs/basic/getting-started/basic_type_example
- TypeScript: https://www.typescriptlang.org/docs/handbook/2/generics.html

### Naming Conventions

Please note the following naming conventions:

- PascalCase for interface, types, and components
- camelCase for variable names and function names

File naming conventions

- components: PascalCase
- non-components: (folders, modules, images, etc.): snake_case, unless it's grouped with a component in some way (ex: Button.test.tsx, Button.types.ts, etc)

### File Structure Conventions

File structure convention: https://next-with.moxy.tech/docs/welcome/conventions

Note: components are stored and imported using #3 strategy (having a Component.js and index.js) from: https://bradfrost.com/blog/post/this-or-that-component-names-index-js-or-component-js/

Good naming conventions:
https://github.com/airbnb/javascript/tree/master/react#naming

This repo is structured as follows:

```
├── package.json
├── package-lock.json
├── api
│   ├── modules (backend API modules go here)
├── migrations
├── pages
│   ├── api (provides API endpoints, logic can go directly in here, unlike for the other pages below)
│   │   ├── some_endpoint.ts
│   │   ├── some_endpoint.test.ts
│   │   ├── some_endpoint.data.ts
│   │   └── ...
│   ├── _app.tsx (provides App component)
│   ├── some_page.tsx (ONLY exports SomePage component from www/app/pages/some_page)
│   └── index.tsx (serves the index page "/")
│   └── ...
├── public (public assets, ex images, logos, favicons, etc., go here)
├── supabase
    └── generated (types that are shared across pages, as well as across frontend and API go here)
        ├── tables.ts (Supabase generated table types)
        └── views.sql (The SQL queries that back the DB views, dumped for convenience)
├── types
│   ├── tables.ts (Convenience typedefs for DB tables)
│   ├── views.ts (View defs, manually extended from generated types above to provide more detailed typing info)
└── www
    ├── app (exports App)
    ├── pages
    │   ├── some_page
    │   │   ├── index.tsx
    │   │   ├── SomePage.tsx
    │   │   ├── SomePage.types.ts (page specific types, ie not used in any other page, go alongside the page component)
    │   │   ├── SomePage.test.tsx
    │   │   ├── SomePage.fetchers.ts (where we put React Query fetchers, see a .fetchers file for example usage)
    │   │   ├── SomePage.data.ts
    │   │   ├── SomePage.module.css
    │   │   ├── some_page_subcomponent
    │   │   │   ├── index.tsx
    │   │   │   ├── SomePageSubcomponent.tsx
    │   │   │   ├── SomePageSubcomponent.types.ts
    │   │   │   ├── SomePageSubcomponent.test.tsx
    │   │   │   └── SomePageSubcomponent.module.css
    │   │   └── ...
    │   └── ...
    └── shared
        └── components (shared components, ie components used by more than 1 page, go here)
        │   ├── button
        │   │   ├── index.tsx
        │   │   ├── Button.tsx
        │   │   ├── Button.test.tsx
        │   │   └── Button.module.css
        │   ├── Card.tsx
        │   └── ...
        └── modules (for services shared across pages, for ex: supabase API, Zustand global context for state management, etc)
        │   ├── supabase.ts
        │   ├── global_context.ts
        │   ├── some_api.ts
        └── styles (global styles, shared across more than one component, go here)
        └── utils (for any utils / methods shared across components)
```

Notes:

.tsx vs .ts: if file uses JSX, use .tsx, otherwise use .ts

Database types are automatically generated from Supabase and accessible in types/tables.ts and types/views.ts (structure inspired by https://www.ziadmtl.dev/blog/using-supabase-with-typescript)

## Design and Styling

- We use Tailwind CSS for styling. We have a license for this. Please contact Ajay for login info.

- We use Figma for designs. The text styles and colors all map to Tailwind CSS defaults. So there shouldn't be any custom CSS, for the most part. If any element in Figma appears to be custom styling outside of Tailwind defaults, that may be an error, so please confirm with Ajay.

  - Clicking any element in Figma and looking at the property toolbar on the right, should be obvious how they map to Tailwind classes

- We use FontAwesome for icons. We have a license for this as well. Please contact Ajay for details.

  - In Figma, if you want to get the icon's React code snippet, simply click the icon, and check the framename on the left.

## Supabase

We leverage a near-backend-less setup. How? Thanks to Supabase!

The frontend can in many instances directly communicate with Supabase, without going through a NextJS backend api. This is secure because of row level security.

Combined with views and database triggers/functions, we can alleviate the need for a NextJS backend API almost entirely.

To understand how this works, and documentation on our backend (db tables, views, storage buckets, db functions/triggers), please see [./supabase/README.md](./supabase/README.md).

### Making Database Changes

1. Before making any changes to your remote database instance, first make sure you have the latest code and database migrations from `main`-- it'll make life a lot simpler for you!
2. Make whatever changes you want to the db to your remote Supabase instance, using the Supabase UI.
3. After you've made changes to the remote instance, we need to generate migration diff. Pull in the changes into your local instance, and run the diff tool to generate the migration files:
   `npm run db commit {migration file name (ex: add_users_table)}`
4. Inspect the generated migration file to ensure that it's correct and inclusive of all changes you made. You might have to reorder things.
   **NB** Important note: not all changes you make are captured via the Supabase CLI diffing tools. Ex: enabling realtime is not reflected, as well as authentication settings, any new buckets that were created, etc. For these changes, please note them in the PR, and remember to either manually edit the migration to include the change (for ex, for bucket changes, you can add the SQL that reflects the changes to the entries in the storage.buckets table), OR you must remember to manually make these changes in the production environment after the PR has been submitted.
5. If you removed/added any tables or views, you need to remove/add the type definition in types/tables.ts, as well as the db querying shortcuts in www/shared/modules/supabase.ts and api/modules/server_supabase.ts.
6. Raise a PR on these changes. The database changes should be submitted separately from the code that uses it. That way, we reduce the risk of breakages in production and everyone on the team is more likely to be working on the same version of the database schema.
7. After PR has been submitted, make any manual changes in the production environment that weren't captured by the diff tool.

Good practices:

- if there's removal or renaming of columns, take special care. basically, push the code changes first in a PR, deploy that,
  then in a separate PR add the migration to remove column or table.
- submit a PR for just the database changes, and then a follow up PR for the code that utilizes the new columns / tables.

### Removing Database Changes

Let's say you want to return back to a clean state, back to `main`, and undo changes you may have made to your remote instance.

1. Follow the instructions above to generate the migrations, as if you were to commit them.
2. Look at the generated "up" SQL file, and do the opposite to undo your changes.
3. You may need to make additional changes if there is anything that wasn't captured by the diff tool.
