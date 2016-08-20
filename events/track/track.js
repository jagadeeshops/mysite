var events = require('events');
var eventEmitter = new events.EventEmitter();
var trackRequests = require(__schemas + 'trackRequests')

//replcae this overall count with redis
global.allReqCount = 0;
global.uniqueHostCount = 0;
//once the above value is moved to redis, we dont need to keep a delay and read frpm Db.
//we can directly read from redis
// var lastUpdatedTime = new Date();

var getInitialReqCount = function getInitialReqCount() {
  var groupQuery ={
    $group: {
      _id: null,
      allRequestsCount: { $sum: "$requests"}        
    }    
  }
  trackRequests.aggregate([ groupQuery ] , function trackRequests(err, data) {
    if (err) {
      console.error(Date() + " unable to get overall count")
    }
    else {
      if ( data.length > 0 && data[0]) {
        console.log(data[0].allRequestsCount + " requests to our app till now")
        global.allReqCount = data[0].allRequestsCount
      }
      else {
        console.log("First request to our app till now")
        global.allReqCount = 0
      }
    }
  }); // trackRequests.count()
}

var uniqueHostCount = function uniqueHostCount() {
  trackRequests.count( {} , function uniqueHostCount( err, count ) {
    if (err) {
      console.error(Date() + " unable to get unique IP count")
    }
    else {
      console.log(count + " users to our app till now")
      global.uniqueHostCount = count
    }
  }); // trackRequests.count()
}

var addReqCount = function addReqCount(hostname, ip){
  console.log("+1 " + hostname + " " + ip)
  global.allReqCount++
  eventEmitter.emit('updateReqCount', hostname, ip)
}


var updateReqCount = function updateReqCount(hostname, ip){
  trackRequests.update({ _id: hostname }, { $inc: { requests: 1 }, $addToSet: { ip: ip } }, { upsert: true }).exec( function (err, data ) {
    if (err) {
      console.error(Date() + " unable to set update request count for hostname "+ hostname + "\n" + err)
    }
    else {
      console.info(Date() + " added request entry for hostname" + hostname)
      if (data.upserted) {
        global.uniqueHostCount++
      }
    }    
  });
}


eventEmitter.on('getInitialReqCount', getInitialReqCount)
eventEmitter.on('addReqCount', addReqCount)
eventEmitter.on('updateReqCount', updateReqCount)
eventEmitter.on('uniqueHostCount', uniqueHostCount)

eventEmitter.emit('getInitialReqCount')
eventEmitter.emit('uniqueHostCount')

module.exports = eventEmitter;