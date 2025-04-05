CREATE TABLE "cards" (
	"card_id" varchar(255) PRIMARY KEY NOT NULL,
	"name" varchar(255) NOT NULL,
	"image" jsonb NOT NULL,
	"sets" varchar(255)[] NOT NULL,
	"artists" varchar(255)[] NOT NULL,
	"rarities" varchar(255)[] NOT NULL,
	"classes" varchar(255)[] NOT NULL,
	"types" varchar(255)[] NOT NULL,
	"subtypes" varchar(255)[] NOT NULL,
	"legalHeroes" varchar(255)[] NOT NULL,
	"legalFormats" varchar(255)[] NOT NULL,
	"pitch" integer,
	"power" integer,
	"life" integer,
	"defense" integer,
	"cost" integer,
	"full_data" jsonb NOT NULL
);
