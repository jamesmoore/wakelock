# Wakelock

Browser based keep alive to prevent sleep mode. Derived from https://github.com/mdn/dom-examples/tree/main/screen-wake-lock-api

![image](https://github.com/user-attachments/assets/c5261a4a-13d9-4d40-956b-3332de24c9e6)

The wake lock will be maintained so long as the browser tab is 
* not covered by another maximized window
* not behind another browser tab (install as a PWA to avoid this)

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

Once the server is running you should be able to access it on port 80 by default, or whetaver you have mapped it to.

You can then run it as a PWA:

![image](https://github.com/user-attachments/assets/77a024b3-bbe4-43a6-99b1-03fb086d28e4)
