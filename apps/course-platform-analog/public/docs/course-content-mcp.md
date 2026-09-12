# Angular Course Content MCP Server

The course portal exposes a read-only Model Context Protocol (MCP) endpoint at
`/api/mcp`. It lets an authenticated student use an MCP client such as ChatGPT
or Claude Code to list courses, inspect outlines, search stored course content,
and read a lesson together with its Vimeo transcript.

## Available tools

- `list_courses` lists courses available through the portal.
- `get_course_outline` returns sections, lessons, and lesson resources.
- `search_course_content` searches stored course, section, lesson, and resource
  metadata. It intentionally does not download every Vimeo transcript.
- `get_lesson_content` returns one lesson and downloads its selected Vimeo text
  track, capped at 100,000 characters per call.

All tools are read-only. Every MCP request requires a valid access token for an
existing Supabase user, matching the portal's current authorization model.

## Deployment setup

1. In Supabase, enable **Authentication > OAuth Server**.
2. Set the authorization path to `/oauth/consent` and require user approval.
3. Enable dynamic client registration for clients such as ChatGPT and Claude
   Code, or register each client and its exact callback URL manually.
4. Prefer an asymmetric Supabase JWT signing key (RS256 or ES256).
5. Configure `VIMEO_ACCESS_TOKEN` in the deployment with a personal token owned
   by the account that owns the course videos. Vimeo requires an owner token to
   access transcript text tracks.
6. Optionally set `MCP_RESOURCE_URL` to the exact stable production endpoint,
   such as `https://app.example.com/api/mcp`. When this is set, configure a
   Supabase custom access-token hook so OAuth tokens use that exact URL in their
   `aud` or `resource` claim; the MCP server then enforces the audience.

Preview deployments can omit `MCP_RESOURCE_URL`. Their resource identifier is
derived from the incoming host, while the token is still verified with
Supabase before any tool is listed or called.

OAuth protected-resource metadata is available at both:

- `/.well-known/oauth-protected-resource`
- `/.well-known/oauth-protected-resource/api/mcp`

## Connect Claude Code

```sh
claude mcp add --transport http angular-course https://app.example.com/api/mcp
```

Then run `/mcp` in Claude Code and complete the browser authorization flow.

## Connect ChatGPT

In ChatGPT developer mode, create a custom app/connector with the MCP server URL
`https://app.example.com/api/mcp`. ChatGPT discovers the Supabase OAuth server,
opens the course portal consent screen, and stores the resulting OAuth tokens.

Use the production hostname for students. Use a preview hostname only for
testing, and keep preview OAuth clients and callback URLs separate when they are
registered manually.
