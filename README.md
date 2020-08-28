# ocvt-site

The Outdoor Club at Virginia Tech's (OCVT) front end for dolabra

## Supported Browsers

* Firefox
* Chrome
* IE11 (?, untested but compiled via babel)


## Configuration

### Environmental Variable

Created `ocvt-site.env` (copy `ocvt-site.env.sample`) with the following variables defined:
* `STRIPE_PUBLIC_KEY`: Public key from Stripe for payments
* `API_URL`: Api url of the dolabra backend. Note if using docker this should be the host's docker IP so that both the ocvt-site container and the browser can access it.

### Testing

* `yarn test`: Lints and compiles javascript
* `yarn build`: Build docker image
* `yarn up`: Start the server locally. If you've also modified the api you can use the `docker-compose.dev.yml` file from https://github/ocvt/docker to test the whole stack locally.

## TODO

* delete api photos account, put all that under webmaster

* deployment
  * do it
  * regular backups of sqlite to gdrive --> weekly ec2 snapshots
  * webtools/equipment
  * Inform the ATC of a new website
  * Properly redirect non https paths to http paths instead of only the root address
