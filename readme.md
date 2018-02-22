# get-pid [![Build Status](https://travis-ci.org/kevva/get-pid.svg?branch=master)](https://travis-ci.org/kevva/get-pid)

> Get PID from a port


## Install

```
$ npm install get-pid
```


## Usage

```js
const getPid = require('get-pid');

(async () => {
	try {
		console.log(await getPid(8080));
		//=> 1337
	} catch (err) {
		console.log(err);
		//=> 'Couldn't find a process with port `8080`'
	}
})();
```


## API

### getPid(port)

#### port

Type: `number`

Port to lookup.


## License

MIT © [Kevin Martensson](https://github.com/kevva)
