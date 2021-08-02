'use strict';

console.log("OK");
const CHRHEIGHT =9;                 //キャラの高さ
const CHRWIDTH  =8;                 //キャラの幅
const FONT      = "12px monospace"; //使用フォント
const FONTSTYLE ="#ffffff";         //文字色
const HEIGHT    =120;               //仮想画面サイズ高さ
const WIDTH     =128;               //仮想画面サイズ幅
const INTERVAL  =33;                //フレーム呼び出し間隔
const MAP_HEIGHT=32;                //マップ高さ
const MAP_WIDTH=32;                 //マップ幅
const SCR_HEIGHT=8;                 //画面タイルサイズ半分の高さ
const SCR_WIDTH =8;                 //画面タイルサイズの半分の幅
let   SCROLL    =4;                 //スクロール速度
const SMOOTH    =0;                 //補間処理
const START_HP  =20;                //開始HP
const START_X   =15;                //スタート開始位置X
const START_Y   =17;                //スタート開始位置Y
const TILECOLUMN=4;                 //タイル桁数
const TILEROW   =4;                 //タイル行数
const TILESIZE  =8;                 //タイルサイズ(ドット)
const WNDSTYLE  ="rgba(0,0,0,0.75)";//ウィンドウの色

const gKey=new Uint8Array(0x100);//キー入力バッファ

let gAngle=0;                 //プレイヤーの向き
let gEx=0;                    //プレイヤーの経験値
let gHP=START_HP;             //プレイヤーのHP
let gMHP=START_HP;            //プレイヤーの最大HP
let gLv=1;                    //プレイヤーのレベル
let gCursor=0;                //カーソル位置
let gEnemyType;               //敵種別
let gFrame=0;                 //内部カウンタ
let gHeight;                  //実画面の高さ
let gWidth;                   //実画面の幅
let gMessage1=null;           //表示メッセージ1
let gMessage2=null;           //表示メッセージ2
let gMoveX=0;                 //移動量X
let gMoveY=0;                 //移動量Y
let gItem=0;                  //所持アイテム
let gPhase=0;                 //戦闘フェーズ
let gImgMap;                  //マップ画像
let gImgMonster;              //モンスター画像
let gImgPlayer;               //プレイヤー画像
let gPlayerX=START_X*TILESIZE+TILESIZE/2;//プレイヤー座標X
let gPlayerY=START_Y*TILESIZE+TILESIZE/2;//プレイヤー座標Y
let gScreen;                  //仮想画面

const gFileMap="img/map.png";
const gFileMonster="img/monster.png";
const gFilePlayer="img/player.png";

const gEncounter=[0,0,0,1,0,0,2,3,0,0,0,0,0,0,0,0];//敵エンカウント確率

