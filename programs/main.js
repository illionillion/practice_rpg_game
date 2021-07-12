'use strict';

console.log("OK");
const FONT = "48px monospace";//使用フォント
const HEIGHT=120;             //仮想画面サイズ高さ
const WIDTH=128;              //仮想画面サイズ幅
const SMOOTH=0;               //補間処理

let gScreen;                  //仮想画面
let gFrame=0;                 //内部カウンタ
let gWidth;                   //実画面の幅
let gHeight;                  //実画面の高さ
let gImgMap;                  //マップ画像

function DrawMain(){

  const g=gScreen.getContext("2d");  //仮想画面の2D描画コンテキストを取得
  for(let y=0;y<32;y++){
    for(let x=0;x<64;x++){
      g.drawImage(gImgMap,x*32,y*32);//画像の縦*32,横*32
    }
  }
  g.font=FONT;                       //文字フォント設定
  g.fillText("hello world"+gFrame,0,gFrame/10);//文字描画
  // console.log("a");  
}

function WmPaint(){

  DrawMain();
  const ca=document.querySelector("#main");//mainキャンバス取得
  const g=ca.getContext("2d");             //2D描画コンテキストを取得
  g.drawImage(gScreen,0,0,gScreen.width,gScreen.height,0,0,gWidth,gHeight);//仮想画面のイメージを実画面へ転送
}

//ブラウザサイズ変更イベント
function WmSize(){

  const ca=document.querySelector("#main");//mainキャンバス取得
  ca.width=window.innerWidth;              //キャンバスの幅をブラウザの幅へ変更
  ca.height=window.innerHeight;            //キャンバスの高さをブラウザの高さへ変更

  const g=ca.getContext("2d");             //2D描画コンテキストを取得
  g.imageSmoothingEnabled=g.msImageSmoothingEnabled=SMOOTH;//補間処理

  //実画面サイズを計測。ドットのアスペクト比を最大維持したままでの最大サイズを計測する。
  gWidth=ca.width;
  gHeight=ca.height;
  if(gWidth/WIDTH < gHeight/HEIGHT){
    gHeight=gWidth*HEIGHT/WIDTH;
  }else{
    gWidth=gHeight*WIDTH/HEIGHT;
  }
}

//タイマーイベント発生時の処理
function WmTimer(){
  gFrame++;//内部カウンタを加算
  WmPaint();
}

window.onload=function(){
  gImgMap=new Image();
  gImgMap.src="img/map.png";//マップ画像読み込み

  gScreen=document.createElement("canvas");//仮想画面を作成
  gScreen.width=WIDTH;                     //仮想画面の幅を設定
  gScreen.height=HEIGHT;                   //仮想画面の高さを設定
  WmSize();                                //画面サイズ初期化
  window.addEventListener("resize",function(){WmSize()});//ブラウザサイズ変更時に読み込まれる
  setInterval(function(){WmTimer()},33);   //33ms間隔でWmTimer()を呼び出す。

}