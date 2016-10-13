//モジュールの作成
angular.module('transitionModule', []);

function TransitionService(){
    var screenTransition = function(argument1,argument2){
        var target = argument1;
        var options = {
            animation:'fade',   //遷移アニメーションの指定
            //渡したいパラメータはdataオブジェクトに格納する
            data:{
                param1:argument2
            }
        };
        navi.pushPage(target, options); //<ons-navigator>のpushPageメソッドを使用する
    };
    return screenTransition; 
}

//サービスの定義
angular
    .module('transitionModule')
    .service('TransitionService', TransitionService);