//マップ32*32
const	gMap = [
  0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
  0, 0, 3, 3, 3, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
  0, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 0, 3, 0, 3, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
  0, 3, 3, 7, 7, 7, 7, 7, 7, 7, 7, 7, 6, 6, 3, 6, 3, 6, 3, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
  0, 3, 3, 6, 6, 7, 7, 7, 2, 2, 2, 7, 7, 7, 7, 7, 7, 7, 6, 3, 0, 0, 0, 3, 3, 0, 6, 6, 6, 0, 0, 0,
  0, 0, 3, 3, 6, 6, 6, 7, 7, 2, 2, 2, 7, 7, 2, 2, 2, 7, 7, 6, 3, 3, 3, 6, 6, 3, 6,13, 6, 0, 0, 0,
  0, 3, 3,10,11, 3, 3, 6, 7, 7, 2, 2, 2, 2, 2, 2, 1, 1, 7, 6, 6, 6, 6, 6, 3, 0, 6, 6, 6, 0, 0, 0,
  0, 0, 3, 3, 3, 0, 3, 3, 3, 7, 7, 2, 2, 2, 2, 7, 7, 1, 1, 6, 6, 6, 6, 3, 0, 0, 0, 0, 0, 0, 0, 0,
  0, 0, 0, 0, 0, 0, 0, 0, 3, 3, 7, 7, 7, 7, 2, 7, 6, 3, 1, 3, 6, 6, 6, 3, 0, 0, 0, 3, 3, 0, 0, 0,
  0, 0, 0, 0, 0, 0, 0, 0, 0, 3, 3, 6, 6, 7, 2, 7, 6, 3, 1, 3, 3, 6, 6, 3, 0, 0, 0, 3, 3, 0, 0, 0,
  0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 3, 3, 6, 7, 7, 7, 6, 3, 1, 1, 3, 3, 6, 3, 3, 0, 0, 3, 3, 3, 0, 0,
  0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 3, 6, 6, 7, 7, 7, 6, 3, 1, 1, 3, 3, 6, 3, 3, 0, 3,12, 3, 0, 0,
  0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 3, 3, 6, 6, 6, 7, 7, 6, 3, 1, 1, 3, 3, 3, 3, 3, 3, 3, 3, 0, 0,
  0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 3, 3, 3, 3, 6, 6, 6, 6, 3, 1, 1, 1, 1, 3, 3, 3, 3, 3, 3, 0,
  0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 3, 3, 3, 3, 3, 3, 6, 6, 3, 3, 3, 3, 1, 1, 3, 3, 3, 1, 1, 0,
  0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 3, 4, 5, 3, 3, 3, 6, 6, 6, 3, 3, 3, 1, 1, 1, 1, 1, 3, 0,
  0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 3, 8, 9, 3, 3, 3, 6, 6, 6, 6, 3, 3, 3, 3, 3, 3, 1, 0, 0,
  0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 3, 3, 3, 3, 3, 3, 3, 6, 6, 6, 3, 3, 3, 3, 3, 3, 0, 0, 0,
  0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 3, 3, 3, 3, 3, 3, 3, 6, 6, 6, 6, 3, 3, 3, 3, 0, 0, 0, 0,
  0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 3, 3, 3, 3, 3, 3, 3, 6, 6, 6, 6, 3, 3, 3, 0, 0, 0, 0, 0,
  0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 3, 3, 3, 3, 3, 3, 3, 6, 6, 6, 3, 3, 3, 0, 0, 0, 0, 0, 0,
  0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 3, 3, 6, 6, 6, 3, 6, 6, 6, 3, 3, 3, 0, 0, 0, 0, 0, 0, 0,
  0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 3, 3, 6, 6, 3, 6, 6, 3, 3, 3, 0, 0, 0, 0, 0, 0, 0, 0,
  0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 3, 3, 6, 6, 3, 6, 6, 3, 3, 3, 0, 0, 0, 0, 0, 0, 0, 0,
  0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 3, 3, 6, 3, 0, 0, 0, 0, 3, 0, 0, 0, 0, 0, 0, 0, 0,
  0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 3, 6, 3, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
  0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 6, 3, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
  0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,14, 6, 0, 0, 6, 0, 0, 0, 0, 0, 0, 0, 0, 0,
  0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 6, 6, 6, 6, 0, 0, 0, 0, 0, 0, 0, 0, 0,
  0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 6, 6, 7, 0, 0, 0, 0, 0, 0, 0, 0,
  7,15, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 7, 7, 7, 7, 0, 0, 0, 0, 0,
  7, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 7, 7, 7, 7, 7, 7,
 ];

//戦闘画面処理
function DrawFight(g){

  g.fillStyle="#000000";//背景色
  g.fillRect(0,0,WIDTH,HEIGHT);//画面全体を塗りつぶし

  let w=gImgMonster.width/4;
  let h=gImgMonster.height;

  g.drawImage(gImgMonster,gEnemyType *w,0,w,h,Math.floor(WIDTH/2-w/2),Math.floor(HEIGHT/2-h/2),w,h);
  // gPhase=0;

  DrawStatus(g);                  //ステータス描画
  DrawMessage(g);                 //メッセージ描画
  
  if(gPhase==2){                  //戦闘フェーズがコマンド選択中の場合
    g.fillText("⇒",6,96+14*gCursor);//カーソル描画
  }

}

