import Character from "./Character";
import Enemy from "./Enemy";
import Bullet from "./Bullet";
import LevelManager from "./Manager/LevelManager";
import SoundManager, { AudioType } from "./Manager/SoundManager";
import SimplePool, { PoolType } from "./Pool/SimplePool";

const { ccclass, property } = cc._decorator;

@ccclass
export default class Boss extends Enemy {
  private isShooting = false;

  private moveDistance: number = 200; // Khoảng cách di chuyển
  private moveDuration: number = 1.5;

  @property({
    type: [cc.Node],
    tooltip: "bulletPoints",
  })
  public bulletPoints: cc.Node[] = [];

  public onInit(hp: number) {
    super.onInit(hp);
    this.isShooting = false;
  }

  public onLoad() {
    this.onReadyMove();
  }

  public onReadyMove() {
    this.moveIdle(this.node, 1, 20),
      cc
        .tween(this.node)
        .delay(10)
        .call(() => {
          this.startMove(this.node, this.moveDuration, this.moveDistance);
        })
        .start();
  }

  public moveIdle(object: any, moveDuration: number, moveDistance: number) {
    cc.tween(object).delay(4).start(),
      cc
        .tween(object)
        .to(moveDuration, { y: 610 + moveDistance }, { easing: "outQuint" })
        .to(moveDuration, { y: 610 - moveDistance }, { easing: "outQuint" })
        .union() //Cho phep nhieu action hoat dong
        .repeat(5)
        .start();
  }

  public startMove(
    object: any,
    moveDuration: number,
    moveDistance: number
  ): void {
    this.isShooting = true;
    cc.tween(object)
      .to(moveDuration, { x: moveDistance }, { easing: "outQuint" })
      .to(moveDuration, { x: -moveDistance }, { easing: "outQuint" })
      .union() //Cho phep nhieu action hoat dong
      .repeatForever() // Lặp lại vô hạn
      .start();
  }

  public poolTypeBullet: PoolType = PoolType.Bullet_1;
  private shoot(): void {
    SoundManager.Ins.PlayClip(AudioType.FX_Bullet);
    for (let i = 0; i < this.bulletPoints.length; i++) {
      (
        SimplePool.spawn(
          this.poolTypeBullet,
          this.bulletPoints[i].getWorldPosition(),
          this.bulletPoints[i].angle
        ) as Bullet
      ).onInit(20, -1);
    }
  }

  private timer: number = 0;

  update(dt: number) {
    if (this.isShooting) {
      //mỗi 0.2s bắn 1 lần
      if (this.timer <= 0) {
        this.timer += 1;
        this.shoot();
      }
      this.timer -= dt;
    }
  }
}
