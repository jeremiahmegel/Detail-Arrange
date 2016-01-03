/*
	Copyright Jeremiah Megel 2014
	
	This file is part of Detail-Arrange for Google Contacts™.
	
	Detail-Arrange for Google Contacts™ is free software: you can redistribute it and/or modify
	it under the terms of the GNU General Public License as published by
	the Free Software Foundation, either version 3 of the License, or
	(at your option) any later version.
	
	Detail-Arrange for Google Contacts™ is distributed in the hope that it will be useful,
	but WITHOUT ANY WARRANTY; without even the implied warranty of
	MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
	GNU General Public License for more details.
	
	You should have received a copy of the GNU General Public License
	along with Detail-Arrange for Google Contacts™. If not, see <http://www.gnu.org/licenses/>.
*/

var contactPageRegex = /^#contact(\/.*)+$/;
var inputSelector = "div>span>span>input[type=text]:not([readonly]):not([autocomplete=off]), div>span>span>textarea:not([readonly]):not([autocomplete=off])";
var labelSelector = "div>span>span>input[type=text]:not([readonly])[autocomplete=off]";

window.addEventListener("load", pageLoad, false);
window.addEventListener("hashchange", pageLoad, false);
document.addEventListener("animationstart", insertListener, false);
document.addEventListener("webkitAnimationStart", insertListener, false);

function pageLoad(e) {
	if (contactPageRegex.test(e.currentTarget.location.hash)) {
		var fields = document.querySelectorAll(inputSelector);
		for (var a = 0; a < fields.length; a++) {
			addArrows(fields[a]);
		}
	}
};

function insertListener(e) {
	if (e.animationName == "nodeInserted") {
		addArrows(e.target);
	}
}

function addArrows(field) {
	if (field.parentElement.getElementsByClassName("moveArrowContainer").length <= 0) {
		var moveArrowContainer = document.createElement("span");
		moveArrowContainer.className = "moveArrowContainer";
		
		var upArrow = document.createElement("a");
		upArrow.className = "moveArrow moveUpArrow";
		upArrow.innerHTML = "⇧";
		upArrow.addEventListener("click", function(){
			switcheroo(this, "prev");
		});
		moveArrowContainer.appendChild(upArrow);
		
		var downArrow = document.createElement("a");
		downArrow.className = "moveArrow moveDownArrow";
		downArrow.innerHTML = "⇩";
		downArrow.addEventListener("click", function(){
			switcheroo(this, "next");
		});
		moveArrowContainer.appendChild(downArrow);
		
		field.parentElement.parentElement.parentElement.insertBefore(moveArrowContainer, field.parentElement.parentElement);
	}
}

function switcheroo(thisThing, direction) {
	var thisField = thisThing.parentElement.parentElement.querySelector(inputSelector);
	if (direction === "prev") {
		var thatField = thisField.parentElement.parentElement.parentElement.parentElement.previousSibling.querySelector(inputSelector);
	} else if (direction === "next") {
		var thatField = thisField.parentElement.parentElement.parentElement.parentElement.nextSibling.querySelector(inputSelector);
	}
	var thisLabel = thisField.parentElement.parentElement.parentElement.querySelector(labelSelector);
	var thatLabel = thatField.parentElement.parentElement.parentElement.querySelector(labelSelector);
	
	var thisFieldValue = thisField.value;
	var thatFieldValue = thatField.value;
	var thisLabelValue = thisLabel.value;
	var thatLabelValue = thatLabel.value;
	
	thisField.value = thatFieldValue;
	thatField.value = thisFieldValue;
	thisLabel.value = thatLabelValue;
	thatLabel.value = thisLabelValue;
	
	thisField.focus();
	thatField.focus();
	thisLabel.focus();
	thatLabel.focus();
}