var enemyinfo = cc.Class({
    name: 'enemyinfo',
    properties: {
        info: cc.Prefab,
        hp: 0,
        atc: 0,
    }

});
cc.Class({
    extends: cc.Component,

    properties: {
        enemyinfo: {
            type: enemyinfo,
            default: []
        },
        pos: {
            type: cc.Node,
            default: []
        },
        townpos: cc.Node,
    },

    onLoad() {

    },


    rndpos(level) {
        var rnd = cc.random0To1() * this.pos.length;
        rnd = Math.floor(rnd);
        //var dis = Math.abs(this.townpos.x - this.pos[rnd]);
        this.rndenemy(this.pos[rnd], level);
    },

    rndenemy(pos, level) {
        var len = this.enemyinfo.length; //当前敌人种类长度
        if (level >= len) {
            level = len;
        }
        var rnd = cc.random0To1() * level; //随机种类敌人
        rnd = Math.floor(rnd);
        var node = cc.instantiate(this.enemyinfo[rnd].info); //生成敌人
        this.node.addChild(node);
        var script = node.getComponent('damgeevent');
        node.x = pos.x;
        node.y = pos.y
        this.enemymove(pos, node, script.time);
    },

    enemymove(pos, node, time) {
        var dis = Math.abs(this.townpos.x - pos.x);
        var act1 = cc.moveBy(time, cc.p(dis, 0));
        var anim = node.getComponent(cc.Animation);
        var clips = anim._clips;
        //  cc.log(animstate.length);
        // cc.log(clips[1]);
        var act2 = cc.callFunc(function () {
            anim.play(clips[1]._name);
        }, this);
        var seq = cc.sequence(act1, act2);
        node.runAction(seq);
    }
})