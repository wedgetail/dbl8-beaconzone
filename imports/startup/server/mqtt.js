// var Fiber = Npm.require("fibers");
import Fiber from 'fibers';
import mqtt from 'mqtt';
import { Mongo } from 'meteor/mongo';
import Events from '../../api/Events/Events';
import Customers from '../../api/Customers/Customers';
import Beacons from '../../api/Beacons/Beacons';

Mongo.Collection.prototype.mqttConnect = function(uri, topics, options, mqttOptions) {
    var self = this;
    this.mqttDisconnect();

    this.options = options || {};
    this.mqttOptions = mqttOptions || {};

    this._mqttClient = mqtt.connect(uri,self.mqttOptions);

    this._mqttClient.on("connect", function() {
        self.mqttSubscribe(topics);
    });

    this._mqttClient.on("message", function(topic, message) {
        var msg = message.toString();

        if(!self.options.raw) {
            try {
                msg = JSON.parse(msg);
            } catch(e) {
            }
        }

        Fiber(function() {

            if(self.options.insert) {

                if (msg.temp == '') {
                    console.log("Reader:" + msg.rdr + "   uuid:" + msg.uuid + " rssi:" + msg.rssi + " txpwr:" + msg.txpwr + " maj:" + msg.maj + "   min:" + msg.min + "  mac:" + msg.mac);
                } else {
                    console.log("Reader:" + msg.rdr + "   uuid:" + msg.uuid + " rssi:" + msg.rssi + " txpwr:" + msg.txpwr + " maj:" + msg.maj + "   min:" + msg.min + "  temp:" + msg.temp);
                }

                self.insert({
                    createdAt: new Date(),
                    topic: topic,
                    message: msg
                }, function(e, r) {
                    if(e) {
                        console.log(e);
                    } else {
                        if(self.options.insertLimit) {
                            var insertLimit = parseInt(self.options.insertLimit);
                            if(!isNaN(insertLimit)) {
                                while(self.find({ topic: topic }).count() > insertLimit) {
                                    var removeId = self.findOne({ topic: topic }, { sort: [["createdAt", "asc"]] });
                                    if(removeId) {
                                        self.remove({ _id: removeId._id });
                                    }
                                }
                            }
                        }
                    }
                });

            } else {
                self.upsert(
                    {
                        topic: topic
                    },
                    {
                        $set: {
                            createdAt: new Date(),
                            topic: topic,
                            message: msg
                        }
                    },
                    {
                    },
                    function(e, r) {
                        if(e) console.log(e);
                    });
            }
        }).run();
    });

    var init = true;
    this.find().observeChanges({
        added: function(id, doc) {
            if(!init) {
                if(doc && doc.topic && doc.message && doc.broadcast && self._mqttClient) {
                    var msg = typeof doc.message === 'object' ? JSON.stringify(doc.message) : doc.message + "";
                    self.remove({ _id: id });
                    self._mqttClient.publish(doc.topic, msg);
                }
            }
        }
    });
    init = false;
};

Mongo.Collection.prototype.mqttDisconnect = function() {
    if(this._mqttClient) this._mqttClient.end();
    this._mqttClient = null;
};

Mongo.Collection.prototype.mqttSubscribe = function(topics) {
    var self = this;
    if(!this._mqttClient) return;
    if(!topics) return;

    if(typeof topics == "string" || topics instanceof String) {
        this._mqttClient.subscribe(topics);
    } else if(_.isArray(topics)) {
        _.each(topics, function(topic) {
            self._mqttClient.subscribe(topic);
        });
    }
};

// Events.mqttConnect("mqtt://mqtt1.dbl8.bz:1883", ["dbl8-2"], {insert: true, raw: false}, {});

// Events.find({}).observe({
//   added(event) {
//     const existingCustomer = Customers.findOne({ beaconUUIDs: { $in: [event.message.uuid] } });
//     const beaconToUpsert = {
//       beaconType: event.message.maj,
//       macAddress: event.message.mac,
//     };

//     if (existingCustomer) {
//       beaconToUpsert.customer = existingCustomer._id;
//       beaconToUpsert.whitelisted = 'true'; // Do this as a string to match schema.
//     }

//     Beacons.upsert(
//       { macAddress: event.message.mac },
//       { $set: beaconToUpsert },
//     );
//   },
// });