//フィールド描画処理
function DrawField(g){

  let mx=Math.floor(gPlayerX/TILESIZE);//プレイヤーのタイル座標X
  let my=Math.floor(gPlayerY/TILESIZE);//プレイヤーのタイル座標Y
  
  
  for(let dy=-SCR_HEIGHT;dy<=SCR_HEIGHT;dy++){
    let ty=my+dy;                     //タイル座標Y
    let py=(ty+MAP_HEIGHT)%MAP_HEIGHT;//ループ後タイル座標Y
    for(let dx=-SCR_WIDTH;dx<=SCR_WIDTH;dx++){
      let tx=mx+dx;                   //タイル座標X
      let px=(tx+MAP_WIDTH)%MAP_WIDTH;//ループ後タイル座標X
      DrawTile(g,
              tx*TILESIZE+WIDTH/2-gPlayerX,
              ty*TILESIZE+HEIGHT/2-gPlayerY,
              gMap[py*MAP_WIDTH+px]);
    }
  }

  // // 中心線
  // g.fillStyle="#ff0000";
  // g.fillRect(0, HEIGHT/2-1,WIDTH,2);
  // g.fillRect(WIDTH/2-1,0,2,HEIGHT);

  //プレイヤー
  g.drawImage(gImgPlayer,
              (gFrame>> 4 & 1)*CHRWIDTH, gAngle*CHRHEIGHT, CHRWIDTH, CHRHEIGHT,
              WIDTH/2-CHRWIDTH/2, HEIGHT/2-CHRHEIGHT+TILESIZE/2,CHRWIDTH,CHRHEIGHT);//プレイヤー画像描画
  // g.drawImage(gImgPlayer,0,gFrame/10);//プレイヤー画像描画

  //ステータスウィンドウ
  g.fillStyle=WNDSTYLE;          //ウィンドウの色
  g.fillRect(2,2,44,37);         //短形描画

  DrawStatus(g);                 //ステータス描画
  DrawMessage(g);                //メッセージ描画 
  
}

function DrawMain(){

  const g=gScreen.getContext("2d");  //仮想画面の2D描画コンテキストを取得
  if(gPhase==0){
    DrawField(g);                       //フィールド画面描画
  }else{
    DrawFight(g);
  }

  // g.fillStyle=WNDSTYLE;            //ウィンドウの色
  // g.fillRect(20,3,105,15);         //短形描画

  // g.font=FONT;                      //文字フォント設定
  // g.fillStyle=FONTSTYLE;            //文字色
  // g.fillText("x="+gPlayerX + " y="+gPlayerY+" m="+gMap[my*MAP_WIDTH+mx],25,15);//文字描画
  // // console.log("a");
}

//メッセージ描画
function DrawMessage(g){

  if(!gMessage1){//メッセージ内容が存在しない場合
    return;
  }

  g.fillStyle=WNDSTYLE;            //ウィンドウの色
  g.fillRect(4,84,120,30);         //短形描画
  g.font=FONT;                     //文字フォント設定
  g.fillStyle=FONTSTYLE;           //文字色
  g.fillText(gMessage1,6,96);      //メッセージ1行目描画
  if(gMessage2){
    g.fillText(gMessage2,6,110);      //メッセージ2行目描画
  }

}

//ステータス描画
function DrawStatus(g){

  g.font=FONT;                     //文字フォント設定
  g.fillStyle=FONTSTYLE;           //文字色
  g.fillText("Lv "+gLv,4,13);      //Lv
  g.fillText("HP "+gHP,4,25);      //HP
  g.fillText("Ex "+gEx,4,37);      //Ex

}

function DrawTile(g,x,y,idx){

  const ix=(idx%TILECOLUMN)*TILESIZE;
  const iy=Math.floor(idx/TILECOLUMN)*TILESIZE;
  g.drawImage(gImgMap,ix,iy,TILESIZE,TILESIZE,x,y,TILESIZE,TILESIZE);//画像の縦*32,横*32

}
  
function LoadImage(){

  gImgMap=new Image();gImgMap.src=gFileMap;   //マップ画像読み込み
  gImgMonster=new Image();gImgMonster.src=gFileMonster;//モンスター画像読み込み
  gImgPlayer=new Image();gImgPlayer.src=gFilePlayer;//プレイヤー画像読み込み

}
// function SetMessage(v1,v2=null)//IE未対応
function SetMessage(v1,v2){
  gMessage1=v1;
  gMessage2=v2;
}

//IE対応
function Sign(val){
  if(val==0){
    return(0);
  }
  if(val<0){
    return(-1);
  }
  return(1);

}

