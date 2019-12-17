// ==UserScript==
// @namespace    https://openuserjs.org/users/floodmeadows
// @name         Fieldglass completion helper
// @description  Adds options to complete or reset the billable hours in your Fieldglass timesheet
// @copyright    2019, floodmeadows (https://openuserjs.org/users/floodmeadows)
// @license      MIT
// @version      0.4.0
// @updateURL    https://openuserjs.org/meta/floodmeadows/Fieldglass_completion_helper.meta.js
// @downloadURL  https://openuserjs.org/src/scripts/username/Fieldglass_completion_helper.user.js
// @include      https://www.fieldglass.net/rate_schedule_time_sheet_form.do*
// @grant        none
// ==/UserScript==

// ==OpenUserJS==
// @author       floodmeadows
// ==/OpenUserJS==

(function() {
    'use strict';

    // Config variables
    var fullDayHours = 7;
    var fullDayMins = 30;
    var halfDayHours = 3;
    var halfDayMins = 45;
    var buttonStyle = "margin: 0px 2px 4px; padding: 0px 2px; min-width: 30%; height: 22px; background-color: #ccf; border: 0px;";
    var weekButtonStyle = " width: 80%; margin: 4px auto;";
    var dayButtonsContainerStyle = "display:inline-block; width:2.4em; vertical-align:top;";

    // derived / combined config values
    var fullWeekText = fullDayHours + ":" + fullDayMins + " every working day";
    var nonWeekText = "0:00 every day";
    var noneDayText = "0:00";
    var halfDayText = halfDayHours + ":" + halfDayMins;
    var fullDayText = fullDayHours + ":" + fullDayMins;

    // add buttons to set values for the whole week
    var weekButtons = document.createElement('div');

    var fillAllLink = document.createElement('button');
    fillAllLink.textContent = fullWeekText;
    fillAllLink.setAttribute('style', buttonStyle + weekButtonStyle);

    var clearAllLink = document.createElement('button');
    clearAllLink.textContent = nonWeekText;
    clearAllLink.setAttribute('style', buttonStyle + weekButtonStyle);

    weekButtons.appendChild(fillAllLink);
    weekButtons.appendChild(clearAllLink);

    // For the first page (project hours worked, etc.) add the "full week" and "none week" links to the first cell of the first "hoursWorked" row
    if(document.getElementsByClassName('billableHeader').length > 0) {
        document.querySelector("tr.hoursWorked").firstElementChild.appendChild(weekButtons.cloneNode(true));
    } else {
        // for the second page (non-working days, unpaid holiday etc.) add the week buttons to each row of the form
        document.querySelectorAll("td.wordBreakAll").forEach(
            function(val, index, listObj) {
                val.appendChild(weekButtons.cloneNode(true));
            });
    }

    // Add buttons to control each day
    var dayButtons = document.createElement('div');
    dayButtons.style = dayButtonsContainerStyle;

    var fullDayButton = document.createElement('button');
    fullDayButton.innerHTML = fullDayText;
    fullDayButton.setAttribute('style', buttonStyle);

    var halfDayButton = document.createElement('button');
    halfDayButton.innerHTML = halfDayText;
    halfDayButton.setAttribute('style', buttonStyle);

    var noneDayButton = document.createElement('button');
    noneDayButton.innerHTML = noneDayText;
    noneDayButton.setAttribute('style', buttonStyle);

    dayButtons.appendChild(fullDayButton);
    dayButtons.appendChild(halfDayButton);
    dayButtons.appendChild(noneDayButton);

    document.querySelectorAll("td.hoursWorked").forEach(
         function(currentValue, currentIndex, listObj) {
             currentValue.insertBefore(dayButtons.cloneNode(true), currentValue.childNodes[0]);
         });

    function fillAllWorkingDays(el) {
        el.parentElement.parentElement.parentElement.querySelectorAll('td.hoursWorked:not(.nonWorkingDay) > input.hour').forEach(function(val,index,listObj){
            val.value = fullDayHours;
        });
        el.parentElement.parentElement.parentElement.querySelectorAll('td.hoursWorked:not(.nonWorkingDay) > input.min').forEach(function(val,index,listObj){
            val.value = fullDayMins;
        });
    }

    function clearAllDays(el) {
        el.parentElement.parentElement.parentElement.querySelectorAll('td.hoursWorked > input.hour').forEach(function(val,index,listObj){
            val.value = 0;
        });
        el.parentElement.parentElement.parentElement.querySelectorAll('td.hoursWorked > input.min').forEach(function(val,index,listObj){
            val.value = 0;
        });
    }

    function fillDay(element, hours, mins) {
        element.parentElement.parentElement.querySelector('td.hoursWorked > input.hour').value = hours;
        element.parentElement.parentElement.querySelector('td.hoursWorked > input.min').value = mins;
    }

    document.querySelectorAll("tr.hoursWorked, tr.ratesEntry").forEach(
        function(currentValue, currentIndex, listObj) {
            currentValue.addEventListener("click", function(event){
                var element = event.target;
                if(element.innerHTML == fullWeekText) {
                    fillAllWorkingDays(element);
                } else if(element.innerHTML == nonWeekText) {
                    clearAllDays(element);
                } else if(element.innerHTML == fullDayText) {
                    fillDay(element, fullDayHours, fullDayMins);
                } else if(element.innerHTML == halfDayText) {
                    fillDay(element, halfDayHours, halfDayMins);
                } else if(element.innerHTML == noneDayText) {
                    fillDay(element, 0, 0);
                }
                event.preventDefault();
            });
        });

})();
