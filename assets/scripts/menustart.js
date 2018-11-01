cc.Class({
    extends: cc.Component,

onLoad() {
    cc.director.preloadScene('01');
    
},
    gamestart() {
               cc.director.loadScene('01');
        cc.director.preloadScene
    },

    gamecontinue() {
        cc.director.loadScene('01');
    }
})