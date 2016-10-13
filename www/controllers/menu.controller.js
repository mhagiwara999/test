//モジュールの定義
ons.bootstrap('menuModule', ['transitionModule']);


function LibraryButtonCtrl(TransitionService){
    
    this.menuTransition = function(argument){
        var target = 'views/html/library.html'; //遷移先のファイルパス
        var id = argument; //ライブラリーのID
        this.screenTransition = new TransitionService(target, id); //画面遷移サービスを呼び出す
        
    }
    
}
//コントローラーの定義
angular
    .module('menuModule')
    .controller('LibraryButtonCtrl', ['TransitionService', LibraryButtonCtrl]);