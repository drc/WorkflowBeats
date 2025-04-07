CREATE TABLE `playlist` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`song_data` text,
	`user` integer,
	FOREIGN KEY (`user`) REFERENCES `users`(`id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
CREATE UNIQUE INDEX `playlist_name_idx` ON `playlist` (`song_data`);--> statement-breakpoint
ALTER TABLE `users` ADD `avatar_url` text;