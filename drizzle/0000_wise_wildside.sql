CREATE TABLE "poll_choices" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"poll_id" uuid NOT NULL,
	"key" text NOT NULL,
	"label_key" text,
	"order" integer NOT NULL
);
--> statement-breakpoint
CREATE TABLE "polls" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"slug" text NOT NULL,
	"status" text DEFAULT 'draft' NOT NULL,
	"created_at" timestamp with time zone DEFAULT now(),
	CONSTRAINT "polls_slug_unique" UNIQUE("slug")
);
--> statement-breakpoint
CREATE TABLE "regions" (
	"country_code" char(2) PRIMARY KEY NOT NULL,
	"name_en" text NOT NULL,
	"name_ru" text NOT NULL,
	"population" integer,
	"centroid_lat" text,
	"centroid_lng" text,
	"updated_at" timestamp with time zone DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE "scenario_regions" (
	"scenario_key" text NOT NULL,
	"country_code" char(2) NOT NULL
);
--> statement-breakpoint
CREATE TABLE "voter_sessions" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"user_id" uuid,
	"source" text NOT NULL,
	"fingerprint_hash" text,
	"created_at" timestamp with time zone DEFAULT now(),
	"last_seen_at" timestamp with time zone
);
--> statement-breakpoint
CREATE TABLE "votes" (
	"id" bigint PRIMARY KEY GENERATED ALWAYS AS IDENTITY (sequence name "votes_id_seq" INCREMENT BY 1 MINVALUE 1 MAXVALUE 9223372036854775807 START WITH 1 CACHE 1),
	"poll_id" uuid NOT NULL,
	"choice_id" uuid NOT NULL,
	"voter_session_id" uuid NOT NULL,
	"user_id" uuid,
	"source" text NOT NULL,
	"country_code" char(2),
	"locale" text,
	"ip_hash" text,
	"ua_hash" text,
	"created_at" timestamp with time zone DEFAULT now()
);
--> statement-breakpoint
ALTER TABLE "poll_choices" ADD CONSTRAINT "poll_choices_poll_id_polls_id_fk" FOREIGN KEY ("poll_id") REFERENCES "public"."polls"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "scenario_regions" ADD CONSTRAINT "scenario_regions_country_code_regions_country_code_fk" FOREIGN KEY ("country_code") REFERENCES "public"."regions"("country_code") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "votes" ADD CONSTRAINT "votes_poll_id_polls_id_fk" FOREIGN KEY ("poll_id") REFERENCES "public"."polls"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "votes" ADD CONSTRAINT "votes_choice_id_poll_choices_id_fk" FOREIGN KEY ("choice_id") REFERENCES "public"."poll_choices"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "votes" ADD CONSTRAINT "votes_voter_session_id_voter_sessions_id_fk" FOREIGN KEY ("voter_session_id") REFERENCES "public"."voter_sessions"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
CREATE UNIQUE INDEX "poll_choices_poll_key_uniq" ON "poll_choices" USING btree ("poll_id","key");--> statement-breakpoint
CREATE UNIQUE INDEX "scenario_regions_pk" ON "scenario_regions" USING btree ("scenario_key","country_code");--> statement-breakpoint
CREATE UNIQUE INDEX "votes_dummy_unique_workaround" ON "votes" USING btree ("id");