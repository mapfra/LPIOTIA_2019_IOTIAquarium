$(function () {

    console.log("trigger event");
    let event = new Event('load_action_button_aquarium');
    document.dispatchEvent(event);
});