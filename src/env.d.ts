type Runtime = import("@astrojs/cloudflare").Runtime<Env>;

declare namespace App {
	interface Locals extends Runtime {
		access_token: string;
		refresh_token: string;
		user_data: {
			id: number;
			name: string | null;
			sys_id: string;
			avatar_url: string | null;
		};
	}
}

interface UserData {
	user_name: string;
	user_display_name: string;
	user_initials: string;
	user_avatar: string;
	user_sys_id: string;
}

interface TokenResponse {
	access_token: string;
	refresh_token: string;
	scope: string;
	token_type: string;
	expires_in: number;
	expiry_date: number;
}

interface UserResponse {
	result: UserData;
}

interface SpotifyAuthResponse {
	access_token: string;
	token_type: string;
	expires_in: number;
}
