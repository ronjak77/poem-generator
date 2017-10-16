var express = require('express')
var app = express()
var path = require("path");
var bodyParser = require('body-parser');
var AWS = require('aws-sdk');

var bgUrls = [];

app.set('port', process.env.PORT || 8080);

var s3 = new AWS.S3({
  accessKeyId: process.env.S3_KEY,
  secretAccessKey: process.env.S3_SECRET
});

app.use('/static', express.static(path.join(__dirname+'/dist/static')))

app.use(bodyParser.json({limit: '50mb', extended: true, parameterLimit:50000}));

app.use('/assets', express.static(path.join(__dirname+'/src/assets')))

app.set('view engine', 'pug')

app.get('/', function (req, res) {
  res.sendFile(path.join(__dirname+'/dist/index.html'))
})

app.post('/upload', function (req, res) {
  var myBucket = 'poem-generator';
  buf = new Buffer(req.body.image.replace(/^data:image\/\w+;base64,/, ""),'base64');
  var filename = Math.floor(Date.now() / 1000);

  if(req.body.langFI) {
    var foldername = "approved/";
  } else {
    var foldername = "approvedEng/";
  }

  var fileUploadData = {
    Key: (foldername + filename),
    Bucket: myBucket,
    Body: buf,
    ContentEncoding: 'base64',
    ContentType: 'image/jpeg'
  };

  s3.putObject(fileUploadData, function(err, data){
    if (err) {
      console.log(err);
      console.log('Error uploading data: ', fileUploadData);
      res.sendStatus(500)
    } else {
      console.log('succesfully uploaded the image!');
      res.sendStatus(200)
    }
  });

})

app.get('/galleria', function(req, res) {
  var params = { Bucket: 'poem-generator', Prefix: "approved" };
  var imageUrls = getGalleryUrls(params);
  res.render('gallery', { images: imageUrls });
})

function getGalleryUrls(params) {
  var imageUrls = [];
  s3.listObjectsV2(params, function(err, data){
    if (err) console.log(err, err.stack);
    else  {
      var bucketContents = data.Contents;
      console.log(bucketContents);
      for (var i = 1; i < bucketContents.length; i++) {
        var urlParams = {Bucket: 'poem-generator', Key: bucketContents[i].Key};
        console.log(urlParams);
        s3.getSignedUrl('getObject', urlParams, function(err, url){
          if (err) console.log(err, err.stack);
          else  {
            var imag = {};
            imag.url = url;
            console.log(url);
            imageUrls[i-1] = imag;
          }
        });
      }
    }
  });
  return imageUrls;
}

app.get('/gallery', function(req, res) {
  var params = { Bucket: 'poem-generator', Prefix: "approvedEng" };
  var imageUrls = getGalleryUrls(params);
  console.log(imageUrls);
  res.render('gallery', { images: imageUrls });
})

app.get('/bg', function(req, res) {
  var randNum = Math.floor(Math.random()*(bgUrls.length-1));
  var img = bgUrls[randNum+1];
  res.status(200).send(img.url);
})

app.listen(app.get('port'), function () {
  var params = { Bucket: 'poem-generator', Prefix: "bg" };
  var prefix = 'https://poem-generator.s3-eu-west-1.amazonaws.com/';

  s3.listObjectsV2(params, function(err, data){
    if (err) console.log(err, err.stack); // an error occurred
    else  {
      var bucketContents = data.Contents;
      for (var i = 0; i < bucketContents.length; i++) {
        imag = {};
        imag.url = prefix + bucketContents[i].Key;
        imag.key = bucketContents[i].Key;
        bgUrls[i] = imag;
      }
    }
  });

  console.log('Example app listening on port ' + app.get('port'))
})
