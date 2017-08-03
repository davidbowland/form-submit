/* Form Submission Validation (IE 9+)
https://github.com/davidbowland/form-submit */
'use strict';
var formSubmit = new function() {
  var self = this,
      fallbackErrorMessage = 'Invalid input', // Only used if nothing else is specified
      validationCount = 0, // Used for unique element ID
      validationCallbacks = {}, // Fields with validation callbacks
      validationForms = {}, // Forms with validation callbacks
      regexTimestampValues = {
        'm': '(1[0-2]|0?[1-9])',
        'mm': '(0[1-9]|1[0-2])',
        'd': '([12]\\d|3[01]|0?[1-9])',
        'dd': '(0[1-9]|[12]\\d|3[01])',
        'yy': '(\\d\\d)',
        'yyyy': '((?:19|20)\\d\\d)',
        'H': '(1[0-2]|0?[1-9])',
        'HH': '(0[1-9]|1[0-2])',
        'H24': '(1\\d|2[0-3]|0?\\d)',
        'HH24': '(0\\d|1\\d|2[0-3])',
        'M': '((?:0|[1-5])?\\d)',
        'MM': '([0-5]\\d)',
        'S': '((?:0|[1-5])?\\d)',
        'SS': '([0-5]\\d)',
        'MS': '(\\d{0,6}?)' // MS will be zeros when absent
      },
      regexPhoneValues = {
        '0': '\\d',
        '9': '[1-9]'
      },
      placeholderValues = {
        'digits': '0',
        'number': '0.0',
        'currency': '0.00',
        'phone': '(000)000-0000',
        'zip': '00000',
        'email': 'user@domain.com',
        'timestamp': 'mm/dd/yyyy hh:mm:ss.ms',
        'date-mmddyyyy': 'mm/dd/yyyy',
        'date-yyyymmdd': 'yyyy-mm-dd',
        'time': 'hh:mm'
      };


  /* Public methods */
  self.addValidation = function(selector, callback) {
    applySelector(selector, self.addValidationSingleElement, callback);
    return self;
  };

  self.addValidationSingleElement = function(el, callback) {
    self.removeValidationSingleElement(el);
    validationCallbacks[getUniqueID(el)] = callback;
    el.addEventListener('change', fieldValidationEvent);
    el.addEventListener('blur', fieldValidationEvent);
    addFormValidation(el.form);
    return self;
  };

  self.removeValidation = function(selector) {
    applySelector(selector, self.removeValidationSingleElement);
    return self;
  };

  self.removeValidationSingleElement = function(el) {
    el.removeEventListener('change', fieldValidationEvent);
    el.removeEventListener('blur', fieldValidationEvent);
    delete validationCallbacks[getUniqueID(el)];
    removeFormValidation(el.form);
    self.removeErrorMessage(el);
    return self;
  };

  self.addRadioValidation = function(el, callback) {
    var radioButtons = el.form.querySelectorAll('[name="' + el.name + '"]');
    for (var radio, x = 0; radio = radioButtons[x]; x++) {
      self.addValidationSingleElement(radio, callback);
    }
    return self;
  };

  self.removeRadioValidation = function(el, callback) {
    var radioButtons = el.form.querySelectorAll('[name="' + el.name + '"]');
    for (var radio, x = 0; radio = radioButtons[x]; x++) {
      self.removeValidationSingleElement(radio, callback);
    }
    return self;
  };

  self.getErrorMessage = function(el) {
    var callback = validationCallbacks[getUniqueID(el)],
      value = el.value,
      radioButton,
      elementType = el.type.toLowerCase();
    // Only validate selected radio buttons
    if (elementType == 'radio') {
      if (radioButton = el.form.querySelector('[name="' + el.name + '"]:checked')) {
        value = radioButton.value;
      } else {
        value = undefined;
      }
    // Validate checkbox
    } else if (elementType == 'checkbox') {
      value = el.checked;
    // Validated the selected item
    } else if (el.tagName.toUpperCase() == 'SELECT') {
      value = el.querySelector(':checked').value;
    }
    if (callback) {
      return callback(value, el); }
    return undefined;
  };
  
  self.isValid = function(el) {
    return !self.getErrorMessage(el);
  };

  self.displayErrorMessage = function(el, msg) {
    self.removeErrorMessage(el);
    self.getErrorMessageElement(el).textContent = msg; // Add msg
    return self;
  };

  self.removeErrorMessage = function(el) {
    self.getErrorMessageElement(el).textContent = '';
    return self;
  };

  self.getErrorMessageElement = function(el) {
    var target = document.querySelector('[data-form-submit-error-for="' +
                                        (el.getAttribute('data-form-submit-group') ||
                                            el.id || el.name) + '"]'),
        radios, insertBeforeElement;
    if (!target) { // Create a span for this message
      target = document.createElement('span');
      target.className = 'form-submit-error';
      target.setAttribute('data-form-submit-error-for', el.getAttribute('data-form-submit-group') || el.id || el.name);
      if (el.type.toLowerCase() == 'radio') {
        radios = el.form.querySelectorAll('[name="' + el.name + '"]')
        insertBeforeElement = radios[radios.length - 1].nextElementSibling;
      } else {
        insertBeforeElement = el.nextElementSibling;
      }
      el.parentElement.insertBefore(target, insertBeforeElement);
    }
    return target;
  };

  self.addCounter = function(selector, maxlength) {
    applySelector(selector, self.addCounterSingleElement, maxlength);
    return self;
  };

  self.addCounterSingleElement = function(el, maxlength) {
    self.removeCounterSingleElement(el);
    // Set data-form-submit-count depending on passed value or maxlength, if appropriate
    if (maxlength !== undefined) {
      el.setAttribute('data-form-submit-count', maxlength);
    } else if (isNaN(parseInt(el.getAttribute('data-form-submit-count')))) {
      el.setAttribute('data-form-submit-count', el.getAttribute('maxlength'));
    }
    el.addEventListener('input', counterEvent);
    el.addEventListener('keypress', counterEvent);
    el.addEventListener('change', counterEvent);
    el.addEventListener('blur', counterEvent);
    counterEvent({'currentTarget': el}); // Show count immediately
    return self;
  };

  self.removeCounter = function(selector) {
    applySelector(selector, self.removeCounterSingleElement);
    return self;
  };

  self.removeCounterSingleElement = function(el) {
    el.removeEventListener('input', counterEvent);
    el.removeEventListener('keypress', counterEvent);
    el.removeEventListener('change', counterEvent);
    el.removeEventListener('blur', counterEvent);
    self.getCounterElement(el).textContent = '';
    return self;
  };

  self.getCounterElement = function(el) {
    var target = document.querySelector('[data-form-submit-counter-for="' +
                                        (el.id || el.name) + '"]');
    if (!target) { // Create a span for this message
      target = document.createElement('span');
      target.className = 'form-submit-counter';
      target.setAttribute('data-form-submit-counter-for', el.id || el.name);
      el.parentElement.insertBefore(target, el.nextSibling);
    }
    return target;
  };

  self.unload = function() {
    var el, x, counters = document.querySelectorAll('data-form-submit-count');
    for (x in validationCallbacks) {
      self.removeValidation(validationCallbacks[x]);
    }
    for (x = 0; el = counters[x]; x++) {
      self.removeCounter(el);
    }
    return self;
  };


  /* Validation functions */
  self.validation = new function() {
    var vself = this;

    vself.isDigits = function(value) {
      return value.search(/^\d+$/) >= 0;
    };
    vself.isNumber = function(value) {
      return value.search(/^\-?((\d{1,3}(,?\d{3})*)\.?\d*|(\d{1,3}(,?\d{3})*)?\.\d+)$/) >= 0;
    };
    vself.isCurrency = function(value) {
      return value.search(/^\-?((\d{1,3}(,?\d{3})*)?\.\d\d)$/) >= 0;
    };
    vself.isPhone = function(value, format, generalSeparators) {
      var regexStr = (format || '(000)000-0000').replace(/0|9|.+?/g,
        function(item) {
          return (regexPhoneValues[item] ||
                 (generalSeparators ? '\\D*?' : item.replace(/(\W)/g, '\\$1')));
        });
      return (new RegExp('^' + regexStr + '$')).test(value);
    };
    vself.isZip = function(value) {
      return value.search(/^\d{5}$/) >= 0;
    };
    vself.isEmail = function(value) {
      return value.search(/^.+@([a-z0-9]([a-z0-9-]*[a-z0-9])*\.)+[a-z]+$/i) >= 0;
    };
    vself.isTimestamp = function(value, format, generalSeparators) {
      return getRegexFromString(format || 'mm/dd/yyyy HH24:MM:SS.MS',
                                generalSeparators).test(value);
    };
    vself.isDate = function(value, format, generalSeparators) {
      return vself.isTimestamp(value, format || 'mm/dd/yyyy',
                               generalSeparators);
    };
    vself.isTime = function(value, format, generalSeparators) {
      return vself.isTimestamp(value, format || 'HH24:MM', generalSeparators);
    };

    vself.formatDigits = function(value, format) {
      var digits = value.match(/\d/g) || [],
          lastIndex;
      // If no format was specified, return all digits. If no value, return empty string.
      if (format === undefined || !value) {
        return digits.join('');
      }
      // Return format string with replacements
      return format.replace(/\d/g, function(item, offset) {
        if (digits.length) {
          return digits.shift();
        } else if (lastIndex === undefined) {
          lastIndex = offset;
        }
        return '';
      }).slice(0, lastIndex);
    };
    vself.formatNumber = function(value) {
      var pcount = 0,
          negative = value.indexOf('-') >= 0 ? '-' : '';
      return addCommas(negative + value.replace(/\D/g, function (match) {
        // Allow the first period, all other non-digits are replaced
        return (match == '.' && ++pcount == 1) ? '.' : '';
      }));
    };
    vself.formatCurrency = function(value) {
      value = vself.formatNumber(value);
      return value ? addCommas(parseFloat(value.replace(/,/g, '')).toFixed(2)) : value;
    };
    vself.formatPhone = function(value, format) {
      return vself.formatDigits(value, format || '(000)000-0000');
    };
    vself.formatZip = function(value, format) {
      return vself.formatDigits(value, format || '00000');
    };
    vself.formatTimestamp = function(value, format) {
      var groups, tokens, tokenFormat, hourTwelve,
          replacements = {},
          lastIndex = undefined;
      format = format || 'mm/dd/yyyy HH24:MM:SS.MS';
      if (!value) { // Can't format an empty string
        return ''; }
      // Expected format
      tokenFormat = format.replace(/mm|dd|HH|MM|SS/g,
          function(item) { // Change double letters to single letters in regex
            return item.slice(Math.floor(item.length / -2));
          });
      if (groups = getRegexFromString(tokenFormat, true, true).exec(value)) {
        tokens = tokenFormat.match(/m|d|yyyy|yy|H|MS|M|S/g);
        groups.shift();
        for (var m, x = 0; m = groups[x]; x++) {
          replacements[tokens[x]] = m; }
      } else {
        // m/d/yy or yyyy
        if (groups = value.match(/^\D*(1[0-2]|0?[1-9])([\\/-]?)([12]\d|3[01]|0?[1-9])(\2)((?:19|20)?\d\d)\D*\b/)) {
          replacements['m'] = groups[1];
          replacements['d'] = groups[3];
          replacements['yy'] = groups[5];
        // yyyy-m-d
        } else if (groups = value.match(/^\D*((?:19|20)?\d\d)([\\/-]?)(1[0-2]|0?[1-9])(\2)([12]\d|3[01]|0?[1-9])\D*\b/)) {
          replacements['yy'] = groups[1];
          replacements['m'] = groups[3];
          replacements['d'] = groups[5];
        }
        // h24:m:s.ms (date removed, if found)
        if (groups && (groups = value.slice(groups[0].length).match(/\b\D*(1\d|2[0-3]|0?\d)[\.:]?((?:0|[1-5])?\d)(?:[\.:]?((?:0|[1-5])?\d)(?:[\.:]?(\d{1,6})\d*)?)?\D*\b/))) {
          replacements['H'] = groups[1];
          replacements['M'] = groups[2];
          replacements['S'] = groups[3];
          replacements['MS'] = groups[4];
        // h24:m:s.ms (date intact)
        } else if (groups = value.match(/\b\D*(1\d|2[0-3]|0?\d)[\.:]?((?:0|[1-5])?\d)(?:[\.:]?((?:0|[1-5])?\d)(?:[\.:]?(\d{1,6})\d*)?)?\D*\b/)) {
          replacements['H'] = groups[1];
          replacements['M'] = groups[2];
          replacements['S'] = groups[3];
          replacements['MS'] = groups[4];
        }
      }
      // Don't allow one-digit minutes with two-digit hours
      if (replacements['H'] && (replacements['M'] || '').length == 1) {
        replacements['M'] = replacements['H'].slice(1) + replacements['M'];
        replacements['H'] = replacements['H'].slice(0, 1);
      }
      // When minutes were found, use zero default seconds
      if (replacements['M']) {
        replacements['S'] = replacements['S'] || '0' }
      // When seconds were found, default and pad ms with zeros
      if (replacements['S']) {
        replacements['MS'] = ((replacements['MS'] || '') + '000000').slice(0, 6); }
      // Create multiple formats
      ['m', 'd', 'H', 'M', 'S'].forEach(function(item) {
        var str = replacements[item];
        if (str) {
          replacements[item] = str.match(/^0*(\d+)$/)[1];
          replacements[item + item] = ('0' + str).slice(-2);
        }
      });
      if (replacements['yy']) {
        if (replacements['yy'].length == 4) {
          replacements['yyyy'] = replacements['yy'];
          replacements['yy'] = replacements['yy'].slice(-2);
        } else {
          if (replacements['yy'] < 50) {
            replacements['yyyy'] = '20' + replacements['yy'];
          } else {
            replacements['yyyy'] = '19' + replacements['yy'];
          }
        }
      }
      if (replacements['H']) {
        hourTwelve = parseInt(replacements['H']) % 12;
        if (groups = value.match(/(a|p)/i)) { // AM/PM affects 24-hour clock only
          // Add twelve hours for PM
          if (groups[1] == 'p') {
            hourTwelve = (hourTwelve + 12) % 24 } ;
          replacements['H24'] = hourTwelve.toString();
          replacements['HH24'] = ('0' + replacements['H24']).slice(-2);
        } else {
          replacements['H24'] = replacements['H'];
          replacements['HH24'] = replacements['HH'];
          replacements['H'] = hourTwelve.toString();
          replacements['HH'] = ('0' + replacements['H']).slice(-2);
        }
      }
      // Return format string with replacements
      return format.replace(/mm|m|dd|d|yyyy|yy|HH24|H24|HH|H|MS|MM|M|SS|S/g,
          function(item, offset) {
            if (replacements[item]) {
              return replacements[item];
            } else if (lastIndex === undefined) {
              lastIndex = offset;
            }
            return '';
          }).slice(0, lastIndex) || value; // Return original value if result is empty string
    };
    vself.formatDate = function(value, format) {
      return vself.formatTimestamp(value, format || 'mm/dd/yyyy');
    };
    vself.formatTime = function(value, format) {
      return vself.formatTimestamp(value, format || 'HH24:MM');
    };

    var addCommas = function(numStr) {
      var groups = numStr.match(/^([^\.]*)(\.?)([^\.]*)$/).slice(1);
      groups[0] = groups[0].replace(/\B(?=(?:\d{3})+\b)/g, ','); // Add commas before decimal
      return groups.join('');
    };
    var getRegexFromString = function(str, generalSeparators, optionalValues) {
      var optional = '',
          regexEnd = '',
          groups, replacement;
      if (optionalValues && (groups = str.match(/mm|m|dd|d|yyyy|yy|HH24|H24|HH|H|MS|MM|M|SS|S/g))) {
        optional = '(?:';
        for (var x = 0; x < groups.length; x++) {
          regexEnd += ')?'; }
      }
      return new RegExp('^\\D*' + str.replace(/mm|m|dd|d|yyyy|yy|HH24|H24|HH|H|MS|MM|M|SS|S|.+?/g, function(item) {
        if (replacement = regexTimestampValues[item]) {
          return optional + replacement;
        }
        return generalSeparators ? '\\D?' : item.replace(/(\W)/g, '\\$1');
      }) + regexEnd + '\\D*$');
    };
  };


  /* Private functions */
  var applySelector = function(selector, func) {
    var args = Array.prototype.slice.call(arguments, 2);
    // Query string (CSS selectors)
    if (typeof selector === 'string') {
      selector = document.querySelectorAll(selector);
    // Single element
    } else if (selector.nodeType) {
      selector = [selector];
    } // Everything else is taken as is

    // Loop through each element and call func, with arguments
    for (var x = 0, el; el = selector[x]; x++) {
      func.apply(null, [el].concat(args));
    }
  };

  var attrPresentNotFalse = function(el, attr) {
    var value = el.getAttribute(attr);
    return value && value.toLowerCase() != 'false';
  };

  var addFormValidation = function(form) {
    if (!(form in validationForms) && form) {
      validationForms[getUniqueID(form)] = true;
      form.addEventListener('submit', formValidationEvent);
    }
  };

  var removeFormValidation = function(form) {
    var el, x;
    if (form) {
      // Only remove event listener if no more fields are being validated
      for (var x in validationCallbacks) {
        el = validationCallbacks[x];
        if (el.form == form) {
          return; } // This form still has a field being validated
      }
      form.removeEventListener('submit', formValidationEvent);
      delete validationForms[getUniqueID(form)];
    }
  };

  var getUniqueID = function(el) {
    var count = parseInt(el.getAttribute('data-form-submit-id'));
    if (isNaN(count)) {
      el.setAttribute('data-form-submit-id', (count = validationCount++))
    }
    return count;
  };

  var formValidationEvent = function(ev) {
    var fields = ev.currentTarget.querySelectorAll('[name]'),
        valid = true;
    // If this form is set to always allow then we're done here
    if (attrPresentNotFalse(ev.currentTarget, 'data-form-submit-always-allow')) {
      return true; }
    // Validate all fields
    for (var el, msg, x = 0; el = fields[x]; x++) {
      if (msg = self.getErrorMessage(el)) {
        self.displayErrorMessage(el, msg);
        if (valid) {
          valid = false;
          el.focus(); // Set focus on the first invalid field
        }
      }
    }
    // Prevent form submission if invalid input was found
    if (!valid) {
      ev.preventDefault(); }
    return valid;
  };

  var fieldValidationEvent = function(ev) {
    var msg;
    if (msg = self.getErrorMessage(ev.currentTarget)) {
      self.displayErrorMessage(ev.currentTarget, msg);
    } else {
      self.removeErrorMessage(ev.currentTarget);
    }
  };

  var counterEvent = function(ev) {
    var el = self.getCounterElement(ev.currentTarget),
        maxcount = ev.currentTarget.getAttribute('data-form-submit-count');
    // Enforce the max length
    ev.currentTarget.value = ev.currentTarget.value.slice(0, parseInt(maxcount));
    el.textContent = ev.currentTarget.value.length + '/' + maxcount;
  };

  var assisterGetErrorMessage = function(el) {
    return el.getAttribute('data-form-submit-error-msg') || fallbackErrorMessage;
  };

  var assisterValidateAndFormat = function(target, validation, formatter, format) {
    self.addValidationSingleElement(target, function(value, el) {
      if (!validation((el.value = formatter(value, format)), format)) {
        return assisterGetErrorMessage(el); }
      return '';
    });
  };
  
  var assisterOptionalFormat = function(target, validation, formatter, format) {
    self.addValidationSingleElement(target, function(value, el) {
      if (!validation((el.value = formatter(value, format)), format) && el.value.length) {
        return assisterGetErrorMessage(el); }
      return '';
    });
  };

  var assisterSetPlaceholder = function(el, text) {
    if (el.getAttribute('placeholder') === null) {
      el.setAttribute('placeholder', text); }
  };


  /* Constructor / on load */
  var documentLoaded = function(ev) {
    var fields, el, x, attrValue, count, placeholder;
    // Add required validation based on data-form-submit-required property
    fields = document.querySelectorAll('[data-form-submit-required]');
    for (x = 0; el = fields[x]; x++) {
      if (attrValue = el.getAttribute('data-form-submit-required')) {
        attrValue = String(attrValue).toLowerCase();
        if (placeholder = placeholderValues[attrValue]) {
          assisterSetPlaceholder(el, placeholder); }
        switch (attrValue) {
          case 'digits':
            assisterValidateAndFormat(el, self.validation.isDigits,
                                      self.validation.formatDigits);
            break;
          case 'number':
            assisterValidateAndFormat(el, self.validation.isNumber,
                                      self.validation.formatNumber);
            break;
          case 'currency':
            assisterValidateAndFormat(el, self.validation.isCurrency,
                                      self.validation.formatCurrency);
            break;
          case 'phone':
            assisterValidateAndFormat(el, self.validation.isPhone,
                                      self.validation.formatPhone);
            break;
          case 'zip':
            assisterValidateAndFormat(el, self.validation.isZip,
                                      self.validation.formatZip);
            break;
          case 'email':
            self.addValidation(el, function(value, el) {
              return self.validation.isEmail(value) ? '' : assisterGetErrorMessage(el);
            });
            break;
          case 'timestamp':
            assisterValidateAndFormat(el, self.validation.isTimestamp,
                                      self.validation.formatTimestamp);
            break;
          case 'date-mmddyyyy':
            assisterValidateAndFormat(el, self.validation.isDate,
                                      self.validation.formatDate);
            break;
          case 'date-yyyymmdd':
            assisterValidateAndFormat(el, self.validation.isDate,
                                      self.validation.formatDate, 'yyyy-mm-dd');
            break;
          case 'time':
            assisterValidateAndFormat(el, self.validation.isTime,
                                      self.validation.formatTime);
            break;
          case 'radio':
            self.addRadioValidation(el, function(value, el) {
              var msgEl;
              // Return an error message only if no value is selected
              if (value === undefined) {
                msgEl = el.form.querySelector('[name="' + el.name +
                                              '"][data-form-submit-error-msg]');
                return msgEl ? msgEl.getAttribute('data-form-submit-error-msg') : fallbackErrorMessage;
              }
              return '';
            });
            break;
          case 'false': // The only way to positively indicate no validation
            break;
          default:
            self.addValidation(el, function(value, el) {
              return value ? '' : assisterGetErrorMessage(el);
            });
        }
      }
    }
    // Add optional formatting assistance
    fields = document.querySelectorAll('[data-form-submit-optional]');
    for (x = 0; el = fields[x]; x++) {
      if (attrValue = el.getAttribute('data-form-submit-optional')) {
        attrValue = String(attrValue).toLowerCase();
        if (placeholder = placeholderValues[attrValue]) {
          assisterSetPlaceholder(el, placeholder); }
        switch (attrValue) {
          case 'digits':
            assisterOptionalFormat(el, self.validation.isDigits,
                                   self.validation.formatDigits);
            break;
          case 'number':
            assisterOptionalFormat(el, self.validation.isNumber,
                                   self.validation.formatNumber);
            break;
          case 'currency':
            assisterOptionalFormat(el, self.validation.isCurrency,
                                   self.validation.formatCurrency);
            break;
          case 'phone':
            assisterOptionalFormat(el, self.validation.isPhone,
                                   self.validation.formatPhone);
            break;
          case 'zip':
            assisterOptionalFormat(el, self.validation.isZip,
                                   self.validation.formatZip);
            break;
          case 'email':
            self.addValidation(el, function(value, el) {
              return !value || self.validation.isEmail(value) ? '' : assisterGetErrorMessage(el);
            });
            break;
          case 'timestamp':
            assisterOptionalFormat(el, self.validation.isTimestamp,
                                   self.validation.formatTimestamp);
            break;
          case 'date-mmddyyyy':
            assisterOptionalFormat(el, self.validation.isDate,
                                   self.validation.formatDate);
            break;
          case 'date-yyyymmdd':
            assisterOptionalFormat(el, self.validation.isDate,
                                   self.validation.formatDate, 'yyyy-mm-dd');
            break;
          case 'time':
            assisterOptionalFormat(el, self.validation.isTime,
                                   self.validation.formatTime);
            break;
          case 'false': // The only way to positively indicate no assistance
            break;
          default:
            console.log('data-form-submit-optional invalid: ' +
                        el.getAttribute('data-form-submit-optional'));
        }
      }
    }
    // Add required validation based on data-form-submit-regex property
    fields = document.querySelectorAll('[data-form-submit-regex]');
    for (x = 0; el = fields[x]; x++) {
      self.addValidation(el, function(value, el) {
        // Generate a RegExp object, ensuring it starts and ends with start- and end-matching characters
        try {
          var regex = new RegExp('^' + el.getAttribute('data-form-submit-regex').match(/^\^*(.*?)\$*$/)[1] + '$');
        } catch(e) {
          console.log('data-form-submit-regex invalid: ' + el.getAttribute('data-form-submit-regex'));
          throw(e);
        }
        return regex.test(value) ? '' : assisterGetErrorMessage(el);
      });
    }
    // Add counters based on data-form-submit-count property
    fields = document.querySelectorAll('[data-form-submit-count]');
    for (x = 0; el = fields[x]; x++) {
      // Verify count is a valid integer
      count = el.getAttribute('data-form-submit-count');
      if (count != 'true' && isNaN(parseInt(count))) {
        console.log('data-form-submit-count invalid: ' + el.getAttribute('data-form-submit-count')); }
      self.addCounterSingleElement(el);
    }
  };
  document.addEventListener('DOMContentLoaded', documentLoaded, true);
  // Invoke documentLoaded immediately if the document is already loaded
  if (document.readyState == 'complete') {
    documentLoaded(); }
};