const canvas = document.getElementById("game");
canvas.width = 800;
canvas.height = 600;
const ctx = canvas.getContext('2d');
window._draw = {"0": canvas, "1": ctx}

const m = {};

m.newRect = function(obj) {
    ctx.save();

    ctx.translate(obj.x, obj.y);
    ctx.rotate(obj.angle * Math.PI / 180);
    ctx.scale(obj.xScale, obj.yScale);

    ctx.fillStyle = `rgba(${
        obj.color['0'] * 255}, ${
        obj.color['1'] * 255}, ${
        obj.color['2'] * 255}, ${obj.color['3']})`;

    ctx.fillRect(-obj.width/2, -obj.height/2, obj.width, obj.height);

    ctx.restore();
};

m.newGroup = function(obj) {
    if (obj.isVisible) {
        ctx.save();
        ctx.translate(obj.x, obj.y);
        ctx.rotate(obj.angle * Math.PI / 180);
        ctx.scale(obj.xScale, obj.yScale);

        for (const i in obj.obj) {
            const obj2 = obj.obj[i];
            
            if (obj2.isVisible){
                ctx.save();
                m[obj2._type](obj2);
                ctx.restore();
            };
        };

        ctx.restore();
    };
};

const draw = function() {
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    m.newGroup(window.milo.display.game);

    if (window.milo.draw) {
        window.milo.draw();
    };
};

export {draw};