//フィールド進行処理
function TickField(){
  
  // if(gKey[16]){SCROLL=2;}
  if(gMoveX !=0 || gMoveY !=0 || gMessage1){}   //移動中またはメッセージ表示中の場合
  else if(gKey[37]){gAngle=1; gMoveX=-TILESIZE;}//左
  else if(gKey[38]){gAngle=3; gMoveY=-TILESIZE;}//上
  else if(gKey[39]){gAngle=2; gMoveX=TILESIZE; }//右
  else if(gKey[40]){gAngle=0; gMoveY=TILESIZE; }//下


  //移動後のタイル座標判定
  let mx=Math.floor((gPlayerX+gMoveX)/TILESIZE)//移動後のタイル座標X;
  let my=Math.floor((gPlayerY+gMoveY)/TILESIZE)//移動後のタイル座標X;
  mx+=MAP_WIDTH                     //マップループ処理X
  mx%=MAP_WIDTH                     //マップループ処理X
  my+=MAP_HEIGHT                    //マップループ処理Y
  my%=MAP_HEIGHT                    //マップループ処理Y
  let m=gMap[my*MAP_WIDTH+mx];      //タイル番号

  if(m<3){                          //侵入不可能地形の場合
    gMoveX=0;                       //移動禁止X
    gMoveY=0;                       //移動禁止Y
    console.log('移動できません');
    console.log('m='+m);
  }

  if(Math.abs(gMoveX)+Math.abs(gMoveY)==SCROLL){
    //マス目移動が終わる直前
    if(m==8||m==9){//城
      SetMessage("魔王を倒して！",null);
    }
    if(m==10||m==11){//街
      SetMessage("西の果てにも","村があります");
    }
    if(m==12){//村
      SetMessage("カギは、","洞窟にあります");
    }
    if(m==13){//洞窟
      gItem=1;//カギ入手
      SetMessage("カギはを手に入れた",null);
    }
    if(m==14){//扉 
      if(gItem==0){
        //カギを保持していない場合
        gPlayerY-=TILESIZE;//1マス上へ移動
        SetMessage("カギが必要です",null);
      }else{
        SetMessage("扉が開いた",null);
      }
    }  
    if(m==15){//ボス 
      SetMessage("魔王を倒し、","世界に平和が訪れた");
    }
    if(Math.random()*4<gEncounter[m]){//ランダムエンカウント
      gPhase=1;                       //敵出現フェーズ
      gEnemyType=1;
      SetMessage("敵が現れた!",null);
    }
  }



  //signはIEでは動かない
  gPlayerX+=Sign(gMoveX)*SCROLL;//プレーヤー座標移動X
  gPlayerY+=Sign(gMoveY)*SCROLL;//プレーヤー座標移動Y
  gMoveX-=Sign(gMoveX)*SCROLL;  //移動量消費X
  gMoveY-=Sign(gMoveY)*SCROLL;  //移動量消費Y

  //マップループ処理
  gPlayerX+=(MAP_WIDTH*TILESIZE);
  gPlayerX%=(MAP_WIDTH*TILESIZE);
  gPlayerY+=(MAP_HEIGHT*TILESIZE);
  gPlayerY%=(MAP_HEIGHT*TILESIZE);

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
  TickField();//フィールド進行処理
  WmPaint();
}

//キー入力(DOWN)イベント
window.onkeydown=function(ev){
  let cc=ev.keyCode;//keyCodeは非推奨
  let c=ev.key;
  console.log("キーボードの "+c+" が押されました。\nキーコード"+cc);
  if(gKey[cc]!=0){
    return;//既に押下中の場合(キーリピート)
  }
  gKey[cc]=1;
  // if(gKey[16]){SCROLL=2;}
  console.log(gKey);

  if(gPhase==1){//敵が現れた場合
    gPhase=2;   //戦闘コマンド選択フェーズ
    SetMessage("　戦う","　逃げる");
    return;
  }

  if(gPhase==2){//戦闘コマンド選択の場合
      
    if(cc==13||cc==90){//13はEnterキー、90はZキー
      SetMessage("敵を倒した！",null);
      gPhase=3;

    }else{
      gCursor=1-gCursor;//カーソル移動
    }

    return;

  }

  if(gPhase==3){
    gCursor=0;
    gPhase=0;   //マップ移動フェーズ
    gHP-=5;
    gEx++;
    
  }

  gMessage1=null;
  // if(c=="ArrowLeft") gPlayerX--;//左
  // if(c=="ArrowUp") gPlayerY--;//上
  // if(c=="ArrowRight") gPlayerX++;//右
  // if(c=="ArrowDown") gPlayerY++;//下

  
}

window.onkeyup=function(ev){
  gKey[ev.keyCode]=0;
  if(!gKey[16]){SCROLL=1;}
  console.log(gKey);
}

//ブラウザ起動イベント
window.onload=function(){

  LoadImage();

  gScreen=document.createElement("canvas");//仮想画面を作成
  gScreen.width=WIDTH;                     //仮想画面の幅を設定
  gScreen.height=HEIGHT;                   //仮想画面の高さを設定
  WmSize();                                //画面サイズ初期化
  window.addEventListener("resize",function(){WmSize()});//ブラウザサイズ変更時に読み込まれる
  setInterval(function(){WmTimer()},INTERVAL);   //33ms間隔でWmTimer()を呼び出す。

}