export default ({
  wifi_configs,
  min_distance,
  beacon_type,
}) => ({
  "device_configs": {
    "default": {},
    "ABv2": {
      "wifi_configs": wifi_configs,
      "ab_bbt_config": {
        "conn_type": 3,
        "host": 'mqtt1.dbl8.bz',
        "port": 1883,
        "req_int": 10,
        "mqtt_topic": "dbl8-1",
        "mqtt_ssl": false,
        "min_rssi": {
          default: -127,
          1: -60,
          3: -66,
          5: -70,
          10: -80,
          15: -90,
        }[min_distance] || -66, // NOTE: In meters. Fallback
        "adv_filter": {
          all: 0,
          iBeacon: 1,
          eddystoneUID: 2,
          eddystoneURL: 3,
        }[beacon_type] || 1,
        "url": "",
        "data_format": 0,
      }
    }
  },
  "bound_site": "1833"
});

[{
    "ssid": "siyue2L-east",
    "passkey": "71385b5e529c5a14d3b29d6aed75cb0e2ed52f9001da8853ae1c65ba693cd726"
  },
  {
    "ssid": "SSIDabcd",
    "passkey": "5cb7b2f1b75a83a96b0d12b5a69ef76db27f827c1c77ec12705a74044c910782"
  }
]
