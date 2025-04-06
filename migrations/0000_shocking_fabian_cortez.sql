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
CREATE TABLE `sessions` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`user_id` integer,
	`session_token` text,
	`expires` integer,
	FOREIGN KEY (`user_id`) REFERENCES `users`(`id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
CREATE INDEX `session_user_idx` ON `sessions` (`user_id`);--> statement-breakpoint
CREATE UNIQUE INDEX `session_session_token_idx` ON `sessions` (`session_token`);--> statement-breakpoint
CREATE TABLE `users` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`name` text,
	`sys_id` text NOT NULL
);
--> statement-breakpoint
CREATE UNIQUE INDEX `user_sys_id_idx` ON `users` (`sys_id`);