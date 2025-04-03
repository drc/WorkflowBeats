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

## Resources

[https://docs.astro.build/en/guides/integrations-guide/cloudflare/](https://docs.astro.build/en/guides/integrations-guide/cloudflare/)
[https://www.servicenow.com/docs/bundle/xanadu-platform-security/page/administer/security/concept/c_OAuthAuthorizationCodeFlow.html](https://www.servicenow.com/docs/bundle/xanadu-platform-security/page/administer/security/concept/c_OAuthAuthorizationCodeFlow.html)
[https://dev.to/askrodney/astro-cookies-api-cookies-on-http-requests-4fn5](https://dev.to/askrodney/astro-cookies-api-cookies-on-http-requests-4fn5)
[https://blog.ohansemmanuel.com/working-with-astros-middleware/](https://blog.ohansemmanuel.com/working-with-astros-middleware/)
[https://github.com/understanding-astro/astro-middleware-examples/blob/master/jwt-auth/src/pages/protected.astro](https://github.com/understanding-astro/astro-middleware-examples/blob/master/jwt-auth/src/pages/protected.astro)
