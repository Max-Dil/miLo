const canvas = document.getElementById("game");
canvas.width = 800;
canvas.height = 600;
const ctx = canvas.getContext('2d');
window._draw = {"0": canvas, "1": ctx}

const m = {};

m.newCircle = function(obj) {
    ctx.save();

    ctx.translate(obj.x, obj.y);
    ctx.rotate(obj.angle * Math.PI / 180);
    ctx.scale(obj.xScale, obj.yScale);

    ctx.fillStyle = `rgba(${
        obj.color['0'] * 255}, ${
        obj.color['1'] * 255}, ${
        obj.color['2'] * 255}, ${obj.color['3']})`;

    ctx.beginPath();
    ctx.arc(0, 0, obj.radius, 0, Math.PI * 2);
    ctx.fill();

    ctx.restore();
};

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

let offsetX = 0, offsetY = 0;

m.newHitboxs = function(group) {
    if (!group.isVisible) return;

    ctx.save();

    offsetX += group.x;
    offsetY += group.y;

    for (const i in group.obj) {
        const obj = group.obj[i];
        if (!obj.isVisible) continue;

        if (obj._type === 'newGroup') {
            ctx.save();
            m.newHitboxs(obj);
            ctx.restore();
            continue;
        }

        if (obj.body && obj.fixture) {
            const body = obj.body;
            const position = body.getPosition();
            const bx = position.x;
            const by = position.y;
            const bAngle = body.getAngle();

            const gAngle = (group.angle || 0) * Math.PI / 180;
            const transformedAngle = bAngle - gAngle;

            if (body.getType() === "static") {
                ctx.strokeStyle = "rgba(255, 0, 0, 1)";
            } else {
                if (body.isActive()) {
                    ctx.strokeStyle = "rgba(0, 255, 0, 1)";
                } else {
                    ctx.strokeStyle = "rgba(128, 128, 128, 1)";
                }
            }
    
            ctx.save();
            ctx.translate(bx + offsetX, by + offsetY);
            ctx.rotate(transformedAngle);
            ctx.beginPath();

            if (obj.bodyOptions) {
                if (obj.bodyOptions.shape === "rect") {
                    ctx.rect(
                        -obj.bodyOptions.width/2, 
                        -obj.bodyOptions.height/2, 
                        obj.bodyOptions.width, 
                        obj.bodyOptions.height
                    );
                } else if (obj.bodyOptions.shape === "circle") {
                    ctx.arc(0, 0, obj.bodyOptions.radius, 0, Math.PI * 2);
                } else if (obj.bodyOptions.shape === "chain" && obj.bodyOptions.points) {
                    const points = obj.bodyOptions.points;
                    if (points.length > 0) {
                        ctx.moveTo(points[0], points[1]);
                        for (let i = 2; i < points.length; i += 2) {
                            ctx.lineTo(points[i], points[i+1]);
                        }
                    }
                } else if (obj.bodyOptions.shape === "edge") {
                    ctx.moveTo(obj.bodyOptions.x1, obj.bodyOptions.y1);
                    ctx.lineTo(obj.bodyOptions.x2, obj.bodyOptions.y2);
                } else if (obj.bodyOptions.shape === "polygon" && obj.bodyOptions.vertices) {
                    const vertices = obj.bodyOptions.vertices;
                    if (vertices.length > 0) {
                        ctx.moveTo(vertices[0], vertices[1]);
                        for (let i = 2; i < vertices.length; i += 2) {
                            ctx.lineTo(vertices[i], vertices[i+1]);
                        }
                        ctx.closePath();
                    }
                }
            }
            
            ctx.stroke();
            ctx.restore();
        }
    }

    offsetX -= group.x;
    offsetY -= group.y;
    ctx.restore();
};

const draw = function() {
    ctx.fillStyle = "black";
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    m.newGroup(window.milo.display.game);

    if (window.milo.display?.renderMode === "hybrid") {
        ctx.save();
        ctx.lineWidth = 1;
        offsetX = 0;
        offsetY = 0;
        m.newHitboxs(window.milo.display.game);
        ctx.restore();
    }

    if (window.milo.draw) {
        window.milo.draw();
    }
};

export {draw};