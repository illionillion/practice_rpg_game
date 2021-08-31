var TUG=TUG||{};
TUG.GR={};

TUG.mCurrentFrame=0;//経過フレーム数
TUG.mFPS=60;        //フレームレート
TUG.mHeight=120;    //仮想画面・高さ
TUG.mWidth =128;    //仮想画面・幅

TUG.onTimer=function(){}

TUG.init=function(){
  // setInterval(function(){TUG.wmTimer()},16.6666);   //33ms間隔でWmTimer()を呼び出す。
  TUG.GR.mCanvas=document.createElement("canvas");//仮想画面を作成
  TUG.GR.mCanvas.width = TUG.mWidth;              //仮想画面の幅を設定
  TUG.GR.mCanvas.height =TUG.mHeight;             //仮想画面の高さを設定
  TUG.GR.mG=TUG.GR.mCanvas.getContext("2d");  //仮想画面の2D描画コンテキストを取得

  requestAnimationFrame(TUG.wmTimer);

}

//IE対応
TUG.Sign=function Sign(val){
  if(val==0){
    return(0);
  }
  if(val<0){
    return(-1);
  }
  return(1);
}

TUG.wmTimer=function(){
  if( !TUG.mCurrentStart ){             //初回呼び出し時
    TUG.mCurrentStart=performance.now();//開始時刻を設定
  }

  let d=Math.floor((performance.now() - TUG.mCurrentStart) * TUG.mFPS/1000 ) - TUG.mCurrentFrame;
  console.log(d);
  if(d>0){
    TUG.onTimer(d);    
    TUG.mCurrentFrame+=d;
  }


  requestAnimationFrame(TUG.wmTimer);
}