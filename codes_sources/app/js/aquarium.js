$(function () {

    console.log("trigger event");
    let event = new Event('load_aquarium');
    document.dispatchEvent(event);
});
