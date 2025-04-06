ALTER TABLE `users` RENAME COLUMN "email" TO "sys_id";--> statement-breakpoint
CREATE TABLE `connections` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`user_id` integer,
	`access_token` text,
	`refresh_token` text,
	`expires_in` integer,
	`provider` text,
	FOREIGN KEY (`user_id`) REFERENCES `users`(`id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
CREATE INDEX `conn_user_idx` ON `connections` (`user_id`);--> statement-breakpoint
CREATE INDEX `conn_provider_idx` ON `connections` (`provider`);--> statement-breakpoint
DROP INDEX `email_idx`;--> statement-breakpoint
CREATE UNIQUE INDEX `user_sys_id_idx` ON `users` (`sys_id`);--> statement-breakpoint
DROP INDEX `userId_idx`;--> statement-breakpoint
DROP INDEX `sessionToken_idx`;--> statement-breakpoint
CREATE INDEX `session_user_idx` ON `sessions` (`user_id`);--> statement-breakpoint
CREATE UNIQUE INDEX `session_session_token_idx` ON `sessions` (`session_token`);