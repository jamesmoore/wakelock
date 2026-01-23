# Wakelock

Browser based keep alive to prevent sleep mode. Derived from https://github.com/mdn/dom-examples/tree/main/screen-wake-lock-api

<img width="502" height="460" alt="image" src="https://github.com/user-attachments/assets/26d51166-2584-42e7-9ce4-86720fbbdd22" />

The wake lock will be maintained so long as the browser tab is 
* not covered by another maximized window
* not behind another browser tab (install as a PWA to avoid this)

# Usage
Docker compose:
```yaml
services:
  wakelock:
    image: ghcr.io/jamesmoore/wakelock:main
    restart: unless-stopped
    ports:
      - 80:80
```

Once the server is running you should be able to access it on port 80 by default, or whetaver you have mapped it to.

# Reverse proxy
You can also run it behind a reverse proxy like Traefik, Caddy or Nginx. Here is a Traefik example with labels:

```yaml
services:
  wakelock:
    image: ghcr.io/jamesmoore/wakelock:main
    restart: unless-stopped
    labels:
      - traefik.http.services.wakelock.loadbalancer.server.port=80
      - traefik.http.routers.wakelock.rule=Host(`wakelock.$DOMAIN`)
      - traefik.http.routers.wakelock.tls=true
      - traefik.http.routers.wakelock.entrypoints=websecure
```

# Permissions
This container does not require any special privileges. You can run it as a non-root user:

```yaml
services:
  wakelock:
    image: ghcr.io/jamesmoore/wakelock:main
    restart: unless-stopped
# run as non-root user (optional)
    user: 555:555
```
