// do not remove any of these, they are generally required by addon stores
export const MANIFEST_REQUIRED: Record<string, any> = {
  name: 'WebToEpub',
  version: '1.0.9.4',
  icons: {
    128: 'book128.png',
  },
};

// these are optional and should work on each target browser
export const MANIFEST_OPTIONAL = {
  default_locale: 'en',
  minimum_chrome_version: '120',
  permissions: [
    'cookies',
    'downloads',
    'declarativeNetRequest',
    'storage',
    'unlimitedStorage',
    //
  ],
};

// these are optional per browser keys
export const PER_BROWSER_MANIFEST_OPTIONAL = {
  chrome: {
    manifest_version: 3,
    action: {
      // chrome_style: false,
      default_title: '',
      default_icon: 'book128.png',
      default_popup: 'popup.html',
    },
    incognito: 'split', // firefox does not support split
    permissions: [
      'scripting',
      //
    ],
    host_permissions: [
      '<all_urls>',
      //
    ],
  },
  firefox: {
    manifest_version: 2,
    browser_action: {
      browser_style: false,
      default_title: '',
      default_icon: 'book128.png',
      default_popup: 'popup.html',
    },
    browser_specific_settings: {
      gecko: {
        id: 'WebToEpub@Baka-tsuki.org',
        strict_min_version: '115.0',
      },
    },
    permissions: [
      'webRequest',
      'webRequestBlocking',
      '<all_urls>',
      //
    ],
  },
};

// these are per browser keys for the final addon package
export const PER_BROWSER_MANIFEST_PACKAGE = {
  chrome: {
    // key: '',
  },
  firefox: {
    // browser_specific_settings: {
    //   gecko: {
    //     // https://extensionworkshop.com/documentation/develop/extensions-and-the-add-on-id/#when-do-you-need-an-add-on-id
    //     // All Manifest V3 extensions need an add-on ID in their manifest.json when submitted to AMO.
    //     // For Manifest V2 extensions, you need to add an add-on ID for certain situations.
    //     id: '',
    //   },
    // },
  },
};
