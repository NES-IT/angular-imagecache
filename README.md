# angular-imagecache
NES internal wrapper for ImgCache plugin

This plugin helps you when you need to cache a bunch of images (Ex. at the startup of your application) and then need to render them in your html view through an angular applicaton.
Works both on modern browsers and for hybrid applications.

## Installation
Via bower 

```javascript
bower install nes-imagecache --save
```

## Usage
When you need to cache one image
```javascript

//could obviously also be MyRunFunction or MyService...
function MyController($imageCache, ....) {
    $imageCache.cache("http://path.to.my.awesome.image").then(function() {
      //my image is now cached!
    });
}


```

When you need to cache multiple images
```javascript

//could obviously also be MyRunFunction or MyService...
function MyController($imageCache, ....) {
    var myImagesArray = [
      "http://path.to.my.awesome.image1",
      "http://path.to.my.awesome.image2",
      "http://path.to.my.awesome.image3",
      "http://path.to.my.awesome.image4"
    ];
    
    $imageCache.cache(myImagesArray).then(function() {
      //my images are now cached!
    });
}


```

When you need to show the images you cached

```html
<img-cached ng-repeat="imgName in imagesUrlArrayIMayHaveCached"  url="{{imgName}}" />

```

Note that even if the image is not cached at the time the directive gets printed in your html, one the image is cached the image will redraw itself :)


## Events API
Whenever a cache promise gets resolved, a `nes.imagecache::refresh` event gets broadcasted down the `$rootScope`
```javascript

//could obviously also be MyRunFunction or MyService...
function MyController($imageCache, ....) {
    var myVerySlowToLoadImagesArray = [
      "http://path.to.my.awesome.image1",
      "http://path.to.my.awesome.image2",
      "http://path.to.my.awesome.image3",
      "http://path.to.my.awesome.image4"
    ];
    
    $imageCache.cache(myImagesArray);
}

......
//maybe a controller, maybe a directive, whatever you need :)
function MyChildAngularThing($scope) {
  $scope.$on('nes.imagecache::refresh', function($event, data) {
    //oh look! The images that I was waiting (?!) for are now loaded!
  });
}


```


