# BBViewer

> A video viewing application intended for Big Brother Live Feeders

## Prerequisites

### Windows Developers
```
# Install Windows build tools from an admin shell:
npm install --global --production windows-build-tools

# Install Bonjour SDK for Windows:
https://download.developer.apple.com/Developer_Tools/bonjour_sdk_for_windows_v3.0/bonjoursdksetup.exe
```

### Linux Developers
```
# Install avahi dns lib
sudo apt-get install libavahi-compat-libdnssd-dev
```

## Build Setup

``` bash
# install dependencies
npm install

# serve with hot reload at localhost:9080
npm run dev

# build electron application for production
npm run build

# run unit & end-to-end tests
npm test

# lint all JS/Vue component files in `src/`
npm run lint

```

---

This project was generated with [electron-vue](https://github.com/SimulatedGREG/electron-vue) using [vue-cli](https://github.com/vuejs/vue-cli). Documentation about the original structure can be found [here](https://simulatedgreg.gitbooks.io/electron-vue/content/index.html).
