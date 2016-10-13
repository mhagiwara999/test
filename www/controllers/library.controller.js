//モジュールの定義
ons.bootstrap('libraryModule', ['transitionModule','dataAcquisitionModule','connectionModule']);

function LibraryCtrl(LibraryDataAcquisitionService,$scope,LibraryErrorService,ContentsErrorService,ConnectionService){
    var vm = this; //this コンテキストを、ViewModel を意味する vm として保持する
    vm.checkConnection = new ConnectionService(); //接続確認サービスの呼び出し
    var libraryId = navi.topPage.pushedOptions.data.param1; //受け取ったパラメータを代入
    document.querySelector("#myModal").show(); //インジケータを表示
    
    if(libraryId == "L006"){    //データ取得時のエラーが動作するよう、アプリケーションIDを存在しないものにしたサービス
        vm.libraryDataAcquisition = new LibraryErrorService(libraryId);
    }
    else if(libraryId == "L007"){    //上記と同様にデータ取得時のエラーが動作するよう、存在しないクラスを指定したサービス。しかし、データ取得時のエラーが動せず空のデータを取得した
        vm.libraryDataAcquisition = new ContentsErrorService(libraryId);
    }
    else{
        vm.libraryDataAcquisition = new LibraryDataAcquisitionService(libraryId); //ライブラリー画面のデータを取得するサービスの呼び出し
    }
    
    
    //データの取得が終了したイベントを受け取る
    $scope.$on('libraryDataGot', function(event, data) {
        
        //サービスから受け取ったデータを変数またはオブジェクトに格納する
        
        //ライブラリー概要
        vm.libraryPicture = data.library.libraryPictureUrl;
        vm.libraryOverview = data.library.libraryOverview;
        
        //コンテンツリスト
        $scope.contentsList = [];   //vm.contentsListでは動作しなかった（要調査）
        $scope.contentsList = data.contentsList;
        
        
        //コンテンツリストのデータが登録されていない場合
        if($scope.contentsList.length == 0){
            document.querySelector("#myModal").hide();
            vm.contentsDataNone = "データが登録されていません。";
        }
        //タイトル画像のデータが登録されていない場合
        if(vm.libraryPicture == undefined){
            vm.libraryPicture="views/img/library/library_top_data-none.png";
        }
        //概要のデータが登録されていない場合
        if(vm.libraryOverview == undefined){
            vm.libraryOverview = "データが登録されていません。";
        }
    });
    
    //ng-repeatが終了したイベントを受け取る
    $scope.$on('ngRepeatFinished', function(event) {
        document.querySelector("#myModal").hide();  //インジケータを非表示にする
    });

}



function ContentsListCtrl(TransitionService){
    var vm = this;  //this コンテキストを、ViewModel を意味する vm として保持する
    this.libTransition = function(argument,argument2){
        var contentsType = argument;    //コンテンツの種別
        var contentsUrl = argument2;    //コンテンツのURL
        if(contentsType == 'movie'){
            var target = 'views/html/movie.contents.html'; //遷移先のファイルパス
            vm.screenTransition = new TransitionService(target, contentsUrl); //サービスを呼び出す
        }
        else{   //今後PDFなどの種別ごとの処理を作成
            var target = 'views/html/contents.html'; //遷移先のファイルパス
            vm.screenTransition = new TransitionService(target, contentsUrl); //サービスを呼び出す
        }
  
    }
}

//コントローラーの定義
angular
    .module('libraryModule')
    .controller('LibraryCtrl', ['LibraryDataAcquisitionService','$scope','LibraryErrorService','ContentsErrorService','ConnectionService', LibraryCtrl])
    .controller('ContentsListCtrl',['TransitionService', ContentsListCtrl]);