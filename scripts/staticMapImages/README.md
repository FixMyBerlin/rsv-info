Static map PNGs for teasers and social sharing. `bun run generate:map-images` (also part of `bun run trassenscout:sync`) writes `public/rsv-map-images/<slug>.png`.

Each PNG has a sidecar `<slug>.sha256`: SHA-256 of `v1` plus the MapTiler request URL with the API key stripped. That is the same URL the script would fetch (after the simplify loop). Unchanged inputs skip the MapTiler request. `fallback.png` / `fallback.sha256` cover Steckbriefe without geometry.
