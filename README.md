# HyperTube Music website

The website of [HyperTube Music](https://github.com/hyper-tube/app), a native YouTube Music app for Desktop.

## Getting started

```sh
pnpm install
pnpm dev      # http://localhost:20099
```

The site runs without configuration. Copy `.env.example` to `.env` to change anything.

| Variable                  | Default                | Purpose                                                  |
| ------------------------- | ---------------------- | -------------------------------------------------------- |
| `PORT`                    | `20099`                | Port the server listens on                               |
| `LOG_LEVEL`               | `debug` in dev, `info` | Logger verbosity                                         |
| `SITE_URL`                | origin of the request  | Public origin for canonical links, social cards etc.     |
| `GITHUB_REPOSITORY`       | `hyper-tube/app`       | Repository releases and stars are read from              |
| `GITHUB_TOKEN`            | none                   | Raises the rate limit; required for a private repository |
| `GITHUB_CACHE_TTL`        | `600`                  | Seconds GitHub responses stay fresh                      |
| `GITHUB_RELEASES_FIXTURE` | none                   | Dev-only: read releases from a local JSON file           |

## Scripts

| Script           | What it does                                                    |
| ---------------- | --------------------------------------------------------------- |
| `pnpm dev`       | Dev server with Vite middleware and HMR                         |
| `pnpm build`     | `react-router build` + the compiled Express server into `dist/` |
| `pnpm start`     | Runs the production build                                       |
| `pnpm typecheck` | Route typegen followed by `tsc`                                 |
| `pnpm lint`      | ESLint (`pnpm lint:fix` to autofix)                             |
| `pnpm format`    | Prettier write (`pnpm format:check` in CI)                      |
| `pnpm palette`   | Regenerates the colour scheme from the app's seed colour        |

## Endpoints

| Path                       | Purpose                                                          |
| -------------------------- | ---------------------------------------------------------------- |
| `/download/latest/:format` | Redirects to the newest `exe`, `dmg`, `appimage`, `deb` or `rpm` |
| `/api/releases/latest`     | The latest release and its files as JSON                         |
| `/api/health`              | Health check                                                     |

## Production

```sh
docker build -t ht-website .
docker run --init -p 20099:20099 -e GITHUB_TOKEN=... ht-website
```

The container takes the same variables as the dev server.

## License

This project is licensed under the GNU General Public License v3.0. See [LICENSE](LICENSE) for details.
