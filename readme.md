# pid-from-port [![Build Status](https://travis-ci.org/kevva/pid-from-port.svg?branch=master)](https://travis-ci.org/kevva/pid-from-port)

> Get PID from a port


## Install

```
$ npm install pid-from-port
```


## Usage

```js
const pidFromPort = require('pid-from-port');

(async () => {
	try {
		console.log(await pidFromPort(8080));
		//=> 1337
	} catch (err) {
		console.log(err);
		//=> 'Couldn't find a process with port `8080`'
	}
})();
```


## API

### pidFromPort(port)

#### port

Type: `number`

Port to lookup.


## License

MIT © [Kevin Martensson](https://github.com/kevva)
