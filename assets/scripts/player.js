cc.Class({
    extends: cc.Component,

    properties: {
        arrow: {//不同类型的箭
            type: cc.Node,
            default: [],
        },
        player: cc.Node,
        sight: 0, //发射力度
        shoottime: 0, //发射间隔
        blood: cc.ProgressBar,
        enemy: cc.Node,
        upgrade_node: cc.Node,
        money: cc.Label,
        highscoretext: cc.Label,
        gameovenode: cc.Node,
        levelLabel: cc.Label,
    },





    onLoad: function () {
        this.node.on(cc.Node.EventType.TOUCH_START, function (event) {
            let touchLoc = event.touch.getLocation();
            if (touchLoc.x >= this.pos.x || this.isshoot == true) {
                // 如果在塔后面就不射箭
                return;
            }
            this.playeranim.play();
            this.onTouchBegan(event);//射箭
            this.isshoot = true;
            this.durtime = 0;
        }, this);
        this.arrowBodies = [];
        this.isshoot = false; //是否射出箭
        this.durtime = 0; //持续时间
        this.force = 1;//弓箭伤害
        this.score_all = 0;
        this.level = 0;//初始关卡
        this.enemy_creator = this.enemy.getComponent('enemy');
        this.enemycount = 0;//统计敌人数量
        this.levelcount = 0;//关卡数量
        this.num = 1; //敌人种类
        this.highscore = 0;
        this.upnode = this.upgrade_node.getComponent('upgrade');
        cc.log(this.blood.progress);
    },
    start() {
        var node = this.player.parent;
        this.pos = node.convertToWorldSpaceAR(cc.p(this.player.x, this.player.y));//获取世界坐标
        this.playeranim = this.player.getComponent(cc.Animation);//玩家动画
       
    },

    onTouchBegan: function (event) {//射箭

        let touchLoc = event.touch.getLocation();
        this.player.scale = cc.p(-1, -1);
        let node = cc.instantiate(this.arrow[0]);
        node.x = this.pos.x;
        node.y =this.pos.y;
        node.active = true;
        // cc.log('touchloc:' + touchLoc.x);
        // cc.log('touchloc:' + touchLoc.y);
        // cc.log('touchloc:' + event.getLocation());
        // cc.log('node:' + node.position);
        let vec = cc.v2(touchLoc).sub(node.position);
        node.rotation = -Math.atan2(vec.y, vec.x) * 180 / Math.PI;
        this.player.rotation = node.rotation;
     //   cc.log(node.rotation);
        cc.director.getScene().addChild(node);
       // cc.log('my name ' + cc.director.getScene().name);
        //  this.node.addChild(node);
        let distance = vec.mag();
        let velocity = vec.normalize().mulSelf(this.sight);

        let arrowBody = node.getComponent(cc.RigidBody);
        arrowBody.linearVelocity = velocity;

        this.arrowBodies.push(arrowBody);
        
    },

bloodshow(attack) {
    if(this.blood.progress <= 0){
        this.gameove();
        return;
    }
    this.blood.progress -= attack/500;
   
},
bloodadd() {
    if(this.blood.progress >= 1) {
        return;
    }
    this.blood.progress += 50/500;
},
gameove() {
    this.gameovenode.active = true;
    this.highscoretext.string = '总分：' + this.highscore;
},

//获得分数
getscoreAll(score) {
    this.highscore += score;
    this.score_all += score;
  cc.log('总分:' +this.score_all);
  this.money.string = this.score_all + '';
  
},
setScore(score) {
    this.score_all = score;
    this.money.string = score + '';
},

updategrad(sight,shoottime,force) {
    this.sight += sight;
    this.shoottime -= shoottime;
    this.force += force;
},
arrowdamge() {//返回伤害
    return this.force;
},
EnemyCount(count) {
    //计算敌人数量，如果敌人数量大于等于关卡数量，关卡成功，进入升级界面
    this.enemycount += count;
    cc.log('enemycount'+ this.enemycount);
    if(this.enemycount >= this.levelcount) {
        this.upstate();
        this.enemycount = 0;
    }
},

upstate() {//
    this.blood.progress = 1;
    this.upgrade_node.active = true;
    this.score_all = this.score_all + (this.level-1) * 10;
    this.upnode.setScore(this.score_all);
    this.removearrow();
   // this.menustart();
},
removearrow() {//移除所有的弓箭
    this.arrowBodies.splice(0,this.arrowBodies.length);
    var node = cc.director.getScene().children;
    for(var i = 0; i < node.length; i++) {
        cc.log("node.name:" + node[i].name);
        if(node[i].groupIndex == 1) {
            node[i].destroy();
        }
    }
   
},
gameStart(level) {//游戏开始
    this.level += level;
    this.levelLabel.string = '当前关卡:' + this.level;
        if(this.level % 5 ==0) {
            this.num ++;
        }
    cc.log('levelcount:' + this.level);
    this.levelcount = this.level + 1;
    this.schedule(function() {
        this.enemy_creator.rndpos(this.num);
    },2,this.level,1);
},
menustart() {//菜单目录
    cc.director.loadScene('01');
},
menuretrun() {
    cc.director.loadScene('menu');
},

    // called every frame, uncomment this function to activate update callback
    update: function (dt) {
        this.durtime += dt;
        if (this.durtime >= this.shoottime) {
            this.isshoot = false;

        }
        if(this.arrowBodies == null){
            return;
        }
        let dragConstant = 0.1;
        let arrowBodies = this.arrowBodies;
        for (let i = 0; i < arrowBodies.length; i++) {
            let arrowBody = arrowBodies[i];
            let velocity = arrowBody.linearVelocity;
            let speed = velocity.mag();
            if (speed === 0) continue;
            let direction = velocity.normalize();

            let pointingDirection = arrowBody.getWorldVector(cc.v2(1, 0));
            let flightDirection = arrowBody.linearVelocity;
            let flightSpeed = flightDirection.mag();
            flightDirection.normalizeSelf();

            let dot = cc.pDot(flightDirection, pointingDirection);
            let dragForceMagnitude = (1 - Math.abs(dot)) * flightSpeed * flightSpeed * dragConstant * arrowBody.getMass();

            let arrowTailPosition = arrowBody.getWorldPoint(cc.v2(-80, 0));
            arrowBody.applyForce(flightDirection.mul(-dragForceMagnitude), arrowTailPosition, false);
        }
    },
})