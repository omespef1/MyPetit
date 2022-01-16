/* eslint-disable */
'use strict';

import { KTUtil } from './util';

// Component Definition
var KTTimePicker = function (elementId, options) {
	// Main object
	var the = this;
	var init = false;

	// Get element object
	var element = KTUtil.getById(elementId);

	if (!element) {
		return;
	}
	element.timepicker({
		minuteStep: 1,
		showSeconds: true,
		showMeridian: false,
		snapToStep: true,
	});
};

// webpack support
if (typeof module !== 'undefined' && typeof module.exports !== 'undefined') {
	// module.exports = KTWizard;
}

export default KTTimePicker;
