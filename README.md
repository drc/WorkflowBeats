# Workflow Beats

## Introduction

### 2025-04-02: Day 1

A week to learn anything I want? I decided to take on a project to explore various Cloudflare products. Cloudflare is a major player on the Internet alongside AWS. My current plan is to start with Cloudflare Workers to host a front end and an API that interacts with a few tools such as ServiceNow to handle authentication and Spotify to interact with the site. Over the next few days, I might explore other Cloudflare products, such as KV or Durable Objects, to manage the application's state and provide a small database.

---

End of day, I need to handle for

- [x] Checking token expiration and refreshing for a new one when it expires, they don't need to reauthenticate, just need to refresh the current token.
- [ ] Handle post login, what do we do on the dashboard?
- [ ] think about spotify login, search box, what playlist to add to
- [ ] logout?

### 2025-04-03: Day 2

I successfully implemented logins yesterday and set up token storage for automatic refreshing. While the current method of storing refresh tokens isn't secure, it's something I'll revisit later to ensure safe storage. Currently, ServiceNow access tokens expire after 5 minutes, but the site automatically refreshes them. The refresh tokens remain valid for 30 days, so I'll need to consider how to handle this securely in the future. For now, I'll shift my focus to designing the front page UI, dashboard UI, and login page/buttons.

### 2025-04-04: Day 3

I was able to complete the Spotify connection and use a Svelte component to search and return results. I will have to create methods to accept the selected song, apply it to the database. I also want to send it to my printer and have it print some songs for the demo.

### 2025-04-05: Day 3.25

I'm excited to work on this more on the weekend to get some things done before demo on Tuesday. I am setting up a Cloudflare D1 database to store information regarding new users and sessions, and moving the auth tokens and storage to the database, validating only the session ID.

I'm in a good place getting the user session created and saving a user account. I need to update the middleware first to handle how a session is validated and extended. This is a [great resource](https://github.com/ksjitendra18/astro-js-auth-oauth-passwordless-credentials/tree/main/src/pages) for learning how to do this.

Ran out of `ngrok` requests so I had to move to cloudflare tunnels, I created some config file locally to track my work. this command runs the tunnel:

```cloudflared tunnel --config ./cloudflare-config.yml run development```

paired with this running the dev server:

```pnpm run dev```

the database admin interface, uses a dev.drizzle.config.ts file rather than the d1-http default config:

```pnpm run db:studio```

#### Database

Generate the sql from schema.ts file:

`pnpm run db:generate`

For generating and updating the local database:

`pnpm run db:migrate`

To generate and update the remote database:

`pnpm exec drizzle-kit push`

Generate empty migration files to seed data

`drizzle-kit generate --custom --name=<file_name>`

```sql
-- ./drizzle/0001_seed-users.sql

INSERT INTO "users" ("name") VALUES('Dan');
INSERT INTO "users" ("name") VALUES('Andrew');
INSERT INTO "users" ("name") VALUES('Dandrew');
```

## Resources

- [https://docs.astro.build/en/guides/integrations-guide/cloudflare/](https://docs.astro.build/en/guides/integrations-guide/cloudflare/)
- [https://www.servicenow.com/docs/bundle/xanadu-platform-security/page/administer/security/concept/c_OAuthAuthorizationCodeFlow.html](https://www.servicenow.com/docs/bundle/xanadu-platform-security/page/administer/security/concept/c_OAuthAuthorizationCodeFlow.html)
- [https://dev.to/askrodney/astro-cookies-api-cookies-on-http-requests-4fn5](https://dev.to/askrodney/astro-cookies-api-cookies-on-http-requests-4fn5)
- [https://blog.ohansemmanuel.com/working-with-astros-middleware/](https://blog.ohansemmanuel.com/working-with-astros-middleware/)
- [https://github.com/understanding-astro/astro-middleware-examples/blob/master/jwt-auth/src/pages/protected.astro](https://github.com/understanding-astro/astro-middleware-examples/blob/master/jwt-auth/src/pages/protected.astro)
- [https://dev.to/flashblaze/using-cloudflare-durable-objects-with-sql-storage-d1-and-drizzle-orm-2i3i](https://dev.to/flashblaze/using-cloudflare-durable-objects-with-sql-storage-d1-and-drizzle-orm-2i3i)
