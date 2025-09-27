CREATE TABLE "xp" (
	"user" varchar(32) PRIMARY KEY NOT NULL,
	"guild" varchar(32) NOT NULL,
	"xp" integer DEFAULT 0 NOT NULL,
	"lvl" integer DEFAULT 0 NOT NULL
);
