var express = require('express')
var app = express()
var path    = require("path");
var bodyParser = require('body-parser');


var AWS = require('aws-sdk');

var s3 = new AWS.S3();


app.use('/static', express.static(path.join(__dirname+'/dist/static')))
app.use(bodyParser.json({limit: '50mb', extended: true, parameterLimit:50000}));

app.get('/', function (req, res) {
  res.sendFile(path.join(__dirname+'/dist/index.html'))
})

app.post('/upload', function (req, res) {

  var myBucket = 'poem-generator';

  buf = new Buffer(req.body.image.replace(/^data:image\/\w+;base64,/, ""),'base64')
  var data = {
    Key: "test" + Math.round(new Date()/1000),
    Bucket: 'poem-generator',
    Body: buf,
    ContentEncoding: 'base64',
    ContentType: 'image/jpeg'
  };
  s3.putObject(data, function(err, data){
      if (err) {
        console.log(err);
        console.log('Error uploading data: ', data);
      } else {
        console.log('succesfully uploaded the image!');
      }
  });

  res.send("200 OK")

})

app.get('/gallery', function(req, res) {
  var params = {Bucket: 'poem-generator'};
  s3.listObjects(params, function(err, data){
  var bucketContents = data.Contents;
    for (var i = 0; i < bucketContents.length; i++){
      var urlParams = {Bucket: 'poem-generator', Key: bucketContents[i].Key};
      s3.getSignedUrl('getObject',urlParams, function(err, url){
        console.log('the url of the image is', url);
      });
    }
  });
})

app.listen(3000, function () {
  console.log('Example app listening on port 3000!')
})
