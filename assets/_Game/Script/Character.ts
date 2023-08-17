// Learn TypeScript:
//  - https://docs.cocos.com/creator/manual/en/scripting/typescript.html
// Learn Attribute:
//  - https://docs.cocos.com/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - https://docs.cocos.com/creator/manual/en/scripting/life-cycle-callbacks.html

import PoolMember from "./Pool/PoolMember";

const { ccclass, property } = cc._decorator;

@ccclass
export default class Character extends PoolMember {
  @property(cc.Node)
  private sprite: cc.Node = null;

  private hp: number;
  //khai bao action
  // public onDeathAction: (c:Character) => void;

  //getter
  get isDead(): boolean {
    return this.hp <= 0;
  }

  //khởi tạo
  public onInit(hp: number) {
    this.hp = hp;
  }

  public onHitEffect(object) {
    //tint màu đỏ
    object.color = cc.color(255, 70, 70);
    this.scheduleOnce(() => {
      //tint lại màu
      object.color = cc.Color.WHITE;
    }, 0.1);

    //tint màu cho các con
    if (object.children) {
      object.children.forEach((child) => {
        this.onHitEffect(child);
      });
    }
  }

  //nhận damage
  public onHit(damage: number) {
    if (!this.isDead) {
      this.hp -= damage;
      if (this.isDead) {
        this.onDeath();
      }
    }
    this.onHitEffect(this.sprite);
  }

  protected onDeath() {
    // this.onDeathAction(this);
  }
}
