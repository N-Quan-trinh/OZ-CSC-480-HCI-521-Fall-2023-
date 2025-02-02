"use strict";
import * as JSStyles from "./jsStyles.js";
import * as NetworkReq from "./networkReq.js";
import * as Login from "./login.js";
import * as Tools from "./tools.js";
import * as Home from "./home.js";
import { GlobalRef } from "./globalRef.js";
const globals = new GlobalRef();


window.onload = ()=>{
    //Run the JS nessary for the page
    var currentPage = Tools.getEndOfURL();
    switch (currentPage){
        case "": loginInit(); break;
        case "index.html": loginInit(); break;
        case "home.html": homeInit(); break;
    }
}

function loginInit(){
    var submitButton = document.getElementById("submit");
    submitButton.addEventListener("click", ()=>{
        var passwordMatch = true;
        var emptyError = false;
        var validError = false;
        var usernameError = false;
        var newAccount = submitButton.getAttribute("newAccount");
        var currentAccountData = Login.getAccountData(newAccount);
        var currentEmptyErrorMessages = Login.getEmptyErrorMessages(newAccount);
        var currentMatchErrors = document.getElementsByClassName("passwordErrorNoMatch");
        Tools.clearErrors();

        if(newAccount === "false"){
            emptyError = Login.checkForEmptyInputs(currentAccountData, currentEmptyErrorMessages, false);
        }
        else if(newAccount === "true"){
            emptyError = Login.checkForEmptyInputs(currentAccountData, currentEmptyErrorMessages, true);
            validError = Login.checkVaildPassword(
                currentAccountData.password.value, 
                globals.regExSpecChar,
                globals.regExNum
            );
            usernameError = Login.checkValidUserName(currentAccountData.username.value);
            passwordMatch = Login.checkForPasswordMatch(currentAccountData, currentMatchErrors);

        }

        if(emptyError === false && validError === false && passwordMatch === true && usernameError === false){
            var jsonData = Tools.formatJSONData(
                [currentAccountData.username, currentAccountData.password], 
                ["username", "password"]
            );
            if(newAccount === "true"){
                NetworkReq.fetchPost(
                    globals.regPath, 
                    jsonData,
                    Tools.navToHome
                );
            } else {
                NetworkReq.fetchPost(
                    globals.logInPath, 
                    jsonData,
                    Tools.navToHome
                );
            }
        }
    });


    var newAccountButton = document.getElementById("newAccount");
    newAccountButton.addEventListener("click", ()=>{
        Login.toggleCreateAccount(submitButton);
    });


    //Vertical Center Elms that need it
    var windowVertCenterElms = document.getElementsByClassName("vcToWindow");
    setInterval(()=>{
        JSStyles.verticalCenterToWindowHeight(windowVertCenterElms);
    }, 350); //350 miliseconds, slightly higher than average reaction time
}

function homeInit(){
    NetworkReq.fetchGet(
        `${globals.baseDataPath}/movie/getRecentReleaseMovies`,
        Home.appendRowDataToRecentRelease
    );

    NetworkReq.fetchGet(
        `${globals.baseDataPath}/movie/getMoviesWithMostReviews`,
        Home.appendRowDataToMostReviewed
    );


    //Vertical Center Elms that need it
    var parentVertCenterElms = document.getElementsByClassName("vcToParent");
    setInterval(()=>{
        JSStyles.verticalCenterToParentHeight(parentVertCenterElms);
    }, 350); //350 miliseconds, slightly higher than average reaction time
}