---
layout: "@/layouts/MarkdownLayout.astro"
title: "Roadmap"
author: "Dan Cigrang"
published: "2025-04-04"
---

List of items I want to accomplish

- Register users in a database after authorizing ServiceNow
- Create a user session and use that as a token for auth
  - This will help with storing keys in cookies
- Store the Auth/Refresh keys within another table in database tied to the user
- Send web request to my printer once someone picks a song from spotify
- Add the song to the database when someone picks a song from spotify
  - create an endpoint to handle the add/removal from the playlist
  - endpoint for handling voting, track how many votes a user has on their context record
