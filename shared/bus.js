var events = require('events');
var util = require('util');

/**
 * Event Bus with API similar to EventEmitter.
 * @constructor
 */

function EventBus() {

    /**
     * Queue of event descriptor objects. Each event descriptor object has
     * the following structure: { event: event, handler: handler }
     *
     * New descriptors are enqueued to the end of array (using "push()") and
     * dequeued from the beginning of the array (using "shift()").
     *
     * @type {Array}
     */
    this.queue = [];

    /**
     * Current event descriptor in the queue that is currently in the processing state
     * @type {Object}
     */
    this.current = null;

    // Calling base constructor
    events.EventEmitter.call(this);
}

util.inherits(EventBus, events.EventEmitter);

/**
 * Subscribes handler "handler" to the event "eventName".
 *
 * If handler has two arguments, it will be assumed that this handler wants to participate in ordered chain
 * of execution of handlers. In this case handler MUST call "done" callback, otherwise the next handler will
 * never be called.
 *
 * If handler does not have two arguments, it will be processed in the same fashion as EventEmitter (without
 * ordering guaranties).
 *
 * Example:
 *
 *     bus.on('myevent', function(event) {
 *         // Will be called as soon as event received
 *     });
 *
 *     bus.on('myevent', function(event, done) {
 *        // Will be called only after all previous events were processed by "async" handlers.
 *
 *        // Don't forget to call "done" callback!
  *       done();
 *     });
 *
 * @param {String } eventName Name of event to subscribe to
 * @param {function(event)|function(event, done : function())} handler Handler that will be called
 *        when event will be received
 */
EventBus.prototype.on = function(eventName, handler) {
    var self = this;

    // Call "on" method of the "base class"
    events.EventEmitter.prototype.on.call(this, eventName, function eventHandler(event) {

        // If handler doesn't have arity of 2, call it immediately
        // It means that handler is synchronous or do not want to be ordered
        if (handler.length !== 2) {
            handler.call(this, event);
            return;
        }

        // Enqueue event descriptor to the queue
        self.queue.push({ event: event, handler: handler, eventName: eventName });

        // Process next event descriptor
        next.call(self);
    });

    //console.log("Listeners count for event " + eventName + ": ", events.EventEmitter.listenerCount(self, eventName));
};

/**
 * Factory method. Creates new EventBus (used only in tests)
 * @returns {EventBus}
 */
EventBus.prototype.create = function() {
    return new EventBus();
};

/**
 * Proceeds to the next message in the queue.
 * Should be called with implicit "this" argument (next.call(bus)).
 * @this {EventBus} Instance of EventBus
 */
function next() {
    var self = this;
    // If queue is empty, all events are processed.
    if (this.queue.length === 0){
      self.emit("bus:queue-empty", {});
      return;
    }


    // Peek event descriptor from the queue
    var item = this.queue[0];

    // If descriptor is currently processing (by some handler), stop.
    // We will wait until currently active handler will call "done()".
    if (item === this.current)
        return;

    // Remember descriptor that we are going to handle
    this.current = item;

    console.log("handing event:" + item.eventName + ". Data is: " + JSON.stringify(item.event));
    item.handler.call(this, item.event, function() {
        self.current = null;
        self.queue.shift(); // Dequeue event descriptor from the queue
        next.call(self);
    });
}

module.exports = new EventBus();
