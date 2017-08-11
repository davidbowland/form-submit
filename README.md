# form-submit
Simple, powerful and extensible JavaScript form validation (IE9+)

*Features user assistance by sanitizing and formatting input*

## HTML-driven
Most validation can be achieved by including one or more attributes on form fields (input, select, textarea). Form submission is automatically prevented when any form does not pass validation.  
  
This script supports being loaded `defer`.

#### HTML attributes and possible values
* `data-form-submit-required`  
   *Specify error text with `data-form-submit-error-msg`. Placeholders are added when the attribute is absent.*
   * `true` - Field requires a value to be validated
   * `digits` - Field requires digits and requires at least one  
      *includes user assistance*
   * `number` - Field requires digits with optional decimal and optional leading negative  
      *includes user assistance*
   * `currency` - Field requires digits with required decimal followed by two digits and optional leading negative  
      *includes user assistance*
   * `phone` - Field requires ten digits in the format `(000)000-0000`  
      *includes user assistance*
   * `zip` - Field requires five digits in the format `00000`  
      *includes user assistance*
   * `email` - Field requires a potential email address (guaranteed to have @ sign and valid domain, user name not validated)
   * `timestamp` - Field requires a timestamp in the format `mm/dd/yyyy HH24:MM:SS.MS`  
      *includes user assistance*
   * `date-mmddyyyy` - Field requires a date in the format `mm/dd/yyyy`  
      *includes user assistance*
   * `date-yyyymmdd` - Field requires a date in the format `yyyy-mm-dd`  
      *includes user assistance*
   * `time` - Field requires a time in the format `HH24:MM`  
      *includes user assistance*
   * `radio` - Radio button group that requires a selection

* `data-form-submit-optional`  
   *Optional fields require either a valid value or no value. Specify error text with `data-form-submit-error-msg`. Placeholders are added when the attribute is absent.*
   * `digits` - Field requires digits and requires at least one  
      *includes user assistance*
   * `number` - Field requires digits with optional decimal and optional leading negative  
      *includes user assistance*
   * `currency` - Field requires digits with required decimal followed by two digits and optional leading negative  
      *includes user assistance*
   * `phone` - Field requires ten digits in the format `(000)000-0000`  
      *includes user assistance*
   * `zip` - Field requires five digits in the format `00000`  
      *includes user assistance*
   * `email` - Field requires a potential email address (guaranteed to have @ sign and valid domain, user name not validated)
   * `timestamp` - Field requires a timestamp in the format `mm/dd/yyyy HH24:MM:SS.MS`  
      *includes user assistance*
   * `date-mmddyyyy` - Field requires a date in the format `mm/dd/yyyy`  
      *includes user assistance*
   * `date-yyyymmdd` - Field requires a date in the format `yyyy-mm-dd`  
      *includes user assistance*
   * `time` - Field requires a time in the format `HH24:MM`  
      *includes user assistance*

* `data-form-submit-group`  
   *Useful for elements whose validation depends on each other*
   * (any unique id) Unique ID matched to `data-form-submit-error-for` for specifying error message output

* `data-form-submit-error-msg`
   * (any string) Message to display when `data-form-submit-required` or `data-form-submit-regex` fails

* `data-form-submit-error-for`
   * (any element id or `data-form-submit-group` id) Designates an element as a space for error message for a specific ID

* `data-form-submit-regex`  
   *Alternative to `data-form-submit-required`. Specify error text with `data-form-submit-error-msg`.*
   * (any regular expression) Regular expression in JavaScript syntax to validate field value

* `data-form-submit-count`  
   *Activates character counter.*
   * (any integer > 0) Maximum character count
   * `true` - Special value indicating `maxlength` property determines max char count

* `data-form-submit-counter-for`
   * (any element id) Designates an element as a space for character counter text for a specific ID

* `data-form-submit-always-allow`
   * `true` - Designates a *form* to always allow submission regardless of field validation

#### CSS for messages
* Classes `form-submit-error` and `form-submit-counter` are added automatically to created elements and can be used to style. Additionally, the `data-form-submit-error-for` and `data-form-submit-counter-for` properties are added to all elements and hold the ID of the element they reference, which can be used for fine-grained styling. If a field is missing an ID the field's name is used as the property's value.

## Extensible through JavaScript
#### JavaScript API
   Note: For ease of use, all functions that do not return a value return the formSubmit object (for chaining).

