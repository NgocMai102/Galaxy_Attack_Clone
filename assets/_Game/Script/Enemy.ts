// Learn TypeScript:
//  - https://docs.cocos.com/creator/manual/en/scripting/typescript.html
// Learn Attribute:
//  - https://docs.cocos.com/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - https://docs.cocos.com/creator/manual/en/scripting/life-cycle-callbacks.html

import Character from "./Character";
import LevelManager from "./Manager/LevelManager";
import SoundManager, { AudioType } from "./Manager/SoundManager";
import SimplePool, { PoolType } from "./Pool/SimplePool";

const { ccclass, property } = cc._decorator;

@ccclass
export default class Enemy extends Character {
  @property({
    type: [cc.Node],
    tooltip: "bulletPoint",
  })

  // private isShooting: boolean = false;
  // public onInit(hp: number) {
  //   super.onInit(hp);
  //   this.isShooting = false;
  // }
  //public onStart;
  protected onDestroy(): void {}

  //enemy death sẽ đưa nó về pool
  protected onDeath() {
    // super.onDeath();
    LevelManager.Ins.onEnemyDeath(this);
    SimplePool.despawn(this);
    this.onDeathEffect();
    //SoundManager.Ins.PlayClip(AudioType.FX_EnemyDie);
  }

  protected onDeathEffect() {
    SimplePool.spawn(PoolType.VFX_Explore, this.node.getWorldPosition(), 0);
  }

  //hàm di chuyển sang vị trí mới
  public moveTo(
    target: cc.Vec3,
    duration: number,
    isWorldSpace: boolean
  ): void {
    // Lấy vị trí target position của node
    const targetPosition = isWorldSpace
      ? this.node.getLocalPosition(target)
      : target;

    // Tạo một tween để di chuyển node từ vị trí hiện tại đến vị trí mới (position)
    cc.tween(this.node)
      .to(duration, { position: targetPosition }, { easing: "linear" })
      .start();
  }
}
