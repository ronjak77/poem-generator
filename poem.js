/* jshint ignore:start */
var express = require('express')
var app = express()
var path = require("path");
var bodyParser = require('body-parser');
var AWS = require('aws-sdk');
// const paginate = require('express-paginate');

var bgUrls = [];

app.set('port', process.env.PORT || 8080);

var s3 = new AWS.S3({
  accessKeyId: process.env.S3_KEY,
  secretAccessKey: process.env.S3_SECRET
});

// app.use(paginate.middleware(10, 50));

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
  var numpart = 10000000000-Math.floor(Date.now() / 1000);
  var filename = '0-metsa-' + numpart.toString();

  if(req.body.langFI) {
    var foldername = "approved/";
  } else {
    var foldername = "approvedEng/";
  }

  var authorTag = "author="+req.body.author;
  var fileUploadData = {
    Key: (foldername + filename),
    Bucket: myBucket,
    Body: buf,
    Metadata:  {
      'author': authorTag
    },
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


app.get('/imgs/approved/:imgID', function(req, res){

  s3.getObject({ Bucket: 'poem-generator', Key: 'approved/' + req.params.imgID}, function(err, data){

    if (err) {
      console.log(err);
      return res.status(500).send("Error!");
    }

    // Headers
    console.log(data);

    res.set("Content-Length",data.ContentLength)
       .set("Content-Type",data.ContentType);

    res.send(data.Body); // data.Body is a buffer

  });

})



app.get('/galleria', async (req, res) => {
  var page = req.query.page || 1;

  var per_page = 5;
  var offset = (page - 1) * per_page;


  var params = { Bucket: 'poem-generator', Prefix: "approved/" };

  var imageUrls = [];
  var imageData = [];

  s3.listObjectsV2(params, function(err, data){
    if (err) console.log(err, err.stack);
    else  {

      var bucketContents = data.Contents;

      for (var i = 1; i < bucketContents.length; i++) {
        var urlParams = { Bucket: 'poem-generator', Key: bucketContents[i-1].Key };
        var imag = {};
        imag.url = "/imgs/" + bucketContents[i].Key;
        imageUrls[i-1] = imag;
        imageData[i-1] = {"author": "Kalle", "date": "1.1.2020"};
      }

      paginatedItems = imageUrls.slice(offset).slice(0, per_page);
      paginatedMeta = imageData.slice(offset).slice(0, per_page);
      total_pages = Math.ceil(imageUrls.length / per_page);

      // const itemCount = imageUrls.length;
      // const pageCount = Math.ceil(itemCount / req.query.limit);

      res.render('gallery', {
        page: page,
        per_page: per_page,
        pre_page: page - 1 > 0 ? page - 1 : null,
        next_page: (total_pages > page) ? Number(page) + 1 : null,
        total: imageUrls.length,
        total_pages: total_pages,
        images: paginatedItems,
        imagemeta: paginatedMeta,
       // pageCount,
       // itemCount,
       // pages: paginate.getArrayPages(req)(3, pageCount, req.query.page)
      });
    }
  });

})

app.get('/gallery', function(req, res) {
  var params = { Bucket: 'poem-generator', Prefix: "approvedEng/", MaxKeys: "10" };

  var imageUrls = [];
  s3.listObjectsV2(params, function(err, data){
    if (err) console.log(err, err.stack);
    else  {
      var bucketContents = data.Contents;
      for (var i = 1; i < bucketContents.length; i++) {
        var urlParams = {Bucket: 'poem-generator', Key: bucketContents[i].Key};
        var imag = {};
            imag.url = "/imgs/" + bucketContents[i].Key;
            imageUrls[i-1] = imag;
      }
      res.render('gallery', { images: imageUrls });
    }
  });

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
