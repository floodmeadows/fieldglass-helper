// ==UserScript==
// @namespace    https://openuserjs.org/users/floodmeadows
// @name         Fieldglass completion helper
// @description  Adds options to complete or reset the billable hours in your Fieldglass timesheet
// @copyright    2019, floodmeadows (https://openuserjs.org/users/floodmeadows)
// @license      MIT
// @version      0.3.1
// @include      https://www.fieldglass.net/rate_schedule_time_sheet_form.do*
// @grant        none
// ==/UserScript==

// ==OpenUserJS==
// @author       floodmeadows
// ==/OpenUserJS==

(function() {
    'use strict';
    var h = document.getElementsByClassName('billableHeader')[0].children[0];
    var f = document.createElement('a');
    f.textContent = "[ Fill working days with 7:30 ]";
    f.setAttribute('href', '#');
    f.setAttribute('style', "margin-left: 2em;");
    f.addEventListener("click", function(){
        for(var i=1; i<=5; i++) {
            var classes = document.getElementsByClassName('hoursWorked')[i].classList;
            var nonWorkingDay = false;
            for (var j=0; j<=classes.length; j++) {
                if(classes[j] == "nonWorkingDay") {
                   nonWorkingDay = true;
                }
            }
            if(!nonWorkingDay) {
                document.getElementsByClassName('hoursWorked')[i].children[0].value = 7;
                document.getElementsByClassName('hoursWorked')[i].children[2].value = 30;
            }
        }
    });
    h.appendChild(f);
    var c = document.createElement('a');
    c.textContent = "[ Reset ]";
    c.setAttribute('href', '#');
    c.setAttribute('style', "margin-left: 2em;");
    c.addEventListener("click", function(){
        for(var i=1; i<=5; i++) {
            document.getElementsByClassName('hoursWorked')[i].children[0].value = 0;
            document.getElementsByClassName('hoursWorked')[i].children[2].value = 0;
        }
    });
    h.appendChild(c);
})();
