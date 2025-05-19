export default function(module, ...args){
    if (!module) {
        console.error("Module is undefined or null!");
        return null;
    }
    return new module(...args);
};
