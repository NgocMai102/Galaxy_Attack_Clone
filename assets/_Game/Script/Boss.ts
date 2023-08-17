import Character from "./Character";
import Enemy from "./Enemy";
import LevelManager from "./Manager/LevelManager";
import SoundManager, { AudioType } from "./Manager/SoundManager";
import SimplePool, { PoolType } from "./Pool/SimplePool";

const { ccclass, property } = cc._decorator;

@ccclass
export default class Boss extends Enemy {
  private isShooting = false;
  public bulletPoints: cc.Node[] = [];
  private moveDistance: number = 200; // Khoảng cách di chuyển
  private moveDuration: number = 1.5;

  @property({
    type: [cc.Node],
    tooltip: "bulletPoints",
  })
  

  public onInit(hp: number) {
    super.onInit(hp);
    this.isShooting = false;
  }

  public onLoad() {
    this.onReadyMove();
  }

  public onReadyMove() {
    this.isShooting = true;
    cc.tween(this.node)
      .delay(10)
      .call(() => {
        this.startMove(this.node, this.moveDuration, this.moveDistance);
      })
      .start();
  }

  public startMove(
    object: any,
    moveDuration: number,
    moveDistance: number
  ): void {
    cc.tween(object)
      .to(moveDuration, { x: moveDistance }, { easing: "outQuint" })
      .to(moveDuration, { x: -moveDistance }, { easing: "outQuint" })
      .union() //Cho phep nhieu action hoat dong
      .repeatForever() // Lặp lại vô hạn
      .start();
  }

  //move
}
