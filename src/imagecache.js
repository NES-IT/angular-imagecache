/**
 * Created by dan on 22/02/16.
 */
(function () {

    'use strict';

    var eventPrefix = 'nes.imagecache::';

    angular.module('nes.imagecache', []);

    /**
     * <img-cached   url="{{imageUrl}}" />
     */
    angular.module('nes.imagecache').directive('imgCached', function () {

        return {
            restrict: 'E',
            template: '<img />',
            replace: true,
            link: function (scope, element, attrs) {

                function _setImageFromCache() {
                    QImgCache.useCachedFileWithSource(element, attrs.url);
                }

                if (typeof attrs.url === 'undefined') {
                    console.info('No src found for image');
                    return;
                }

                scope.$on(eventPrefix + 'refresh', _setImageFromCache);

                (typeof ionic !== 'undefined')
                    ? ionic.Platform.ready(_setImageFromCache)
                    : _setImageFromCache();

            }
        }
    });

    angular.module('nes.imagecache').service('$imageCache', ['$q', '$rootScope', function ($q, $rootScope) {

        function _cache(data) {
            if (typeof data === 'undefined' || (typeof data === 'object' && Object.prototype.toString.call(data) != '[object Array]')) {
                throw "Only 'string' and ['string'] are accepted";
            }

            if (typeof data === 'string') {
                data = [data];
            }


            var defer = $q.defer();
            var promises = [];

            angular.forEach(data, function (value) {
                promises.push(QImgCache.cacheFile(value));
            });

            $q.all(promises).then(function () {
                console.log(arguments);
                $rootScope.$broadcast(eventPrefix + 'refresh');
                defer.resolve();
            });

            return defer.promise;

        }

        function _clear(data) {
            if (typeof data === 'string') {
                return QImgCache.removeFile();
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