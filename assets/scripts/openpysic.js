cc.Class({
    extends: cc.Component,


    onLoad() {
        cc.director.getPhysicsManager().enabled = true;
    }
})