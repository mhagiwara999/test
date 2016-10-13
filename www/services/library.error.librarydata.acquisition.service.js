
//LibraryErrorService
function LibraryErrorService($q,$rootScope){
    
    //mBaaSからデータを取得するメソッド
    var libraryDataAcquisition = function(argument){
        var libraryId = argument; //ライブラリーIDを格納
       
       //mBaaSのAPIキーの設定とSDKの初期化
       //存在しないAPIキーを指定（エラー処理が走る）
        var ncmb = new NCMB("340609a9b5431d19c497beb72411339fb9bd524570d8de15486d6557d07970ceaaaaaaa","dda8edefd900294fcadc8d2914debad64dfb4aa7a26919e759a20e5cf3c5c609");
        
        //NCMB.DataStoreのサブクラスを生成
        //取得したデータの格納する配列を定義
        
        //libraryクラス
        var library = ncmb.DataStore("libraryError");   //存在しないクラスを指定（エラー処理が走らない）
        var libraryPictureUrl = [];
        var libraryOverview = [];
        
        //contentsListクラス
        var contentsList = ncmb.DataStore("contentsList");
        var contentsPictureUrl = [];
        var contentsName = [];
        var contentsType = [];
        var contentsUrl = [];
        
        //データの取得メソッド
        //IDが一致するレコードを作成日の降順で取得
        var libraryAcquisition = library.equalTo("libraryId", libraryId).order("createDate", true).fetchAll();
        var contentsListAcquisition = contentsList.equalTo("libraryId", libraryId).order("createDate", true).fetchAll();
        
        //取得したデータを格納するオブジェクト。イベント経由でコントローラーに渡す
        var data = {
            library,
            contentsList
        };
        
        //$q.all() メソッドによる複数 Promise オブジェクトの監視
        //取得したデータを格納
        $q.all([libraryAcquisition, contentsListAcquisition])
        .then(function(results) {
            var libraryAcquisitionResults = results[0];
            var contentsListAcquisitionResults = results[1];
            
            //ライブラリーの概要（タイトル画像・概要）を取得・格納
            for (var i = 0; i < libraryAcquisitionResults.length; i++) {
                var object = libraryAcquisitionResults[i];
                
                libraryPictureUrl[i] = object.get("libraryPictureUrl");
                libraryOverview[i] = object.get("libraryOverview");
            }
            data.library = {
                libraryPictureUrl:libraryPictureUrl[0],
                libraryOverview:libraryOverview[0]
            };
            
            
            //取得したデータをまとめる配列
            data.contentsList = [];
            
            //コンテンツのデータを取得・格納
            for (var i = 0; i < contentsListAcquisitionResults.length; i++) {
                var object = contentsListAcquisitionResults[i];
                
                contentsPictureUrl[i] = object.get("contentsPictureUrl");
                contentsName[i] = object.get("contentsName");
                contentsType[i] = object.get("contentsType");
                contentsUrl[i] = object.get("contentsUrl");
                
                data.contentsList.push(
                    {
                        img: contentsPictureUrl[i],
                        name: contentsName[i],
                        type: contentsType[i],
                        url: contentsUrl[i]
                    }
                );

                
            }
            //処理が終了したイベントを発火
            $rootScope.$broadcast('libraryDataGot', data);
        })
        .catch(function(err){   //エラー処理
            console.log(err);
            
            var networkState = navigator.connection.type;
            if(networkState != Connection.NONE){    //ネットワークに接続されていない場合は別のアラートを動作させるため、この処理が動作しないようにする
                //データの取得に失敗した場合はアラートを表示
                ons.notification.confirm({
                    title: '',
                    messageHTML: 'データの取得に失敗しました。再接続を行いますか。',
                    buttonLabels: ['OK','キャンセル'],
                    callback: function(arg){
                        if(arg == 0){
                            libraryDataAcquisition(libraryId);  //「OK」がタップされた場合は再実行
                        }
                        else{
                            navi.popPage({animation:'slide'});  //「キャンセル」がタップされた場合はメニュー画面に戻る
                        }
                    }
                });
            }
        });
    };
    return libraryDataAcquisition;
}
//サービスの定義
angular
    .module('dataAcquisitionModule')
    .service('LibraryErrorService', ['$q','$rootScope', LibraryErrorService]); 