# 3DS 2.0 Updater

## What is this?
An endpoint that loops through a list of mercahnts and enable 3DS 2.0 for each of them.

## How to set it up?
1- Clone the code
2- run `npm init` or `yarn`
3- open the terminal and then run `npm start` or `yarn start`

## How to use it?
1- Setup your .env variables with your credentials and domain and port.
2- Just call it using postman or other methods
3- Your request payload will be an array of merchant in plain text, for example:
```
THREED001
THREED002
THREED003
```
4- Your response payload will be an array of each merchant update result, for example:
```
{
    "result": [
        {
            "merchant": "THREED001",
            "updated": true
        },
        {
            "merchant": "THREED002",
            "updated": true
        },
        {
            "merchant": "THREED003",
            "updated": false
        }
    ]
}
```
