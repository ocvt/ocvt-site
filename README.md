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

### Testing

- `./launch test`: Lints javascript
- `./launch build`: Compiles javascript and builds `ocvt/ocvt-site:latest` docker image
- See `launch.sh` for more functions

## TODO

- Start new site
- Migrate old data
- Test with officers
- www.outdoor.org.vt.edu
  - Disable auth
  - Forward all requests to https://ocvt.club

- Future Improvements
  - List news author under title
  - Figure out how SES treats invalid emails
  - Fix google drive rate limiting
  - /webtools/equipment: Allow inputting inventory ID and deleting item
  - Default HTML error pages
