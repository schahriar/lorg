# Lorg
----------
Fast, streamable Object logging made simple.

----------

## Getting Started
Install lorg:
```
npm install --save lorg
```

Create a new instance and pipe it to an output:
```javascript
const Lorg = require('lorg');
const appLog = new Lorg();

appLog.pipe(process.stdout); // Outputs to terminal
```

Log:
```javascript
let values = [1,2,3,4,5];
...
appLog.log({ values });

// Output: {"hello":"World!","_META_":{"time":1489471607584,"type":"log"}}
```

**Lorg will automatically add a `_META_` property with time and type of the log added to it.**

Stream your logs to a file and terminal:
```javascript
const fileStream = fs.createWriteStream('./temp/appLog.log');
appLog.pipe(fileStream);
appLog.pipe(process.stdout);
```

Create multiple log streams:
```javascript
const appLog = new Lorg();
const buildLog = new Lorg();
const fileStream = fs.createWriteStream('./temp/build.log');
appLog.pipe(process.stdout); // Outputs to terminal
buildLog.pipe(fileStream); // Outputs to file
```