var express = require('express')
var app = express()
var path    = require("path");
var bodyParser = require('body-parser');


var AWS = require('aws-sdk');

var s3 = new AWS.S3();


app.use('/static', express.static(path.join(__dirname+'/dist/static')))
app.use(bodyParser.urlencoded({limit: '50mb', extended: true, parameterLimit:50000}));

app.get('/', function (req, res) {
  res.sendFile(path.join(__dirname+'/dist/index.html'))
})

app.post('/upload', function (req, res) {
  console.log(req.body)
  var myBucket = 'poem-generator';

  var myKey = 'myBucketKey';

  res.send("200 OK")

  // console.log(req.imageFile)

  // params = {Bucket: myBucket, Key: myKey, Body: req.imageFile};

  // s3.putObject(params, function(err, data) {

  //   if (err) {

  //     console.log(err)

  //   } else {

  //     console.log("Successfully uploaded data");

  //   }

  // });
})

app.get('/gallery', function(req, res) {
  s3.listObjects(params, function(err, data){
  var bucketContents = data.Contents;
    for (var i = 0; i < bucketContents.length; i++){
      var urlParams = {Bucket: 'myBucket', Key: bucketContents[i].Key};
        s3.getSignedUrl('getObject',urlParams, function(err, url){
          console.log('the url of the image is', url);
        });
    }
  });
})

app.listen(3000, function () {
  console.log('Example app listening on port 3000!')
})
