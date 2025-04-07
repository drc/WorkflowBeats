PRAGMA foreign_keys=OFF;--> statement-breakpoint
CREATE TABLE `__new_connections` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`user_id` integer,
	`access_token` text,
	`refresh_token` text,
	`expires_in` integer,
	`provider` text,
	FOREIGN KEY (`user_id`) REFERENCES `users`(`id`) ON UPDATE no action ON DELETE cascade
);
--> statement-breakpoint
INSERT INTO `__new_connections`("id", "user_id", "access_token", "refresh_token", "expires_in", "provider") SELECT "id", "user_id", "access_token", "refresh_token", "expires_in", "provider" FROM `connections`;--> statement-breakpoint
DROP TABLE `connections`;--> statement-breakpoint
ALTER TABLE `__new_connections` RENAME TO `connections`;--> statement-breakpoint
PRAGMA foreign_keys=ON;--> statement-breakpoint
CREATE INDEX `conn_user_idx` ON `connections` (`user_id`);--> statement-breakpoint
CREATE INDEX `conn_provider_idx` ON `connections` (`provider`);--> statement-breakpoint
CREATE TABLE `__new_playlist` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`song_data` text,
	`user` integer,
	FOREIGN KEY (`user`) REFERENCES `users`(`id`) ON UPDATE no action ON DELETE cascade
);
--> statement-breakpoint
INSERT INTO `__new_playlist`("id", "song_data", "user") SELECT "id", "song_data", "user" FROM `playlist`;--> statement-breakpoint
DROP TABLE `playlist`;--> statement-breakpoint
ALTER TABLE `__new_playlist` RENAME TO `playlist`;--> statement-breakpoint
CREATE UNIQUE INDEX `playlist_name_idx` ON `playlist` (`song_data`);--> statement-breakpoint
CREATE TABLE `__new_sessions` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`user_id` integer,
	`session_token` text,
	`expires` integer,
	FOREIGN KEY (`user_id`) REFERENCES `users`(`id`) ON UPDATE no action ON DELETE cascade
);
--> statement-breakpoint
INSERT INTO `__new_sessions`("id", "user_id", "session_token", "expires") SELECT "id", "user_id", "session_token", "expires" FROM `sessions`;--> statement-breakpoint
DROP TABLE `sessions`;--> statement-breakpoint
ALTER TABLE `__new_sessions` RENAME TO `sessions`;--> statement-breakpoint
CREATE INDEX `session_user_idx` ON `sessions` (`user_id`);--> statement-breakpoint
CREATE UNIQUE INDEX `session_session_token_idx` ON `sessions` (`session_token`);