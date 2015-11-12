(function(){
    'use strict';
    angular
        .module('me.tomsen.autoheight')
        .directive('autoHeight', directiveFn);
        directiveFn.inject = ['$window', '$timeout'];
        function directiveFn($window, $timeout) {
            return {
                link: function($scope, $element, $attrs) {
                    var timeout = $attrs.autoHeightTimeout || 100;
                    var heightThreshhold = $attrs.heightThreshhold || 100;
                    //auto-width
                    var autoWidth = $attrs.autoWidth ? +$attrs.autoWidth : 1;
                    if (typeof (autoWidth) !== 'number' || autoWidth === 0) {
                        autoWidth = 1;
                    }
                    //auto-height
                    var autoHeight = $attrs.autoHeight ? +$attrs.autoHeight : 1;
                    if (typeof (autoHeight) !== 'number' || autoHeight === 0) {
                        autoHeight = 1;
                    }
                    var combineHeights, combineWidths, siblings, findParentDims;
                    combineHeights = function(collection) {
                        var heights, i, len, node;
                        heights = 0;
                        for (i = 0, len = collection.length; i < len; i++) {
                            node = collection[i];
                            heights += node.offsetHeight;
                        }
                        return heights;
                    };
                    combineWidths = function(collection) {
                        var widths, i, len, node;
                        widths = 0;
                        for (i = 0, len = collection.length; i < len; i++) {
                            node = collection[i];
                            widths += node.offsetWidth;
                        }
                        return widths;
                    };
                    siblings = function($elm) {
                        var elm, i, len, ref, results;
                        ref = $elm.parent().children();
                        results = [];
                        for (i = 0, len = ref.length; i < len; i++) {
                            elm = ref[i];
                            if (elm !== $elm[0]) {
                                results.push(elm);
                            }
                        }
                        return results;
                    };

                    findParentDims = function() {
                        var parent = $element.parent();
                        var parentRect = (parent && parent[0]) ? parent[0].getBoundingClientRect() : null;
                        while (parentRect && parentRect.height < heightThreshhold) {
                            parent = parent.parent();
                            parentRect = (parent && parent[0]) ? parent[0].getBoundingClientRect() : null;
                        }
                        if (parentRect) {
                            return {height: parentRect.height, width: parentRect.width};
                        } else {
                            return {height: $window.innerHeight, width: $window.innerWidth};
                        }
                    };

                    angular.element($window).bind('show', function() {
                        console.log('autoheight: show');
                        var additionalHeight, parentDims;
                        additionalHeight = $attrs.additionalHeight || 0;
                        parentDims = findParentDims();
                        var y = autoHeight*(parentDims.height - combineHeights(siblings($element)) - additionalHeight);
                        var x = autoWidth*(parentDims.width - combineWidths(siblings($element)));
                        $element.attr('height', y);
                        $element.attr('width', x);
                        $element.css('width', x + 'px');
                        return $element.css('height', y+ 'px');
                    });
                    return $timeout(function() {
                        return angular.element($window).triggerHandler('show');
                    }, timeout);
                }
            };
        }
}());