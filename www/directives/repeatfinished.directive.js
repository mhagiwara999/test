//モジュールの定義
angular.module('repeatFinishedModule', []);

// RepeatFinishedDirective
function repeatFinishedDirective($timeout){
    return {
        restrict: 'A',
        link: function(scope, element, attrs){  //ng-repeatのループ終了時にイベントを発火する
            if (scope.$last === true){
                $timeout(function(){
                    scope.$emit('ngRepeatFinished');
                });
            }
        }
    }
}

//ディレクティブの定義
angular.module("repeatFinishedModule", [])
    .directive('repeatFinishedDirective', ['$timeout', repeatFinishedDirective]);
