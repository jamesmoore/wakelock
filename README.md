# Wakelock

Browser based keep alive to prevent sleep mode. Derived from https://github.com/mdn/dom-examples/tree/main/screen-wake-lock-api

![image](https://github.com/user-attachments/assets/c5261a4a-13d9-4d40-956b-3332de24c9e6)

# Usage
Docker compose:
```
services:
  wakelock:
    image: ghcr.io/jamesmoore/wakelock:main
    restart: unless-stopped
    labels:
# traefik reverse proxy (optional)
      - traefik.http.services.wakelock.loadbalancer.server.port=80
      - traefik.http.routers.wakelock.rule=Host(`wakelock.$DOMAIN`)
      - traefik.http.routers.wakelock.tls=true
      - traefik.http.routers.wakelock.entrypoints=websecure
# run as non-root user (optional)
    user: 555:555
```
