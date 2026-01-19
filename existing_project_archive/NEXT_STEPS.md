# J2J Next Steps

- Consider Option B (static UI + AWS Lambda render API) to make the app stateless and robust.
- UI stays on GitHub Pages (or S3/CloudFront). Lambda handles `POST /render` with `{payload, template}`.
- CORS: allow GitHub Pages origin.
- SAM + AWS CLI for deploy; keep frontend simple and update via git push.
