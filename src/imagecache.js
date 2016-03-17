/**
 * Created by dan on 22/02/16.
 */
(function () {

    'use strict';

    var eventPrefix = 'nes.imagecache::';

    angular
        .module('nes.imagecache', []);

    /**
     * <img-cached   url="{{imageUrl}}" background />
     */
    angular
        .module('nes.imagecache')
        .directive('imgCached', function () {

            return {
                restrict: 'E',
                scope: {
                    watchUrl: '='
                },
                template: resolveTemplate,
                replace: true,
                link: function (scope, element, attrs) {

                    if (typeof ionic !== 'undefined')
                        ionic.Platform.ready(init)
                    else
                        init();



                    function init () {

                        if (scope.watchUrl) {

                            scope.$watch('watchUrl', function (newUrl, oldUrl) {

                                if (typeof attrs.background !== 'undefined') {
                                    element.removeAttr('data-old-background');
                                }

                                loadFromCache(newUrl);
                            });

                        }
                        else {
                            loadFromCache(attrs.url);
                        }

                    }

                    function loadFromCache (url) {

                        if (typeof url === 'undefined') {
                            console.info('No src found for image');
                            return;
                        }

                        if(typeof attrs.background !== 'undefined') {
                            scope.fullBackground = {
                                'background-position' : 'center',
                                'background-size'     : 'cover',
                                'background-repeat'   : 'no-repeat',
                                'background-image'    : 'url("' + url + '")'
                            }
                        }

                        _setImageFromCache(url);
                    }

                    function _setImageFromCache(url) {
                        typeof attrs.background !== 'undefined'
                            ? QImgCache.useCachedBackground(element)
                            : QImgCache.useCachedFileWithSource(element, url);
                    }
                    //scope.$on(eventPrefix + 'refresh', _setImageFromCache);

                    //(typeof ionic !== 'undefined')
                    //    ? ionic.Platform.ready(_setImageFromCache)
                    //    : _setImageFromCache();

                }
            };

            function resolveTemplate(tElement, tAttrs) {
                return (typeof tAttrs.background !== 'undefined')
                    ? '<span ng-style="fullBackground"></span>'
                    : '<img />';
            }
        });


    angular
        .module('nes.imagecache')
        .service('$imageCache', ['$q', '$rootScope', function ($q, $rootScope) {

            function _cache(data) {
                if (typeof data === 'undefined' || (typeof data === 'object' && Object.prototype.toString.call(data) != '[object Array]')) {
                    throw "Only 'string' and ['string'] are accepted";
                }

                if (typeof data === 'string') {
                    data = [data];
                }
                var images = [];
                angular.forEach(data, function(value) {
                    if(angular.isDefined(value)) {
                        this.push(value);
                    }
                }, images);

                var defer = $q.defer();
                var promises = [];

                angular.forEach(images, function (value) {
                    promises.push(QImgCache.cacheFile(value));
                });

                $q.all(promises).then(function () {
                    $rootScope.$broadcast(eventPrefix + 'refresh');
                    defer.resolve(arguments);
                }, function () {
                    defer.reject(arguments);
                });

                return defer.promise;

            }

            function _clear(data) {
                if (typeof data === 'string') {
                    return QImgCache.removeFile(data);
                }

                return QImgCache.clearCache();
            }

            function _refresh() {
                $rootScope.$emit(eventPrefix + 'refresh');
            }

            function _init() {
                ImgCache.options.debug = true;
                ImgCache.options.chromeQuota = 50 * 1024 * 1024;
            }

            return {
                cache: _cache,
                clear: _clear,
                refresh: _refresh,
                init: _init
            }
        }]);


})();
