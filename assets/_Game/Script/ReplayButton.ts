// Learn TypeScript:
//  - https://docs.cocos.com/creator/manual/en/scripting/typescript.html
// Learn Attribute:
//  - https://docs.cocos.com/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - https://docs.cocos.com/creator/manual/en/scripting/life-cycle-callbacks.html

import levelManager from "./Manager/LevelManager";

const { ccclass, property } = cc._decorator;

@ccclass
export default class RestartButton extends cc.Component {
  public onClick() {
    levelManager.Ins.onReset();
  }
}
