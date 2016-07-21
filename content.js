/*
 * Copyright Jeremiah Megel 2014, 2016
 * 
 * This file is part of Detail-Arrange for Google Contacts™.
 * 
 * Detail-Arrange for Google Contacts™ is free software: you can redistribute it
 * and/or modify it under the terms of the GNU General Public License as
 * published by the Free Software Foundation, either version 3 of the License,
 * or (at your option) any later version.
 * 
 * Detail-Arrange for Google Contacts™ is distributed in the hope that it will
 * be useful, but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE. See the GNU General
 * Public License for more details.
 * 
 * You should have received a copy of the GNU General Public License along with
 * Detail-Arrange for Google Contacts™. If not, see
 * <http://www.gnu.org/licenses/>.
 */

function createArrowContainer() {
	var moveArrowContainer = document.createElement("span");
	moveArrowContainer.className = "moveArrowContainer";

	var upArrow = document.createElement("a");
	upArrow.className = "moveArrow moveUpArrow";
	upArrow.innerHTML = "⇧";
	upArrow.addEventListener("click", function() {
		switcheroo(this, "prev");
	});
	moveArrowContainer.appendChild(upArrow);

	var downArrow = document.createElement("a");
	downArrow.className = "moveArrow moveDownArrow";
	downArrow.innerHTML = "⇩";
	downArrow.addEventListener("click", function() {
		switcheroo(this, "next");
	});
	moveArrowContainer.appendChild(downArrow);

	return moveArrowContainer;
}

function flipFlop(thisField, thatField, thisLabel, thatLabel) {
	var thisFieldValue = thisField.value;
	var thatFieldValue = thatField.value;
	var thisLabelValue = thisLabel.value;
	var thatLabelValue = thatLabel.value;

	thisField.value = thatFieldValue;
	thatField.value = thisFieldValue;
	thisLabel.value = thatLabelValue;
	thatLabel.value = thisLabelValue;
}

function insertListener(e) {
	if (e.animationName == "nodeInserted") {
		addArrows(e.target);
	}
}

if (document.getElementById("content") !== null) {
	// New Google Contacts

	var inputSelector = "div[role=dialog] input[type=text]:not([autocomplete=off])"
			+ ", div[role=dialog] textarea";
	var labelSelector = "div[role=dialog] input[type=text][autocomplete=off]";

	// http://stackoverflow.com/a/2856602/2384183
	var evt = document.createEvent("HTMLEvents");
	evt.initEvent("input", false, true);

	var switcheroo = function(thisThing, direction) {
		var grandParent = thisThing.parentElement.parentElement.parentElement.parentElement;
		var thisField = grandParent.querySelector(inputSelector);
		var thisLabel = grandParent.querySelector(labelSelector);
		if (direction === "prev") {
			var thatField = grandParent.previousSibling.querySelector(inputSelector);
			var thatLabel = grandParent.previousSibling.querySelector(labelSelector);
		} else if (direction === "next") {
			var thatField = grandParent.nextSibling.querySelector(inputSelector);
			var thatLabel = grandParent.nextSibling.querySelector(labelSelector);
		}

		flipFlop(thisField, thatField, thisLabel, thatLabel);

		thisField.dispatchEvent(evt);
		thatField.dispatchEvent(evt);
		thisLabel.dispatchEvent(evt);
		thatLabel.dispatchEvent(evt);
	};

	var addArrows = function(field) {
		if (field.parentElement.getElementsByClassName("moveArrowContainer").length <= 0) {
			field.parentElement.insertBefore(createArrowContainer(), field);
		}
	};
} else {
	// Old Google Contacts

	var contactPageRegex = /^#contact(\/.*)+$/;
	var inputSelector = "div>span>span>input[type=text]:not([readonly]):not([autocomplete=off])"
			+ ", div>span>span>textarea:not([readonly]):not([autocomplete=off])";
	var labelSelector = "div>span>span>input[type=text]:not([readonly])[autocomplete=off]";

	var switcheroo = function(thisThing, direction) {
		var thisField = thisThing.parentElement.parentElement.querySelector(inputSelector);
		if (direction === "prev") {
			var thatField = thisField.parentElement.parentElement.parentElement.parentElement.previousSibling
					.querySelector(inputSelector);
		} else if (direction === "next") {
			var thatField = thisField.parentElement.parentElement.parentElement.parentElement.nextSibling
					.querySelector(inputSelector);
		}
		var thisLabel = thisField.parentElement.parentElement.parentElement
				.querySelector(labelSelector);
		var thatLabel = thatField.parentElement.parentElement.parentElement
				.querySelector(labelSelector);

		flipFlop(thisField, thatField, thisLabel, thatLabel);

		thisField.focus();
		thatField.focus();
		thisLabel.focus();
		thatLabel.focus();
	};

	var addArrows = function(field) {
		if (field.parentElement.getElementsByClassName("moveArrowContainer").length <= 0) {
			field.parentElement.parentElement.parentElement.insertBefore(createArrowContainer(),
					field.parentElement.parentElement);
		}
	};

	var pageLoad = function(e) {
		if (contactPageRegex.test(e.currentTarget.location.hash)) {
			var fields = document.querySelectorAll(inputSelector);
			for (var a = 0; a < fields.length; a++) {
				addArrows(fields[a]);
			}
		}
	};

	window.addEventListener("load", pageLoad, false);
	window.addEventListener("hashchange", pageLoad, false);
}

document.addEventListener("animationstart", insertListener, false);
document.addEventListener("webkitAnimationStart", insertListener, false);
