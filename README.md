### DBL8 BeaconZone
Tracks and monitors event data from BLE Beacons. 
 
We deploy BLE Gateway Readers that receive data packets from Beacons.  The readers deliver the beacon data to a server using MQTT. 
On the server where the MQTT broker(s) resides, we have Meteor (JavaScript) processes that analyze the data, normalize it, persist it to a database and deliver it to an external host where applications may use the data for unique solutions related to the deployment of readers and beacons.
The DBL8 BeaconZone solution will provide services to maintain Client identity data, registry of Readers and Beacons, beacon event data, query processes, dashboard and an API to provide services to external applications.

**Lead Mentor**: <br />
Ryan Glover • ryan.glover@cleverbeagle.com

[Pup Documentation](https://cleverbeagle.com/pup) <br />
[Manage Issues on Clever Beagle](https://app.cleverbeagle.com/products/4DZLT5ttHEhebcWJt/issues)

---

“Never play to the gallery […] if you feel safe in the area that you’re working in, you’re not working in the right area. Always go a little further into the water than you feel you’re capable of being in. Go a little bit out of your depth and when you don’t feel that your feet are quite touching the bottom, you’re just about in the right place to do something exciting.” <br />

– David Bowie
