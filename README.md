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
* See `launch.sh` for more functions

## TODO

* Run OWASP ZAP
* Test
* dolabra
  * Convert news to sqlite
  * start member ids @ 8000000
  * start trip ids @ 3000
  * Convert member sql data into sqlite table containing
    * email
    * first_name
    * last_name
    * cell_number
    * gender
    * birth_year
    * medical_cond
    * medical_cond_desc
    * paid_expire_datetime
    * active
    * emergency_name (OR "")
    * emergency_relationship (OR "")
    * emergency_number (OR "")
    * notification_preferences
    * ON REGISTRATION FORM: add option to "import from old site" using email
* Archive old trips & data for reference. Host old site at https://oldsite.ocvt.club + big warning saying it's old
* www.outdoor.org.vt.edu
  * Disable auth
  * Forward all requests to https://ocvt.club
* allow sending to quicksignup and/or members
