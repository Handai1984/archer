cc.Class({
    extends: cc.Component,

    properties: {
        skill_full: cc.SpriteFrame,
        plus: cc.SpriteFrame,
        plus1: cc.SpriteFrame,
        skill_none: cc.SpriteFrame,
        skill_empty: {
            type: cc.Node,
            default: [],
        },
        player: cc.Node,
        money: cc.Label,
        lable_sight: cc.Label,
        lable_fast: cc.Label,
        label_force: cc.Label,
    },

    onLoad() {
        this.gm = this.player.getComponent('player');
        this.score = 0;
        this.score_sight = 36;
        this.score_fast =70;
        this.score_force = 80;
    },

    setScore(score) {
        this.score = score;
        this.displaymoney();
    },
    displaymoney() {
        cc.log('hahahahaha');
        this.money.string = this.score + '';
    },

    addskill(skill) {
     //   cc.log(skill.length);
        for (var i = 0; i < skill.length; i++) {
            var sprite = skill[i].getComponent(cc.Sprite);
            if (skill[i + 1].name == 'plus') {
                sprite.spriteFrame = this.skill_full;
                sprite = skill[i + 1].getComponent(cc.Sprite);
                sprite.spriteFrame = this.plus;
                skill[i + 1].getComponent(cc.Button).interactable = false;
                return;
            }
            // cc.log(sprite);
            if (sprite.spriteFrame != this.skill_full) {
                sprite.spriteFrame = this.skill_full;
                return;
            }
        }
    },

    // townrepair(skill,num) {
    //     if(num == 0) return;
    //     for (var i = skill.length; i >= num; i--) {
    //         var sprite = skill[i].getComponent(cc.Sprite);
    //         if (skill[i].name == 'plus') {
    //             sprite.spriteFrame = this.plus1;
    //             skill[i].getComponent(cc.Button).interactable = true;
               
    //         }
    //         // cc.log(sprite);
    //         if (sprite.spriteFrame == this.skill_full) {
    //             sprite.spriteFrame = this.skill_none;
                
    //         }
    //     }
    // },
    // townbroken(num) {
    //     this.townrepair(this.skill_empty[3].children,num);
    // },

    button_sight() {
         
          if(this.score - this.score_sight < 0) return;
          this.score -= this.score_sight;
          this.score_sight += 36;
          this.displaymoney();
          this.lable_sight.string = this.score_sight + '';
        this.addskill(this.skill_empty[0].children);
        this.gm.updategrad(35,0,0);
    },

    button_start() {
        this.gm.gameStart(1);
        this.gm.setScore(this.score);
        this.node.active = false;
    },

    button_fast() {
        if(this.score - this.score_fast < 0) return;
          this.score -= this.score_fast;
          this.score_fast += 70;
          this.lable_fast.string = this.score_fast + '';
          this.displaymoney();
        this.addskill(this.skill_empty[1].children);
        this.gm.updategrad(0,0.1,0);
    },
    button_force(){
        if(this.score - this.score_force < 0) return;
          this.score -= this.score_force;
          this.score_force += 80;
          this.label_force.string = this.score_force + '';
          this.displaymoney();
        this.addskill(this.skill_empty[2].children);
        this.gm.updategrad(0,0,0.25);
    },
    button_repair(){
        this.addskill(this.skill_empty[3].children);

    },


})