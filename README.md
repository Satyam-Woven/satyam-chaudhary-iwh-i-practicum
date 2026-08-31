# Satyam Chaudhary - Integrating With HubSpot I Practicum

This repository is for the HubSpot Academy Integrating With HubSpot I: Foundations practicum.

## Custom Object List View

https://app.hubspot.com/contacts/51950337/objects/2-68435432/views/all/list

## HubSpot custom object

Custom object: Marvel Characters

Properties used by this app:

- Name (`name`) - single-line text
- Bio (`bio`) - single-line or multi-line text
- Power (`power`) - number

The Marvel Characters custom object is associated with Contacts in the HubSpot test account.

## App functionality

- The homepage (`/`) retrieves Marvel Character records from HubSpot and displays them in a table.
- The form route (`/update-cobj`) displays a Pug form for creating a new Marvel Character record.
- The POST route (`/update-cobj`) sends the form data to HubSpot with Axios and redirects back to the homepage after the record is created.

## Verification

The app has been tested locally with the HubSpot service key against the Marvel Characters custom object. The homepage loads records from HubSpot, and the `/update-cobj` form creates new Marvel Character records through the HubSpot API.

## Local setup

1. Copy `.env.example` to `.env`.
2. Add your HubSpot private app or service key token as `HUBSPOT_PRIVATE_APP_ACCESS_TOKEN`.
3. Confirm the Marvel Character custom object ID is set as `HUBSPOT_CUSTOM_OBJECT_TYPE=2-68435432`.
4. Run `npm install`.
5. Run `npm start`.
6. Open `http://localhost:3000`.

Do not commit your `.env` file or HubSpot access token.
