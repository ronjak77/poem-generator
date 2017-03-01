var express = require('express')
var app = express()
var path = require("path");
var bodyParser = require('body-parser');
var AWS = require('aws-sdk');

var s3 = new AWS.S3();

app.use('/static', express.static(path.join(__dirname+'/dist/static')))

app.use('/assets', express.static(path.join(__dirname+'/src/assets')))

app.use(bodyParser.json({limit: '50mb', extended: true, parameterLimit:50000}));

app.set('view engine', 'pug')

app.get('/', function (req, res) {
  res.sendFile(path.join(__dirname+'/dist/index.html'))
})

app.post('/upload', function (req, res) {
  var myBucket = 'poem-generator';
  var crypto = require('crypto');

  var hash = crypto.createHash('md5').update(req.body.image).digest('hex');

  buf = new Buffer(req.body.image.replace(/^data:image\/\w+;base64,/, ""),'base64')
  var fileUploadData = {
    Key: hash,
    Bucket: myBucket,
    Body: buf,
    ContentEncoding: 'base64',
    ContentType: 'image/jpeg'
  };

    var params = {
      Bucket: myBucket,
      Key: hash
    };

    s3.headObject(params, function(err, data) {
      if (err) {
        if(err.statusCode === 404) {
          s3.putObject(fileUploadData, function(err, data){
              if (err) {
                console.log(err);
                console.log('Error uploading data: ', fileUploadData);
              } else {
                console.log('succesfully uploaded the image!');
              }
          });
        }
        // console.log(err, err.stack);
      }  // an error occurred
      else {
        console.log(data);
        console.log("There was already identical file");
      }              // successful response
    });

  res.redirect('/galleria');
})

app.get('/galleria', function(req, res) {
  var params = { Bucket: 'poem-generator' };
  s3.listObjects(params, function(err, data){
  var bucketContents = data.Contents;
  var imageUrls = [];
  for (var i = 0; i < bucketContents.length; i++){
    var imag = {};
    var urlParams = {Bucket: 'poem-generator', Key: bucketContents[i].Key};
    s3.getSignedUrl('getObject',urlParams, function(err, url){
      console.log('the url of the image is', url);
      var image = {};
      image.url = url;
      image.key = bucketContents[i].Key;
      imag = image;
    });
    imageUrls[i] = imag;
  }

    res.render('gallery', { images: imageUrls })
  });
})

app.listen(3000, function () {
  console.log('Example app listening on port 3000!')
})
