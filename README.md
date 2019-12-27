# Destiny 2 nodecg bundle

This bundle is a sidebar and bottom panel component for streams to show semi-realtime Destiny 2 data while streaming.

## Requirements

* node 12
* [nodecg](https://github.com/nodecg/nodecg) 1.5.0 or later
* a [Bungie.net API application](https://www.bungie.net/en/Application)


## Installation

* Install nodecg
* Check this repository out into the bundles directory
* Run `npm install`, `npm build`, and `npm update-manifests`
* Create a configuration file
* Start nodecg


## Configuration

The configuration file is located at `{nodecg}/cfg/destiny2-nodecg-bundle.json` and has the following format:

```
{
    "apiKey": "abcd1234",      // your bungie.net API key goes here
    "apiMembershipType": 3,    // xbox - 1, psn - 2, steam - 3
    "apiMembershipId": 01234   // your membership ID goes here
}
```

Your Membership Type and ID can be found in the URL of your character's gear page on [bungie.net](https://www.bungie.net/en/Gear).

`https://www.bungie.net/en/Gear/{membershipType}/{membershipId}/{characterId}`

## Graphics

### Main

The "main" graphic is a fullscreen version of the bundle with a placeholder for the video feed. This is mostly intended for quickly debugging the entire scene in the browser.

Intended size: 1920x1080

### Sidebar

The "sidebar" graphic cycles through panels containing information about your guardian, your weapons, and your armor.

Intended size: 360x1080

### Bottom bar

The "bottombar" graphic shows your emblem, as well as a stream title and your current in-game activity.

Intended size: 146x1560

## Dashboard

The dashboard allows you to control the working parts of the bundle, including selecting a character, updating the stream text, and changing the sidebar pane and animation status.

# Development

## Build process

The dashboard is built primarily using a mix of Typescript, React, and Parcel. Since nodecg doesn't natively support Typescript, all the extension code must be compiled first.

It is seperated into the three major nodecg components: `dashboard`, `extension`, and `graphic`. These are all independent source directories that build from (for example) `dashboard-src/` into `dashboard/` which is the directory nodecg expects.

The dashboard and graphic components are both served as HTML, so we use Parcel to compile all of the HTML, JS, and CSS resources together in their target directories.

In the extension's case, it is pure Typescript. `extension-src/` builds into `extension-build/` because nodecg looks for `extension.js` or `extension/index.js` and so `extension/` stays empty, with `extension.js` instead being used to import the compiled typescript library from `extension-build/`.

The `npm run build` step performs a full build. During development, all of the `watch:*` steps can be run, and nodecg has to be restarted when extension code changes.

## Credit

[This dashboard](https://github.com/cheeplusplus/destiny2-nodecg-bundle) was designed by [Kauko](https://github.com/cheeplusplus) for use on their [Twitch channel](https://twitch.tv/kaukoplays).

The dashboard is licensed under MIT and started life from the [nodecg-react](https://github.com/mkrl/nodecg-react) template.
