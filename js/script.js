"use strict";

window.addEventListener('DOMContentLoaded', ()=>{

    const dE = {
        settingButton: document.querySelector("#setting"),
        settingWindow: document.querySelector(".settings_window"),
        backBlack: document.querySelector(".hide_block"),
        modeButtonContainer: document.querySelector(".mode_buttons_container"),
        minutes: document.querySelector(".minutes"),
        seconds: document.querySelector(".seconds"),
        startButton: document.querySelector(".start"),
        modeButtons: document.querySelectorAll(".mode_button"),
        startCaption: document.querySelector(".start_caption"),
        body: document.querySelector("body")



    }
    const isCheckboxOrRadio = (type) => ['checkbox', 'radio'].includes(type);

    const formElements = {};
    const {settingsForm} = document.forms;
    const retrieveFormValues = (event)=>{
        if (event) event.preventDefault();

        for (let field of settingsForm){
            const {name} = field;

            if (name){
                const {type, checked, value} = field;

                formElements[name] = isCheckboxOrRadio(type) ? checked : value;
            }

        }
        buttonActions.setTime();
        console.log(formElements);



    }
    settingsForm.addEventListener("submit", retrieveFormValues);

    




    /* смена класса активности на кнопке */
    function chooseButton(event){

        const target = event.target;

        if (target && target.nodeName === "BUTTON"){
            buttonActions.deleteActiveClass(dE.modeButtons);
            dE.modeButtons.forEach((button, index)=>{
                if(button === target){
                    buttonActions.addActiveClass(dE.modeButtons, index);
                    changeThemeColor(dE.body, index);
                    changeThemeColor(dE.startCaption, index);
                    buttonActions.setTime(index);

                }
            })
        }
    }



    const buttonActions = {

        addActiveClass: function (modeButtons, index){
            modeButtons[index].classList.add("chosen_mode_button");
        },

        deleteActiveClass: function (modeButtons){
            modeButtons.forEach(button =>{
                button.classList.remove("chosen_mode_button")
            });
        },

        toggleStartButtonCaption: function (){
            const buttonCaption = dE.startButton.querySelector(".start_caption");
            dE.startButton.classList.toggle("stop");
            if (buttonCaption.innerText === "START"){
                buttonCaption.innerText = "STOP";
            }else{
                buttonCaption.innerText = "START";
            }
        },

        setTime: function (index){

            if (index === 0){
                dE.minutes.textContent = addZero(formElements.pomodoroTime);
            } else if (index === 1){

                dE.minutes.textContent = addZero(formElements.sBreakTime);
            }else {
                dE.minutes.textContent = addZero(formElements.lBreakTime);
            }
            dE.seconds.textContent = "00";
        }

    }


    function changeThemeColor(element, index){
        element.classList.remove("red", "blue", "green");
        if (index === 0){
            element.classList.add("red");
        } else if (index === 1){
            element.classList.add("blue");
        }else{
            element.classList.add("green");
        }
    }



    /*    time    */


    dE.startButton.addEventListener("click", startTimer);
    const clickSound = new Audio('../audio/button-16.mp3');

    let timerInterval;
    function startTimer(){

        if (dE.startButton.classList.contains("stop")) {
            clearInterval(timerInterval);
            clickSound.pause();
            clickSound.currentTime = 0.0;
            clickSound.play();
        }else {
            timerInterval = setInterval(setTime, 1000);
            clickSound.play();
        }
        buttonActions.toggleStartButtonCaption();

        function setTime(){
            let sec = +dE.seconds.textContent,
                min = +dE.minutes.textContent;

            if (sec > 0){
                sec--;
                sec = addZero(sec);
                dE.seconds.textContent = sec;
            }else if (min > 0) {
                min--;
                sec = 59;
                min = addZero(min);
                dE.minutes.textContent = min;
                dE.seconds.textContent = sec;
            }
        }
    }

    function addZero(num) {
        if (num < 10) {num = "0"+num}
        return num;
    }

    /* setting window */
    dE.settingButton.addEventListener("click",fun);
    dE.backBlack.addEventListener("click",fun);

    function fun(){
        dE.settingWindow.classList.toggle("hide_block");
        dE.classList.toggle("hide_block");
    }

    function startApp(){
        retrieveFormValues();
        dE.modeButtonContainer.addEventListener("click", chooseButton);
        buttonActions.setTime(0);

    }
    startApp();
});






