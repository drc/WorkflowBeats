# Workflow Beats

## Introduction

### 2025-04-02: Day 1

A week to learn anything I want? I decided to take on a project to explore various Cloudflare products. Cloudflare is a major player on the Internet alongside AWS. My current plan is to start with Cloudflare Workers to host a front end and an API that interacts with a few tools such as ServiceNow to handle authentication and Spotify to interact with the site. Over the next few days, I might explore other Cloudflare products, such as KV or Durable Objects, to manage the application's state and provide a small database.

---

End of day, I need to handle for

- [ ] Checking token expiration and refreshing for a new one when it expires, they don't need to reauthenticate, just need to refresh the current token.
- [ ] Handle post login, what do we do on the dashboard?
- [ ] think about spotify login, search box, what playlist to add to
- [ ] logout?

## Resources

[https://docs.astro.build/en/guides/integrations-guide/cloudflare/](https://docs.astro.build/en/guides/integrations-guide/cloudflare/)
[https://www.servicenow.com/docs/bundle/xanadu-platform-security/page/administer/security/concept/c_OAuthAuthorizationCodeFlow.html](https://www.servicenow.com/docs/bundle/xanadu-platform-security/page/administer/security/concept/c_OAuthAuthorizationCodeFlow.html)
[https://dev.to/askrodney/astro-cookies-api-cookies-on-http-requests-4fn5](https://dev.to/askrodney/astro-cookies-api-cookies-on-http-requests-4fn5)
[https://blog.ohansemmanuel.com/working-with-astros-middleware/](https://blog.ohansemmanuel.com/working-with-astros-middleware/)
