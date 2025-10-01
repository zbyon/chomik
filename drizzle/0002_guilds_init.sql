CREATE TABLE "guilds" (
	"guild" varchar(32) PRIMARY KEY NOT NULL,
	"alertChannel" varchar(32),
	"publicAlertChannel" varchar(32),
	CONSTRAINT "guilds_guild_unique" UNIQUE("guild")
);
