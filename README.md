# ocvt-site

The Outdoor Club at Virginia Tech's (OCVT) front end for dolabra

## Supported Browsers

- Firefox
- Chrome
- IE11 (?, untested but compiled via babel)


## Configuration

### Environmental Variables

Created `ocvt-site.env` (copy `ocvt-site.env.sample`) with the following variables defined:
- `STRIPE_PUBLIC_KEY`: Public key from Stripe for payments
- `API_URL`: Api url of the dolabra backend. Note if using docker this should be the host's docker IP so that both the ocvt-site container and the browser can access it.
- `MIGRATE_ENABLED`: Determines if migration form should be shown on registration page. Set to be non-empty to enable.

### Testing

- `./launch test`: Lints javascript
- `./launch build`: Compiles javascript and builds `ocvt/ocvt-site:latest` docker image
- See `launch.sh` for more functions
