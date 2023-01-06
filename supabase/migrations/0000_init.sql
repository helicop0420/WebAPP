CREATE TABLE IF NOT EXISTS public.migrations
(
    id integer primary key generated always as identity,
    name character varying(255) COLLATE pg_catalog."default" NOT NULL,
    created_at timestamp without time zone NOT NULL
)

TABLESPACE pg_default;

ALTER TABLE IF EXISTS public.migrations
    OWNER to postgres;

GRANT ALL ON TABLE public.migrations TO anon;

GRANT ALL ON TABLE public.migrations TO authenticated;

GRANT ALL ON TABLE public.migrations TO postgres;

GRANT ALL ON TABLE public.migrations TO service_role;

CREATE EXTENSION citext;
