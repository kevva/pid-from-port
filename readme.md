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

		const pids = await pidFromPort.all([8080, 22]);

		console.log(pids.get(8080));
		//=> 1337

		console.log(pids.get(22));
		//=> 12345
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

### pidFromPort.all(ports)

Returns a `Promise<Map>` with the port as key and the PID as value.

#### ports

Type: `Array<number>`

Ports to lookup.

### pidFromPort.list()

Get all PIDs from ports.

Returns a `Promise<Map>` with the port as key and the PID as value.


## License

MIT © [Kevin Martensson](https://github.com/kevva)
