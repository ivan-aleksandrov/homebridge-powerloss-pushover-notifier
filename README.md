
# "Powerloss Pushover Notifier" Plugin

Example config.json:

```
    "accessories": [
        {
            "accessory": "PowerlossPushoverNotifier",
            "name": "PowerlossPushoverNotifier",
            "token": "APP_TOKEN_HERE",
            "user": "USER_TOKEN_HERE"
        } 
    ]

```

With this plugin you can send webhook notification to Pushover service you have created, when Homebridge service is started. It is useful when you want to be notified for a powerloss for example.
