# ocvt-site

The Outdoor Club at Virginia Tech's (OCVT) front end for dolabra


## TODO

* trip signups + status + emails
* general trip admin actions
* payments
* Fix trip signup message if already on trip (or if owner?)
* Unsubscribe page
* Only load fetch polyfill if fetch does not exist
* Reduce General Announcements to single type id -> GENERAL ANNOUNCEMENTS
* Statically set API_URL in js files
* Add .then where possible if getting property from json
* Convert for to forEach where possible
* List attendance next to Full Details + admin link for leaders & officers
* Ensure all input is sanitized (signup notes, other free text fields)
* Allow officers to access /admin for any trips
* Validate trip input data
* Redirects for invalid trips or other data (Ex. return 404 instead of crashing)
* Showcase old OCVT data (ex. oldsite/gpx)
* Properly output message on js errors
* Validate browser support
* Validate HTML5 (ie td valign, etc)
* Validate trip form date & time string data
* Remove old css/html cruft (waiting to finish everything else)
* Properly handle API being down
* Cache photos from gdrive
* Performance analysis
* Accessibilty analysis
* Remove expressjs headers or other security stuff
* html / js linter
* handle network errors or bad data in client side fetches
* fix console errors
