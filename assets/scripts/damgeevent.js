cc.Class({
    extends: cc.Component,

    properties: {
        attack: 0,
        life: 0,
        time: 0,
    },

    onLoad() {
        this.gm = cc.director.getScene().getChildByName('Canvas').getComponent('player');

    },

    damged() {
        //  cc.log('attack');
        this.gm.bloodshow(this.attack);
    },
    died() {
        this.node.active = false;
        this.node.destroy();
    },

    onBeginContact: function (contact, selfCollider, otherCollider) {
        //如果碰到弓箭，计算伤害，弓箭消失，伤害大于本身值，死亡消失
        //问题：出现动画连续播放，2。小怪死而复活事件，
        //调整，增加this.life判定解决上述2个问题，花费时间3个小时
        
        if (otherCollider.node.groupIndex == 1) {
            this.life -= this.gm.arrowdamge();
            if (this.life <= 0) {
                selfCollider.node.removeComponent(cc.RigidBody);
                selfCollider.node.stopAllActions();
                var anim = selfCollider.node.getComponent(cc.Animation);
                var clips = anim._clips;
                this.animstate = anim.play(clips[2].name);
                var name = selfCollider.node.name;
                switch (name) {
                    case 'pike':
                        this.gm.getscoreAll(10);
                        break;
                    case 'sword':
                        this.gm.getscoreAll(20);
                        break;
                    case 'war':
                        this.gm.getscoreAll(30);
                        break;
                    case 'barbarian':
                        this.gm.getscoreAll(40);
                        break;
                    case 'horse':
                        this.gm.getscoreAll(50);
                        break;
                    }
                    this.gm.EnemyCount(1);
            }
            otherCollider.node.active = false;
        }
    },


})