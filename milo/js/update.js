const m = {}

m.newGroup = function(group, dt) {
    if (group.isUpdate) {
        for (const i in group.obj) {
            const obj = group.obj[i];

            if (obj.isUpdate){
                if (obj._type == "newGroup") {
                    m.newGroup(obj, dt);
                } else if (obj.body) {
                    if (obj.body.getType() == "dynamic") {
                        const [bodyX, bodyY, bodyAngle] = [obj.body.getPosition().x, obj.body.getPosition().y, obj.body.getAngle()];
                    
                        if (obj.x != obj.oldBodyX) {
                            const deltaX = obj.x - obj.oldBodyX;
                            obj.body.setPosition({ x: bodyX + deltaX, y: bodyY });
                        }
                    
                        if (obj.y != obj.oldBodyY) {
                            const deltaY = obj.y - obj.oldBodyY;
                            obj.body.setPosition({ x: bodyX, y: bodyY + deltaY });
                        }
                    
                        if (obj.angle != obj.oldBodyAngle) {
                            const deltaAngle = (obj.angle - obj.oldBodyAngle) * Math.PI / 180;
                            obj.body.setAngle(bodyAngle + deltaAngle);
                        }
                    
                        const newBodyX = obj.body.getPosition().x;
                        const newBodyY = obj.body.getPosition().y;
                        const newBodyAngle = obj.body.getAngle();
                    
                        obj.x = newBodyX - obj.bodyOptions.offsetX;
                        obj.y = newBodyY - obj.bodyOptions.offsetY;
                        obj.angle = (newBodyAngle / Math.PI) * 180;
                    
                        obj.oldBodyX = obj.x;
                        obj.oldBodyY = obj.y;
                        obj.oldBodyAngle = obj.angle;
                    
                    } else {
                        obj.body.setPosition({ x: obj.x + obj.bodyOptions.offsetX + obj.group.x, 
                        y: obj.y + obj.bodyOptions.offsetY + obj.group.y });
                        obj.body.setAngle((obj.angle * Math.PI / 180) + obj.group.angle);
                    };
                }
            };
        };
    };
};

let frameCount = 0;
let lastTime = performance.now();
let fps = 0;

const update = function(dt){
    const milo = window.milo;

    const now = performance.now();
    const delta = now - lastTime;
    frameCount++;

    if (delta >= 1000) {
        fps = frameCount;
        frameCount = 0;
        lastTime = now;

        if (document.getElementById("fpsCounter")) {
            document.getElementById("fpsCounter").innerText = "FPS: " + fps;
        }
    }

    m.newGroup(milo.display.game, dt);

    milo.timer.update(dt);

    const worlds = milo.physics.worlds;
    for (const i in worlds) {
        const world = worlds[i];
        if (world.isUpdate) {
            world.world.step(dt, 10, 10);
        };
    };

    if (milo.update) {
        milo.update(dt);
    };

    if (milo.__update) {
        milo.__update.update(dt);
    };
};

export {update};