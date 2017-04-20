/* Form Submission Validation (IE 9+)
https://github.com/davidbowland/form-submit */
'use strict';
var formSubmit = new function() {
  var self = this,
      fallback_error_message = 'Invalid input', // Only used if nothing else is specified
      validation_count = 0,
      validation_callbacks = {},
      validation_forms = {},
      regex_timestamp_values = {
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
        'MS': '(\\d{1,6})'
      },
      regex_phone_values = {
        '0': '\\d',
        '9': '[1-9]'
      };


  /* Public methods */
  self.addValidation = function(el, callback) {
    self.removeValidation(el);
    validation_callbacks[getUniqueID(el)] = callback;
    el.addEventListener('change', fieldValidationEvent);
    addFormValidation(el.form);
    return self;
  };

  self.removeValidation = function(el) {
    el.removeEventListener('change', fieldValidationEvent);
    delete validation_callbacks[getUniqueID(el)];
    removeFormValidation(el.form);
    self.removeErrorMessage(el);
    return self;
  };

  self.addRadioValidation = function(el, callback) {
    var radio_buttons = el.form.querySelectorAll('[name="' + el.name + '"]');
    for (var radio, x = 0; radio = radio_buttons[x]; x++) {
      self.addValidation(radio, callback);
    }
    return self;
  };

  self.removeRadioValidation = function(el, callback) {
    var radio_buttons = el.form.querySelectorAll('[name="' + el.name + '"]');
    for (var radio, x = 0; radio = radio_buttons[x]; x++) {
      self.removeValidation(radio, callback);
    }
    return self;
  };

  self.getErrorMessage = function(el) {
    var callback = validation_callbacks[getUniqueID(el)],
      value = el.value,
      radio_button;
    // Only validate selected radio buttons
    if (el.type.toLowerCase() == 'radio') {
      if (radio_button = el.form.querySelector('[name="' + el.name + '"]:checked')) {
        value = radio_button.value;
      } else {
        value = undefined;
      }
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
    self.getErrorMessageElement(el).appendChild(document.createTextNode(msg)); // Add msg
    return self;
  };

  self.removeErrorMessage = function(el) {
    var msg_el = self.getErrorMessageElement(el)
    while (msg_el.firstChild) { // Remove current contents
      msg_el.removeChild(msg_el.firstChild); }
    return self;
  };

  self.getErrorMessageElement = function(el) {
    var target = document.querySelector('[data-form-submit-error-for="' + (el.id || el.name) + '"]'),
        radios, insert_before;
    if (!target) { // Create a span for this message
      target = document.createElement('span');
      target.setAttribute('data-form-submit-error-for', el.id || el.name);
      if (el.type.toLowerCase() == 'radio') {
        radios = el.form.querySelectorAll('[name="' + el.name + '"]')
        insert_before = radios[radios.length - 1].nextElementSibling;
      } else {
        insert_before = el.nextElementSibling;
      }
      el.parentElement.insertBefore(target, insert_before);
    }
    return target;
  };

  self.addCounter = function(el, maxlength) {
    self.removeCounter(el);
    // Set data-form-submit-count depending on passed value or maxlength, if appropriate
    if (maxlength !== undefined) {
      el.setAttribute('data-form-submit-count', maxlength);
    } else if (isNaN(parseInt(el.getAttribute('data-form-submit-count')))) {
      el.setAttribute('data-form-submit-count', el.getAttribute('maxlength'));
    }
    el.addEventListener('input', counterEvent);
    el.addEventListener('keypress', counterEvent);
    el.addEventListener('change', counterEvent);
    counterEvent({'target': el}); // Show count immediately
    return self;
  };

  self.removeCounter = function(el) {
    var counter = self.getCounterElement(el);
    el.removeEventListener('input', counterEvent);
    el.removeEventListener('keypress', counterEvent);
    el.removeEventListener('change', counterEvent);
    while (counter.firstChild) {
      counter.removeChild(counter.firstChild); }
    return self;
  };

  self.getCounterElement = function(el) {
    var target = document.querySelector('[data-form-submit-counter-for="' + (el.id || el.name) + '"]');
    if (!target) { // Create a span for this message
      target = document.createElement('span');
      target.setAttribute('data-form-submit-counter-for', el.id || el.name);
      el.parentElement.insertBefore(target, el.nextSibling);
    }
    return target;
  };

  self.unload = function() {
    var el, x, counters = document.querySelectorAll('data-form-submit-count');
    for (x in validation_callbacks) {
      self.removeValidation(validation_callbacks[x]);
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
    vself.isPhone = function(value, format, general_separators) {
      var regex_str = (format || '(000)000-0000').replace(/0|9|.+?/g, function(item) {
        return regex_phone_values[item] || (general_separators ? '\\D*?' : item.replace(/(\W)/g, '\\$1'));
      });
      return (new RegExp('^' + regex_str + '$')).test(value);
    };
    vself.isZip = function(value) {
      return value.search(/^\d{5}$/) >= 0;
    };
    vself.isEmail = function(value) {
      return value.search(/^.+@([a-z0-9]([a-z0-9-]*[a-z0-9])*\.)+[a-z]+$/i) >= 0;
    };
    vself.isTimestamp = function(value, format, general_separators) {
      return getRegexFromString(format || 'mm/dd/yyyy HH:MM:SS.MS', general_separators).test(value);
    };
    vself.isDate = function(value, format, general_separators) {
      return vself.isTimestamp(value, format || 'mm/dd/yyyy', general_separators);
    };
    vself.isTime = function(value, format, general_separators) {
      return vself.isTimestamp(value, format || 'HH24:MM', general_separators);
    };

    vself.formatDigits = function(value, format) {
      var digits = value.match(/\d/g) || [],
          last_index;
      // If no format was specified, return all digits. If no value, return empty string.
      if (format === undefined || !value) {
        return digits.join('');
      }
      // Return format string with replacements
      return format.replace(/\d/g, function(item, offset) {
        if (digits.length) {
          return digits.shift();
        } else if (last_index === undefined) {
          last_index = offset;
        }
        return '';
      }).slice(0, last_index);
    };
    vself.formatNumber = function(value) {
      var pcount = 0,
          negative = value.indexOf('-') >= 0 ? '-' : '';
      return addCommas(negative + value.replace(/\D/g, function (match) {
        return (match == '.' && ++pcount == 1) ? '.' : ''; // Allow the first period, all other non-digits are replaced
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
      var groups, tokens,
          replacements = {},
          last_index = undefined;
      format = format || 'mm/dd/yyyy HH:MM:SS.MS';
      if (!value) { // Can't format an empty string
        return ''; }
      // Format expected
      if (groups = getRegexFromString(format.replace(/mm|dd|HH|MM|SS/g, function(item) { return item.slice(Math.min(item.length / -2)); }), true, true).exec(value)) {
        tokens = format.match(/mm|m|dd|d|yyyy|yy|HH|H|MS|MM|M|SS|S/g);
        groups.shift();
        for (var m, x = 0; m = groups[x]; x++) {
          if (['mm', 'dd', 'HH24', 'HH', 'MM', 'SS'].indexOf(tokens[x]) >= 0) {
            m = ('00' + m).slice(-2);
          }
          replacements[tokens[x]] = m;
        }
      } else {
        // m/d/yy or yyyy
        if (groups = value.match(/(?:^|\D)(1[0-2]|0?[1-9])([\\/-]?)([12]\d|3[01]|0?[1-9])(\2)((?:19|20)?\d\d)(?:\D|$)/)) {
          replacements['m'] = groups[1];
          replacements['d'] = groups[3];
          replacements['yy'] = groups[5];
        // yyyy-m-d
        } else if (groups = value.match(/(?:^|\D)((?:19|20)?\d\d)([\\/-]?)(1[0-2]|0?[1-9])(\2)([12]\d|3[01]|0?[1-9])(?:\D|$)/)) {
          replacements['yy'] = groups[1];
          replacements['m'] = groups[3];
          replacements['d'] = groups[5];
        }
        // h24:m:s.ms (date removed, if found)
        if (groups && (groups = value.slice(groups[0].length).match(/(?:^|\D)(1\d|2[0-3]|0?\d)[\.:]?((?:0|[1-5])?\d)(?:[\.:]?((?:0|[1-5])?\d)(?:[\.:]?(\d{1,6}))?)?(?:\D|$)/))) {
          replacements['H'] = groups[1];
          replacements['M'] = groups[2];
          replacements['S'] = groups[3];
          replacements['MS'] = groups[4];
        // h24:m:s.ms (date intact)
        } else if (groups = value.match(/(?:^|\D)(1\d|2[0-3]|0?\d)[\.:]?((?:0|[1-5])?\d)(?:[\.:]?((?:0|[1-5])?\d)(?:[\.:]?(\d{1,6}))?)?(?:\D|$)/)) {
          replacements['H'] = groups[1];
          replacements['M'] = groups[2];
          replacements['S'] = groups[3];
          replacements['MS'] = groups[4];
        }
      }
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
        if (value.match(/p\.?m/i)) { // PM affects 24-hour clock only
          replacements['H24'] = replacements['HH24'] = (parseInt(replacements['H']) + 12).toString();
        } else {
          replacements['H24'] = replacements['H'];
          replacements['HH24'] = replacements['HH'];
        }
      }
      // Return format string with replacements
      return format.replace(/mm|m|dd|d|yyyy|yy|HH24|H24|HH|H|MS|MM|M|SS|S/g, function(item, offset) {
        if (replacements[item]) {
          return replacements[item];
        } else if (last_index === undefined) {
          last_index = offset;
        }
        return '';
      }).slice(0, last_index) || value; // Return original value if result is empty string
    };
    vself.formatDate = function(value, format) {
      return vself.formatTimestamp(value, format || 'mm/dd/yyyy');
    };
    vself.formatTime = function(value, format) {
      return vself.formatTimestamp(value, format || 'HH24:MM');
    };

    var addCommas = function(num_str) {
      var groups = num_str.match(/^([^\.]*)(\.?)([^\.]*)$/).slice(1);
      groups[0] = groups[0].replace(/\B(?=(?:\d{3})+\b)/g, ','); // Add commas before decimal
      return groups.join('');
    };
    var getRegexFromString = function(str, general_separators, optional_values) {
      var optional = '',
          regex_end = '',
          groups, replacement;
      if (optional_values && (groups = str.match(/mm|m|dd|d|yyyy|yy|HH24|H24|HH|H|MS|MM|M|SS|S/g))) {
        optional = '(?:';
        for (var x = 0; groups[x]; x++) {
          regex_end += ')?'; }
      }
      return new RegExp('^' + str.replace(/mm|m|dd|d|yyyy|yy|HH24|H24|HH|H|MS|MM|M|SS|S|.+?/g, function(item) {
        if (replacement = regex_timestamp_values[item]) {
          return optional + replacement;
        }
        return general_separators ? '\\D?' : item.replace(/(\W)/g, '\\$1');
      }) + regex_end + '$');
    };
  };


  /* Private functions */
  var attrPresentNotFalse = function(el, attr) {
    var value = el.getAttribute(attr);
    return value && value.toLowerCase() != 'false';
  };

  var addFormValidation = function(form) {
    if (!(form in validation_forms) && form) {
      validation_forms[getUniqueID(form)] = true;
      form.addEventListener('submit', formValidationEvent);
    }
  };

  var removeFormValidation = function(form) {
    var el, x;
    if (form) {
      // Only remove event listener if no more fields are being validated
      for (var x in validation_callbacks) {
        el = validation_callbacks[x];
        if (el.form == form) {
          return; } // This form still has a field being validated
      }
      form.removeEventListener('submit', formValidationEvent);
      delete validation_forms[getUniqueID(form)];
    }
  };

  var getUniqueID = function(el) {
    var count = parseInt(el.getAttribute('data-form-submit-id'));
    if (isNaN(count)) {
      el.setAttribute('data-form-submit-id', (count = validation_count++))
    }
    return count;
  };

  var formValidationEvent = function(ev) {
    var fields = ev.target.querySelectorAll('[name]'),
        valid = true;
    // If this form is set to always allow then we're done here
    if (attrPresentNotFalse(ev.target, 'data-form-submit-always-allow')) {
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
    if (msg = self.getErrorMessage(ev.target)) {
      self.displayErrorMessage(ev.target, msg);
    } else {
      self.removeErrorMessage(ev.target);
    }
  };

  var counterEvent = function(ev) {
    var el = self.getCounterElement(ev.target),
        maxcount = ev.target.getAttribute('data-form-submit-count');
    while (el.firstChild) { // Remove current contents
      el.removeChild(el.firstChild); }
    // Enforce the max length
    ev.target.value = ev.target.value.slice(0, parseInt(maxcount));
    el.appendChild(document.createTextNode(ev.target.value.length + '/' + maxcount)); // Add count message
  };

  var assisterGetErrorMessage = function(el) {
    return el.getAttribute('data-form-submit-error-msg') || fallback_error_message;
  };

  var assisterValidateAndFormat = function(target, validation, formatter, format) {
    self.addValidation(target, function(value, el) {
      if (!validation((el.value = formatter(value, format)), format)) {
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
    var fields, el, x, required, count;
    // Add required validation based on data-form-submit-required property
    fields = document.querySelectorAll('[data-form-submit-required]');
    for (x = 0; el = fields[x]; x++) {
      if (required = el.getAttribute('data-form-submit-required')) {
        switch (required.toLowerCase()) {
          case 'digits':
            assisterValidateAndFormat(el, self.validation.isDigits, self.validation.formatDigits);
            assisterSetPlaceholder(el, '0');
            break;
          case 'number':
            assisterValidateAndFormat(el, self.validation.isNumber, self.validation.formatNumber);
            assisterSetPlaceholder(el, '0.0');
            break;
          case 'currency':
            assisterValidateAndFormat(el, self.validation.isCurrency, self.validation.formatCurrency);
            assisterSetPlaceholder(el, '0.00');
            break;
          case 'phone':
            assisterValidateAndFormat(el, self.validation.isPhone, self.validation.formatPhone);
            assisterSetPlaceholder(el, '(000)000-0000');
            break;
          case 'zip':
            assisterValidateAndFormat(el, self.validation.isZip, self.validation.formatZip);
            assisterSetPlaceholder(el, '00000');
            break;
          case 'email':
            self.addValidation(el, function(value, el) {
              return self.validation.isEmail(value) ? '' : assisterGetErrorMessage(el);
            });
            assisterSetPlaceholder(el, 'user@domain.com');
            break;
          case 'timestamp':
            assisterValidateAndFormat(el, self.validation.isTimestamp, self.validation.formatTimestamp);
            assisterSetPlaceholder(el, 'mm/dd/yyyy hh:mm:ss.ms');
            break;
          case 'date-mmddyyyy':
            assisterValidateAndFormat(el, self.validation.isDate, self.validation.formatDate);
            assisterSetPlaceholder(el, 'mm/dd/yyyy');
            break;
          case 'date-yyyymmdd':
            assisterValidateAndFormat(el, self.validation.isDate, self.validation.formatDate, 'yyyy-mm-dd');
            assisterSetPlaceholder(el, 'yyyy-mm-dd');
            break;
          case 'time':
            assisterValidateAndFormat(el, self.validation.isTime, self.validation.formatTime);
            assisterSetPlaceholder(el, 'hh:mm');
            break;
          case 'radio':
            self.addRadioValidation(el, function(value, el) {
              var msg_el;
              // Return an error message only if no value is selected
              if (value === undefined) {
                msg_el = el.form.querySelector('[name="' + el.name + '"][data-form-submit-error-msg]')
                return msg_el ? msg_el.getAttribute('data-form-submit-error-msg') : fallback_error_message;
              }
              return '';
            });
            break;
          case 'false': // The only way to positively indicate no validation
            break;
          default:
            self.addValidation(el, function(value, el) {
              return value.length ? '' : assisterGetErrorMessage(el);
            });
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
      self.addCounter(el);
    }
  };
  document.addEventListener('DOMContentLoaded', documentLoaded, true);
  documentLoaded();
};