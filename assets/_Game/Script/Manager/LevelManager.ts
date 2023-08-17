// Learn TypeScript:
//  - https://docs.cocos.com/creator/manual/en/scripting/typescript.html
// Learn Attribute:
//  - https://docs.cocos.com/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - https://docs.cocos.com/creator/manual/en/scripting/life-cycle-callbacks.html

import Character from "../Character";
import Enemy from "../Enemy";
import Boss from "../Boss";
import SimplePool, { PoolType } from "../Pool/SimplePool";
import Ship from "../Ship";
import UIManager from "./UIManager";

const { ccclass, property } = cc._decorator;

@ccclass
export default class LevelManager extends cc.Component {
  // singleton
  private static ins: LevelManager;
  public static get Ins(): LevelManager {
    return LevelManager.ins;
  }

  protected onLoad(): void {
    LevelManager.ins = this;
  }
  //------------------------------------

  //Level Manager sẽ điều khiển luồng chính trong game

  @property(Ship)
  public ship: Ship = null;

  @property(cc.Node)
  public stage_1: cc.Node[] = [];

  @property(cc.Node)
  public stage_2: cc.Node[] = [];

  @property(cc.Node)
  public stage_3: cc.Node[] = [];

  @property(cc.Node)
  public stage_4: cc.Node[] = [];

  private list: Character[] = [];
  private isBooster: boolean;
  private stage: number = 0;

  public onReset(): void {
    //xoa het cac Char
    this.list.splice(0, this.list.length);
    this.stage = 0;
    this.start();
  }
  public resetAll(): void {
    UIManager.Ins.closeAll();
    SimplePool.collectAll();
    this.onReset();
  }

  protected start(): void {
    this.onLoadStage_1();
    this.isBooster = false;
    //di chuyển tàu lên xong đợi  người chơi điều khiển
    this.ship.onAwake();
  }

  public onLoadStage_1(): void {
    for (let i = 0; i < this.stage_1.length; i++) {
      let e = SimplePool.spawnT<Enemy>(
        PoolType.Enemy_1,
        this.stage_1[i].getWorldPosition().add(cc.Vec3.UP.mul(1000)),
        0
      );
      e.moveTo(this.stage_1[i].getWorldPosition(), 1, true);
      this.list.push(e);
      e.onInit(40);
    }
  }

  public onLoadStage_2(): void {
    for (let i = 0; i < this.stage_2.length; i++) {
      let e = SimplePool.spawnT<Enemy>(
        PoolType.Enemy_2,
        this.node.getWorldPosition().add(cc.Vec3.UP.mul(1000)),
        0
      );
      e.moveTo(this.stage_2[i].getWorldPosition(), 0.5, true);
      this.list.push(e);
      e.onInit(1);
    }
  }

  public onLoadStage_3(): void {
    //bay từ 2 bên sang

    //Trái sang
    for (let i = 0; i < 15; ++i) {
      let e = SimplePool.spawnT<Enemy>(
        PoolType.Enemy_2,
        this.node.getWorldPosition().add(new cc.Vec3(-1000, 0, 0)),
        0
      );
      e.moveTo(this.stage_3[i].getWorldPosition(), 0.5, true);
      this.list.push(e);
      e.onInit(1); //70
    }

    //Phải sang
    for (let i = 15; i < this.stage_3.length; ++i) {
      let e = SimplePool.spawnT<Enemy>(
        PoolType.Enemy_2,
        this.node.getWorldPosition().add(new cc.Vec3(1000, 0, 0)),
        0
      );
      e.moveTo(this.stage_3[i].getWorldPosition(), 0.5, true);
      this.list.push(e);
      e.onInit(1); //70
    }
  }

  public onLoadStage_4(): void {
    let e = SimplePool.spawnT<Boss>(
      PoolType.Boss_1,
      this.node.getWorldPosition().add(cc.Vec3.UP.mul(1000)),
      0
    );
    e.moveTo(this.stage_4[0].getWorldPosition(), 0.8, true);
    this.list.push(e);
    e.onInit(10000);
  }

  onFinish() {
    //kết thúc màn game di chuyển tàu lên thẳng phía trên
    this.ship.onFinish();
    //show UI end card
  }

  //enemy death sẽ gọi vào hàm này
  //nếu ship chết thì cần viết 1 func khác để ship gọi vào
  public onEnemyDeath(c: Character): void {
    //remove enemy ra khỏi list
    let index = this.list.indexOf(c);
    if (index != -1) {
      this.list.splice(index, 1);
    }

    //nếu kết thúc stage thì next stage
    if (this.list.length == 0) {
      this.stage++;
      switch (this.stage) {
        case 0:
          this.onLoadStage_1();
          break;
        case 1:
          this.onLoadStage_2();
          break;
        case 2:
          this.onLoadStage_3();
          break;
        case 3:
          this.onLoadStage_4();
          break;
        default:
          //kết thúc stage thì kết thúc game
          this.onFinish();
          break;
      }
    }

    //enemy đầu tiên chết sẽ tạo booster ra
    if (!this.isBooster) {
      this.isBooster = true;
      SimplePool.spawn(PoolType.Booster, c.node.getWorldPosition());
    }
  }
}
