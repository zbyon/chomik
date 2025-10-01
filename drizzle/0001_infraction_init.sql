CREATE TABLE "infractions" (
	"id" varchar(32) PRIMARY KEY NOT NULL,
	"target" varchar(32) NOT NULL,
	"author" varchar(32) NOT NULL,
	"guild" varchar(32) NOT NULL,
	"reason" text,
	"time" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "infractions_id_unique" UNIQUE("id")
);
