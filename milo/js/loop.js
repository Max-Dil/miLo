import {update} from "/milo/js/update.js";
import {draw} from "/milo/js/draw.js";
const exports = {};
let lastTime = 0.01;
exports.init = function(milo) {
    window.milo = milo;
    const loop = function(timestamp) {
        const dt = (timestamp - lastTime) / 1000;
        lastTime = timestamp;
        update(dt);
        draw();
        requestAnimationFrame(loop);
    };
    requestAnimationFrame(loop);
    return loop;
}
export default exports;