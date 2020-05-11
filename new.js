const EventEmitter = require(‘events’);
const emitter = new EventEmitter();
emitter.on(‘myEvent’,  function() {
	console.log(‘first event emitter’);
	listenerFunction();
});
emitter.emit(‘firstEvent’);  // prints ‘first event emitter’