* `formSubmit.addValidation(<element, NodeList, or query selector string>, <callback(value, element)>)`  
   ex: `formSubmit.addValidation(document.getElementById('fnord'), function(value) { return value.length == 0 ? 'Please enter a value' : ''; })`
   * Adds validation to an element (input, textarea, select), all elements in a [NodeList](https://developer.mozilla.org/en-US/docs/Web/API/NodeList), or all elements identified by a [query selector string](https://developer.mozilla.org/en-US/docs/Web/API/Document/querySelectorAll)  
   The callback is called using the current value and the element itself and should return either an error message or an empty string (false value).

* `formSubmit.removeValidation(<element, NodeList, or query selector string>)`  
   ex: `formSubmit.removeValidation(document.getElementById('fnord'))`
   * Removes validation from an element (input, textarea, select), all elements in a [NodeList](https://developer.mozilla.org/en-US/docs/Web/API/NodeList), or all elements identified by a [query selector string](https://developer.mozilla.org/en-US/docs/Web/API/Document/querySelectorAll)

* `formSubmit.addRadioValidation(<element>, <callback(value, element)>)`  
   ex: `formSubmit.addRadioValidation(document.getElementById('fnord'), function(value) { return value === undefined ? 'Please make a selection' : ''; })`
   * Adds validation to a radio button group (grouped by name)
   * The value passed to the callback is `undefined` if no value is selected

* `formSubmit.removeRadioValidation(<element>)`  
   ex: `formSubmit.removeRadioValidation(document.getElementById('fnord'))`
   * Removes validation from a radio button group (grouped by name)

* `formSubmit.getErrorMessage(<element>)`  
   ex: `formSubmit.getErrorMessage(document.getElementById('fnord'))`
   * Returns the element's error text, including blank if no error, or `undefined` if no validation is specified

* `formSubmit.isValid(<element>)`  
   ex: `formSubmit.isValid(document.getElementById('fnord'))`
   * Returns true if the element's value is valid *or has no validation*, otherwise false

* `formSubmit.displayErrorMessage(<element>, <message>)`  
   ex: `formSubmit.displayErrorMessage(document.getElementById('fnord'), 'The value you entered is invalid')`
   * Immediately displays a custom error message for a element

* `formSubmit.removeErrorMessage(<element>)`  
   ex: `formSubmit.removeErrorMessage(document.getElementById('fnord'))`
   * Removes all text from the error message element but *does not alter CSS*

* `formSubmit.getErrorMessageElement(<element>)`  
   ex: `formSubmit.getErrorMessageElement(document.getElementById('fnord'))`
   * Returns the element that will contain the error message of the passed element, *creating the element if necessary*

* `formSubmit.hasValidContents(<element>)`  
   ex: `formSubmit.hasValidContents(document.querySelector('form'))`
   * Returns true if the named fields contained within the passed element have valid values, otherwise false

* `formSubmit.addCounter(<element, NodeList, or query selector string>, <maxlength>)`  
   ex: `formSubmit.addCounter(document.getElementById('fnord'))` or `formSubmit.addCounter(document.getElementById('fnord'), 100)`
   * Adds a character counter to an element (input, textarea), all elements in a [NodeList](https://developer.mozilla.org/en-US/docs/Web/API/NodeList), or all elements identified by a [query selector string](https://developer.mozilla.org/en-US/docs/Web/API/Document/querySelectorAll), with an optional maximum count specified  
   * If the max count is not specified it will be taken from properties
   * Property `data-form-submit-count` is added if not present

* `formSubmit.removeCounter(<element, NodeList, or query selector string>)`  
   ex: `formSubmit.removeCounter(document.getElementById('fnord'))`
   * Removes a character counter from an element (input, textarea), all elements in a [NodeList](https://developer.mozilla.org/en-US/docs/Web/API/NodeList), or all elements identified by a [query selector string](https://developer.mozilla.org/en-US/docs/Web/API/Document/querySelectorAll)

* `formSubmit.getCounterElement(<element>)`  
   ex: `formSubmit.getCounterElement(document.getElementById('fnord'))`
   * Returns the element that will contain the character count of the passed element, *creating the element if necessary*

* `formSubmit.unload()`  
   *Made available for debugging*
   * Removes all validation and counter events  

#### Validation API
* `formSubmit.validation.isDigits(<value>)`  
   ex: `formSubmit.validation.isDigits('123')`
   * Returns true if the value contains only digits, otherwise returns false

* `formSubmit.validation.isNumber(<value>)`  
   ex: `formSubmit.validation.isNumber('-123.456')`
   * Returns true if the value is a positive or negative number, otherwise returns false
   * Numbers have an optional leading negative, an optional decimal, optional comma separators, and otherwise are digits

* `formSubmit.validation.isCurrency(<value>)`  
   ex: `formSubmit.validation.isCurrency('-987.65')`
   * Returns true if the value passes `isNumber` and additionally has exactly two digits after the decimal, otherwise returns false

* `formSubmit.validation.isPhone(<value>, [format], [generalSeparators])`  
   ex: `formSubmit.validation.isPhone('(123)456-7890')` or `formSubmit.validation.isPhone('123-456-7890', '900-900-0000')`
   * Returns true if the value matches the phone format, otherwise returns false
   * Format string uses `0` for any digit and `9` for digits excluding zero
   * General separator argument should be true if non-digits in the format string should be ignored

* `formSubmit.validation.isZip(<value>)`  
   ex: `formSubmit.validation.isZip('90210')`
   * Returns true if the value is exactly five digits, otherwise returns false

* `formSubmit.validation.isEmail(<value>)`  
   ex: `formSubmit.validation.isEmail('user@domain.com')`
   * Returns true if the value is any value followed by @ and a domain, otherwise returns false

* `formSubmit.validation.isTimestamp(<value>, [format], [generalSeparators])`  
   ex: `formSubmit.validation.isTimestamp('01/01/2001 08:00:00.000000')` or `formSubmit.validation.isTimestamp('01/01/2001', 'mm/dd/yyyy')`
   * Returns true if the value matches the time stamp format (default: `mm/dd/yyyy HH:MM:SS.MS`), otherwise returns false
   * General separator argument should be true if non-digits in the format string should be ignored
   * Format string allows the following placeholders, which are case-sensitive:
      * `m` - Month, either one or two digits
      * `mm` - Month, exactly two digits
      * `d` - Day, either one or two digits
      * `dd` - Day, exactly two digits
      * `yy` - Year, either two or four digits
      * `yyyy` - Year, exactly four digits
      * `H` - Hour on 12-hour clock, either one or two digits
      * `HH` - Hour on 12-hour clock, exactly two digits
      * `H24` - Hour on 24-hour clock, either one or two digits
      * `HH24` - Hour on 24-hour clock, exactly two digits
      * `M` - Minutes, either one or two digits
      * `MM` - Minutes, exactly two digits
      * `S` - Seconds, either one or two digits
      * `SS` - Seconds, exactly two digits
      * `MS` - Milliseconds, between one and six digits, inclusive

* `formSubmit.validation.isDate(<value>, [format], [generalSeparators])`  
   ex: `formSubmit.validation.isDate('01/01/2001')` or `formSubmit.validation.isDate('1/1/01', 'm/d/yy')`
   * Returns true if the value matches the date format (default: `mm/dd/yyyy`), otherwise returns false
   * See `isTimestamp` for format string values
   * General separator argument should be true if non-digits in the format string should be ignored

* `formSubmit.validation.isTime(<value>, [format], [generalSeparators])`  
   ex: `formSubmit.validation.isTime('08:20')` or `formSubmit.validation.isTime('8:20', 'H:MM')`
   * Returns true if the value matches the time format (default: `HH24:MM`), otherwise returns false
   * See `isTimestamp` for format string values
   * General separator argument should be true if non-digits in the format string should be ignored

* `formSubmit.validation.formatDigits(<value>, [format])`  
   ex: `formSubmit.validation.formatDigits('123')` or `formSubmit.validation.formatDigits('123', '00000')`
   * Returns the value formatted to pass `isDigits`
   * Digits in the format string, when provided, are replaced by digits in the value until either is exhausted

* `formSubmit.validation.formatNumber(<value>)`  
   ex: `formSubmit.validation.formatNumber('-123.456')`
   * Returns the value formatted to pass `isNumber`
   * This function adds comma separators, use `formatDigits` for finer control over output

* `formSubmit.validation.formatCurrency(<value>)`  
   ex: `formSubmit.validation.formatCurrency('-987.65')`
   * Returns the value formatted to pass `isCurrency`
   * This function adds comma separators, use `formatDigits` for finer control over output

* `formSubmit.validation.formatPhone(<value> ,[format])`  
   ex: `formSubmit.validation.formatPhone('(123)456-7890')` or `formSubmit.validation.formatPhone('123-456-7890', '000-000-0000')`
   * Returns the value formatted to pass `isPhone`  
   * Digits in the format string, when provided, are replaced by digits in the value until either is exhausted

* `formSubmit.validation.formatZip(<value>)`  
   ex: `formSubmit.validation.formatZip('123')`
   * Returns the value formatted to pass `isZip`, stopping when the value is exhausted (missing digits are not added)

* `formSubmit.validation.formatTimestamp(<value>, [format])`  
   ex: `formSubmit.validation.formatTimestamp('01/01/2001 08:00:00.000000')` or `formSubmit.validation.formatTimestamp('01/01/2001', 'mm/dd/yyyy')`
   * Returns the value formatted to pass `isTimestamp`  
   * Placeholders in the format string, when provided (default: `mm/dd/yyyy HH:MM:SS.MS`), are replaced by digits in the value until either is exhausted
   * See `isTimestamp` for a list of valid placeholders

* `formSubmit.validation.formatDate(<value>, [format])`  
   ex: `formSubmit.validation.formatDate('01/01/2001')` or `formSubmit.validation.formatDate('1/1/01', 'm/d/yy')`
   * Returns the value formatted to pass `isDate`  
   * Placeholders in the format string, when provided (default: `mm/dd/yyyy`), are replaced by digits in the value until either is exhausted
   * See `isTimestamp` for a list of valid placeholders

* `formSubmit.validation.formatTime(<value>, [format])`  
   ex: `formSubmit.validation.formatTime('08:20')` or `formSubmit.validation.formatTime('8:20', 'H:MM')`
   * Returns the value formatted to pass `isTime`  
   * Placeholders in the format string, when provided (default: `HH24:MM`), are replaced by digits in the value until either is exhausted
   * See `isTimestamp` for a list of valid placeholders