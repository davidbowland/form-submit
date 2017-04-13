# form-submit
Simple, powerful and extensible JavaScript form validation

## HTML-driven
Most validation can be achieved by including one or more attributes on form fields (input, select, textarea). Form submission is automatically prevented when any form does not pass validation.

#### HTML attributes and possible values

* `data-form-submit-required`  
   (specify error text with data-form-submit-error-msg, placeholders are added when the attribute is absent)  
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

* `data-form-submit-error-msg`
   * `?` - Message to display when `data-form-submit-required` or `data-form-submit-regex` fails

* `data-form-submit-error-for`
   * `?` - Designates an element as a space for error message for a specific ID

* `data-form-submit-regex`   
   (alternative to `data-form-submit-required`, specify error text with `data-form-submit-error-msg`)  
   * `?` - Regular expression (JavaScript syntax) to validate field value

* `data-form-submit-count`
   * `?` - Display character counter where ? is the max char count
   * `true` - Display character counter where `maxlength` property determines max char count

* `data-form-submit-counter-for`
   * `?` - Designates an element as a space for character counter text for a specific ID

* `data-form-submit-always-allow`
   * `true` - Designates a *form* to always allow submission regardless of field validation


#### CSS for added elements

* `data-form-submit-error-for` and `data-form-submit-counter-for` properties are added automatically and can be used to style. If a field is missing an ID the field's name is used as the property's value.


## Extensible through JavaScript

#### JavaScript API
   Note: For ease of use all functions that do not return a value return the formSubmit object (for chaining).  

* `formSubmit.addValidation(<element>, <callback(value, element)>)`  
   ex: `formSubmit.addValidation(document.getElementById('fnord'), function(value) { return value.length == 0 ? 'Please enter a value' : ''; })`
   * Adds validation to an element (input, textarea, select). The callback is called using the current value and the element itself and should return either an error message or an empty string (false value).

* `formSubmit.removeValidation(<element>)`  
   ex: `formSubmit.removeValidation(document.getElementById('fnord'))`
   * Removes validation from an element (input, textarea, select).

* `formSubmit.getErrorMessage(<element>)`  
   ex: `formSubmit.getErrorMessage(document.getElementById('fnord'))`
   * Returns the element's error text if present or undefined if no validation is specified.

* `formSubmit.isValid(<element>)`  
   ex: `formSubmit.isValid(document.getElementById('fnord'))`
   * Returns true if the element's value is valid *or has no validation*, otherwise false.

* `formSubmit.displayErrorMessage(<element>, <message>)`  
   ex: `formSubmit.displayErrorMessage(document.getElementById('fnord'), 'The value you entered is invalid')`
   * Immediately displays a custom error message for a element.

* `formSubmit.removeErrorMessage(<element>)`  
   ex: `formSubmit.removeErrorMessage(document.getElementById('fnord'))`
   * Removes all text from the error message element but *does not alter CSS*.

* `formSubmit.getErrorMessageElement(<element>)`  
   ex: `formSubmit.getErrorMessageElement(document.getElementById('fnord'))`
   * Returns the element that will contain the error message of the passed element, *creating the element if necessary*.

* `formSubmit.addCounter(<element>, <maxlength>)`  
   ex: `formSubmit.addCounter(document.getElementById('fnord'))` or `formSubmit.addCounter(document.getElementById('fnord'), 100)`
   * Adds a character counter to an element (input, textarea) with an optional maximum count specified. If the max count is not specified it will be taken from properties. Property `data-form-submit-count` is added if not present.

* `formSubmit.removeCounter(<element>)`  
   ex: `formSubmit.removeCounter(document.getElementById('fnord'))`
   * Removes a character counter from an element (input, textarea).

* `formSubmit.getCounterElement(<element>)`  
   ex: `formSubmit.getCounterElement(document.getElementById('fnord'))`
   * Returns the element that will contain the character count of the passed element, *creating the element if necessary*.

* `formSubmit.unload()`  
   * Removes all validation and counter events. Made available for debugging.
