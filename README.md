# Dev Reverse Proxy
This tool is a reverse proxy for routing between local file and remote file. the rule is simple, read from localPath when you don't want to read from remotePath.
## Config
Edit config.json. attribute names are pretty self explanatory.
- remoteServerURL: remote server url
- localfileMapping: localPath to read from when you want to intercept reading from remotePath
- proxyServerPort: the port you are going to use as gateway.

## Usage
for the 1st time
`npm install`
To start Server
`node index.js`
now your proxy is running at "https://localhost:5050" by default, open the url with browser.

## Trouble Shooting
### How to tell if the content is served from remote or local?
1. check the command line output, it will log every request through it. the one served from local will log as "read from local file server"
2. check network from browser's developer tool, find the request, see the response header's value of "gateway-org", the value would be either "local" or "remote"

### TBD

## Features to be added
1. har file playback