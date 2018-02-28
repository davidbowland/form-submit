<?php # form-submit.js demonstration page
function getTimeURI($path) {
  # Append the file modified time to the script name to prevent using cached resources
  $timestamp = base_convert(filemtime($path), 10, 36);
  return "$path?$timestamp"; 
}
?><!DOCTYPE html>
<html>
<head>
  <!-- Settings for demonstration only -->
  <meta http-equiv="content-type" content="text/html;charset=utf-8">
  <meta name="viewport" content="width=device-width,initial-scale=1.0">
  <meta http-equiv="X-UA-Compatible" content="IE=Edge">
  <!-- Fancy import of form-submit.js. defer is supported but not used in
       this case so the formSubmit object is available. -->
  <script src="<?php echo getTimeURI('form-submit.js'); ?>"></script>
  <!-- Styles for demonstration only -->
  <style type="text/css">
form ~ form {
  margin-top: 1.5em;
}
fieldset > div {
  padding: 0.3em;
}
input[type="text"], textarea {
  display: block;
}
[data-form-submit-error-for], [data-form-submit-counter-for] {
  padding: 0.2em;
  font-weight: bold;
  font-size: small;
  font-size: 90%;
  display: block;
}
[data-form-submit-error-for] {
  color: #c00;
}
[name="timestamp"] {
  width: 20em;
}
  </style>
</head>
<body>
<!-- Give feedback when a form submission is received -->
<?php if (isset($_POST['form-number'])): ?>
  <div>
    <h3>Form <?php echo htmlspecialchars($_POST['form-number']); ?> contents were valid.</h3>
  </div>
<?php endif; ?>
  <!-- Test: data-form-submit-required="digits", data-form-submit-required="number", data-form-submit-required="currency",
             data-form-submit-error-msg, and data-form-submit-count="true" -->
  <form action="index.php" method="POST">
    <fieldset>
      <legend>Form 1 - Numbers</legend>
      <div>
        Enter one to ten digits: <!-- Setting data-form-submit-count="true" picks up maxlength -->
        <input type="text" name="digits" maxlength="10" data-form-submit-required="digits" data-form-submit-error-msg="Please enter at least one digit" data-form-submit-count="true" />
      </div>
      <div>
        Any number: <!-- "number" and the previous "digits" are special validation values (see docs) -->
        <input type="text" name="number" data-form-submit-required="number" data-form-submit-error-msg="Please enter a positive or negative number" />
      </div>
      <div>
        Currency: <!-- Error messages can be specified using data-form-submit-error-msg -->
        <input type="text" name="currency" data-form-submit-required="currency" data-form-submit-error-msg="Please enter a currency amount" />
      </div>
      <button type="submit">
        Submit
      </button>
      <input type="hidden" name="form-number" value="1" />
    </fieldset>
  </form>
  <!-- Test: data-form-submit-required="phone", data-form-submit-required="true", data-form-submit-required="zip",
             data-form-submit-required="email", and data-form-submit-error-msg -->
  <form action="index.php" method="POST">
    <fieldset>
      <legend>Form 2 - Contact</legend>
      <div>
        Phone number:
        <input type="text" name="phone" data-form-submit-required="phone" data-form-submit-error-msg="Please enter a phone number" />
      </div>
      <div>
        City (requires any value): <!-- Using "true" here requires any value -->
        <input type="text" name="city" data-form-submit-required="true" data-form-submit-error-msg="Please enter a your city" />
      </div>
      <div>
        State: <!-- Using "true" requires an option where the value is not blank> -->
        <select name="state" data-form-submit-required="true" data-form-submit-error-msg="Please select a state">
          <option value="">Select a state</option>
          <option value="1">Denial</option>
          <option value="A">Emergency</option>
          <option value="3">The Union</option>
        </select>
      </div>
      <div>
        ZIP code:
        <input type="text" name="zip" data-form-submit-required="zip" data-form-submit-error-msg="Please enter a 5-digit ZIP code" data-form-submit-count="5" />
      </div>
      <div>
        ZIP code with optional + 4:
        <input type="text" name="zip-plus-4" data-form-submit-required="zip+4" data-form-submit-error-msg="Please enter a 5- or 9-digit ZIP code" />
      </div>
      <div>
        ZIP code with + 4 required:
        <input type="text" name="zip-full" data-form-submit-required="zip-full" data-form-submit-error-msg="Please enter a 9-digit ZIP code" />
      </div>
      <div>
        Email address:
        <input type="text" name="email" data-form-submit-required="email" data-form-submit-error-msg="Please enter a valid email address" />
      </div>
      <button type="submit">
        Submit
      </button>
      <input type="hidden" name="form-number" value="2" />
    </fieldset>
  </form>
  <!-- Test: data-form-submit-required="timestamp", data-form-submit-required="date-mmddyyyy", data-form-submit-required="date-yyyymmdd",
             data-form-submit-required="time", and data-form-submit-error-msg -->
  <form action="index.php" method="POST">
    <fieldset>
      <legend>Form 3 - Time/date</legend>
      <div>
        Timestamp:
        <input type="text" name="timestamp" data-form-submit-required="timestamp" data-form-submit-error-msg="Please enter a timestamp in the format MM/DD/YYYY HH:MM:SS.MS" />
      </div>
      <div>
        Date:
        <input type="text" name="date-mmddyyyy" data-form-submit-required="date-mmddyyyy" data-form-submit-error-msg="Please enter a date in the format MM/DD/YYYY" />
      </div>
      <div>
        Date:
        <input type="text" name="date-yyyymmdd" data-form-submit-required="date-yyyymmdd" data-form-submit-error-msg="Please enter a date in the format YYYY-MM-DD" />
      </div>
      <div>
        Time:
        <input type="text" name="time" data-form-submit-required="time" data-form-submit-error-msg="Please enter a time in the format HH:MM" />
      </div>
      <button type="submit">
        Submit
      </button>
      <input type="hidden" name="form-number" value="3" />
    </fieldset>
  </form>
  <!-- Test: data-form-submit-required="true", data-form-submit-required="phone",
             data-form-submit-error-msg, and data-form-submit-count with arbitrary values -->
  <form action="index.php" method="POST">
    <fieldset>
      <legend>Form 4 - Text areas</legend>
      <div>
        Enter some text:
        <textarea name="some_text" data-form-submit-required="true" data-form-submit-error-msg="Please enter some text" data-form-submit-count="250"></textarea>
      </div>
      <div>
        Enter more text (optional):
        <textarea name="more_text" data-form-submit-count="350"></textarea>
      </div>
      <div>
        Phone number:
        <textarea name="phone_text" data-form-submit-required="phone" data-form-submit-error-msg="Please enter a phone number" ></textarea>
      </div>
      <button type="submit">
        Submit
      </button>
      <input type="hidden" name="form-number" value="4" />
    </fieldset>
  </form>
  <!-- Test: data-form-submit-required="radio", data-form-submit-required="true" on checkboxes, and data-form-submit-error-msg -->
  <form action="index.php" method="POST">
    <fieldset>
      <legend>Form 5 - Radio buttons and check boxes</legend>
      <div>
        Choose one:<br />
        <input type="radio" name="sondheim" value="1" data-form-submit-required="radio" data-form-submit-error-msg="Please choose a Stephen Sondheim musical" /> West Side Story<br />
        <input type="radio" name="sondheim" value="2" /> A Funny Thing Happened on the Way to the Forum<br />
        <input type="radio" name="sondheim" value="3" /> Sweeney Todd<br />
        <input type="radio" name="sondheim" value="4" /> Assassins
      </div>
      <div>
        Choose one:<br />
        <input type="radio" name="wavefunction" value="everett" data-form-submit-required="radio" data-form-submit-error-msg="Please choose a quantum mechanism interpretation" /> Many-worlds interpretation<br />
        <input type="radio" name="wavefunction" value="bohr" /> Copenhagen interpretation<br />
        <input type="radio" name="wavefunction" value="bohm" /> Bohm's interpretation
      </div>
      <div>
        Check this box to continue:<br />
        <input type="checkbox" name="very-agreeable" id="very-agreeable" value="Y" data-form-submit-required="true" data-form-submit-error-msg="You must agree to continue" />
        <label for="very-agreeable">I&nbsp;agree</label>
        <div data-form-submit-error-for="very-agreeable"></div>
      </div>
      <button type="submit">
        Submit
      </button>
      <input type="hidden" name="form-number" value="5" />
    </fieldset>
  </form>
  <!-- Test: data-form-submit-required="url", data-form-submit-required="url-http", data-form-submit-required="url-part", data-form-submit-required="hostname", data-form-submit-required="domain", data-form-submit-required="ip-address", and data-form-submit-error-msg -->
  <form action="index.php" method="POST">
    <fieldset>
        <legend>Form 6 - Web addresses</legend>
       <div>
        URL:
        <input type="text" name="url" data-form-submit-required="url" data-form-submit-error-msg="Please enter a valid URL" />
      </div>
      <div>
        URL with http/https:
        <input type="text" name="url-http" data-form-submit-required="url-http" data-form-submit-error-msg="Please enter a valid HTTP URL" />
      </div>
      <div>
        Path portion of URL (after first / after hostname):
        <input type="text" name="url-path" data-form-submit-required="url-path" data-form-submit-error-msg="Please enter a URL path, the part of the URL after the hostname" />
      </div>
      <div>
        Hostname:
        <input type="text" name="hostname" data-form-submit-required="hostname" data-form-submit-error-msg="Please enter a valid hostname, ex www.google.com" />
      </div>
      <div>
        Domain:
        <input type="text" name="domain" data-form-submit-required="domain" data-form-submit-error-msg="Please enter a valid domain, ex google.com" />
      </div>
      <div>
        IP Address:
        <input type="text" name="ip-address" data-form-submit-required="ip-address" data-form-submit-error-msg="Please enter a valid IP address, ex 192.168.3.14" />
      </div>
      <button type="submit">
        Submit
      </button>
      <input type="hidden" name="form-number" value="6" />
    </fieldset>
  </form>
  <!-- Test: data-form-submit-required="url", data-form-submit-required="url-http", data-form-submit-required="url-part", data-form-submit-required="hostname", data-form-submit-required="domain", data-form-submit-required="ip-address", and data-form-submit-error-msg -->
  <form action="index.php" method="POST">
    <fieldset>
        <legend>Form 7 - Sensitive data</legend>
        <strong>Please only submit fictitious test data</strong>
       <div>
        Social security number:
        <input type="text" name="ssn" data-form-submit-required="ssn" data-form-submit-error-msg="Please enter a valid SSN, ex. 123-45-6789" />
      </div>
      <div>
        ABA routing number (for ACH, found on bottom of checks):
        <input type="text" name="aba-routing" data-form-submit-required="aba-routing" data-form-submit-error-msg="Please enter a valid ABA routing number, ex. 011000015" maxlength="9" data-form-submit-count="true" />
      </div>
      <div>
        Credit card:
        <input type="text" name="credit-card" data-form-submit-required="credit-card" data-form-submit-error-msg="Please enter a valid credit card number, ex. 4111 1111 1111 1111" />
      </div>
      <div>
        CVV (on back of credit card):
        <input type="text" name="cvv" data-form-submit-required="cvv" data-form-submit-error-msg="Please enter a CVV number, ex. 123" />
      </div>
      <button type="submit">
        Submit
      </button>
      <input type="hidden" name="form-number" value="7" />
    </fieldset>
  </form>
  <!-- Test: data-form-submit-regex, data-form-submit-group, form-submit-error-for, and JavaScript API -->
  <form action="index.php" method="POST">
    <fieldset>
      <legend>Form 8 - Fanciness</legend>
      <div>
        Enter a number less than 50:
        <input type="text" name="lessthan50" id="lessthan50" />
      </div>
      <div>
        Double the above number:
        <input type="text" name="doubled" id="doubled" />
      </div>
      <div>
        Enter a date in the format (D, M YYYY):
        <input type="text" name="date-weird" id="date-weird" placeholder="d, m yyyy" />
      </div>
      <div>
        Enter the same word twice:
        <input type="text" name="regex" placeholder="pizza pizza" data-form-submit-regex="([a-zA-Z]+)\W*(\1)" />
      </div>
      <div>
        Enter two words so the top word comes first alphabetically:
        <input type="text" name="alpha-left" id="alpha-left" data-form-submit-group="alpha-input" />
        <input type="text" name="alpha-right" id="alpha-right" data-form-submit-group="alpha-input" />
        <div data-form-submit-error-for="alpha-input"></div>
      </div>
      <div>
        Check exactly three options:
        <input type="checkbox" name="checkbox-option-1" id="checkbox-option-1" data-form-submit-group="checkbox-options" value="1" /><label for="checkbox-option-1">1</label>
        <input type="checkbox" name="checkbox-option-2" id="checkbox-option-2" data-form-submit-group="checkbox-options" value="2" /><label for="checkbox-option-2">2</label>
        <input type="checkbox" name="checkbox-option-3" id="checkbox-option-3" data-form-submit-group="checkbox-options" value="3" /><label for="checkbox-option-3">3</label>
        <input type="checkbox" name="checkbox-option-4" id="checkbox-option-4" data-form-submit-group="checkbox-options" value="4" /><label for="checkbox-option-4">4</label>
        <input type="checkbox" name="checkbox-option-5" id="checkbox-option-5" data-form-submit-group="checkbox-options" value="5" /><label for="checkbox-option-5">5</label>
        <div data-form-submit-error-for="checkbox-options"></div>
      </div>
      <button type="submit">
        Submit
      </button>
      <input type="hidden" name="form-number" value="8" />
    </fieldset>
  </form>
  <script type="text/javascript">'use strict';
// Note this code could be executed in the header using an on load function such as DOMContentLoaded or the event provided by jQuery.
formSubmit.addValidation(document.getElementById('lessthan50'), function(value, el) { // Number less than 50
  var num = parseInt(value);
  if (isNaN(num)) { // Invalid number
    return 'Invalid number';
  } else if (num == 50) {
    return '50 is not less than 50'; // As many messages as are necessary
  } else if (num >= 50) {
    return 'Number must be less than 50';
  }
  return ''; // Validated!
// formSubmit functions return the formSubmit object (when practical) for chaining
}).addValidation(document.getElementById('doubled'), function(value, el) { // Double less-than-50 input
  var num = parseInt(value),
      el50 = document.getElementById('lessthan50'),
      num50 = parseInt(el50.value);
  if (isNaN(num)) {
    return 'Invalid number';
  } else if (formSubmit.getErrorMessage(el50) || isNaN(num50)) {
    return 'Less than 50 field is invalid';
  } else if (num50 * 2 != num) {
    return 'Value ' + num + ' does not match expected value ' + (num50 * 2);
  }
  return '';
// 
}).addValidation(document.getElementById('date-weird'), function(value, el) { // Weird date format
  var formattedStr;
  // If the date is in out expected format, leave it alone
  if (!formSubmit.validation.isDate(value, 'd, m yyyy')) {
    // Date was not in a valid format. Try to put it in a valid format.
    formattedStr = formSubmit.validation.formatDate(value, 'd, m yyyy');
    if (formSubmit.validation.isDate(formattedStr, 'd, m yyyy')) {
      // Formatted string is valid
      el.value = formattedStr;
    } else {
      return 'Please enter a date in the bizarre format "D, M YYYY"';
    }
  }
  return '';
}).addValidation('input[data-form-submit-group="alpha-input"]', function(value, el) { // Alphabetical inputs
  var alphaLeft = document.getElementById('alpha-left').value,
      alphaRight = document.getElementById('alpha-right').value;
  if (!alphaLeft.length || !alphaRight.length) {
    return 'Please enter a word in both boxes.';
  } else if (alphaLeft.toLowerCase() >= alphaRight.toLowerCase()) {
    // Injection protection is always enabled
    return '"' + alphaLeft + '" does not come before "' + alphaRight + '" alphabetically.';
  }
  return '';
}).addValidation('input[data-form-submit-group="checkbox-options"]', function(value, el) { // Checkbox options
  var checked = document.querySelectorAll('input[data-form-submit-group="checkbox-options"]:checked').length,
      difference = Math.abs(3 - checked);
  if (difference) {
    return 'Please ' + (checked < 3 ? 'check' : 'uncheck') + ' ' +
            difference.toString() + ' more ' +
            (difference == 1 ? 'option' : 'options');
  }
  return '';

});
  </script>
  <!-- Test: data-form-submit-optional, data-form-submit-error-msg, and data-form-submit-count -->
  <form action="index.php" method="POST">
    <fieldset>
      <legend>Form 9 - All optional</legend>
      <div>
        Enter one to ten digits:
        <input type="text" name="digits-optional" maxlength="10" data-form-submit-optional="digits" data-form-submit-count="true" />
      </div>
      <div>
        Any number:
        <input type="text" name="number-optional" data-form-submit-optional="number" />
      </div>
      <div>
        Currency:
        <input type="text" name="currency-optional" data-form-submit-optional="currency" />
      </div>
      <div>
        Phone number:
        <input type="text" name="phone-optional" data-form-submit-optional="phone" data-form-submit-error-msg="Invalid phone number" />
      </div>
      <div>
        ZIP code:
        <input type="text" name="zip-optional" data-form-submit-optional="zip" data-form-submit-error-msg="Invalid ZIP code" data-form-submit-count="5" />
      </div>
      <div>
        Email address:
        <input type="text" name="email-optional" data-form-submit-optional="email" data-form-submit-error-msg="Invalid email address" />
      </div>
      <div>
        Timestamp:
        <input type="text" name="timestamp-optional" data-form-submit-optional="timestamp" data-form-submit-error-msg="Invalid timestamp" />
      </div>
      <div>
        Date:
        <input type="text" name="date-mmddyyyy-optional" data-form-submit-optional="date-mmddyyyy" data-form-submit-error-msg="Invalid date, use MM/DD/YYYY" />
      </div>
      <div>
        Date:
        <input type="text" name="date-yyyymmdd-optional" data-form-submit-optional="date-yyyymmdd" data-form-submit-error-msg="Invalid date, use YYYY-MM-DD" />
      </div>
      <div>
        Time:
        <input type="text" name="time-optional" data-form-submit-optional="time" data-form-submit-error-msg="Invalid time" />
      </div>
       <div>
        URL:
        <input type="text" name="url-optional" data-form-submit-optional="url" data-form-submit-error-msg="Please enter a valid URL" />
      </div>
      <div>
        URL with http/https:
        <input type="text" name="url-http-optional" data-form-submit-optional="url-http" data-form-submit-error-msg="Please enter a valid HTTP URL" />
      </div>
      <div>
        Path portion of URL (after first / after hostname):
        <input type="text" name="url-path-optional" data-form-submit-optional="url-path" data-form-submit-error-msg="Please enter a URL path, the part of the URL after the hostname" />
      </div>
      <div>
        Hostname:
        <input type="text" name="hostname-optional" data-form-submit-optional="hostname" data-form-submit-error-msg="Please enter a valid hostname, ex www.google.com" />
      </div>
      <div>
        Domain:
        <input type="text" name="domain-optional" data-form-submit-optional="domain" data-form-submit-error-msg="Please enter a valid domain, ex google.com" />
      </div>
      <div>
        IP Address:
        <input type="text" name="ip-address-optional" data-form-submit-optional="ip-address" data-form-submit-error-msg="Please enter a valid IP address, ex 192.168.3.14" />
      </div>
      <strong>Please only submit fictitious test data</strong>
       <div>
        Social security number:
        <input type="text" name="ssn-optional" data-form-submit-optional="ssn" data-form-submit-error-msg="Please enter a valid SSN" />
      </div>
      <div>
        ABA routing number (for ACH, bottom of checks):
        <input type="text" name="aba-routing-optional" data-form-submit-optional="aba-routing" data-form-submit-error-msg="Please enter a valid ABA routing number, ex. 081501696" maxlength="9" data-form-submit-count="true" />
      </div>
      <div>
        Credit card:
        <input type="text" name="credit-card-optional" data-form-submit-optional="credit-card" data-form-submit-error-msg="Please enter a valid credit card number, ex 4111 1111 1111 1111" />
      </div>
      <div>
        CVV (on back of credit card):
        <input type="text" name="cvv-optional" data-form-submit-optional="cvv" data-form-submit-error-msg="Please enter a CVV number" />
      </div>
      <button type="submit">
        Submit
      </button>
      <input type="hidden" name="form-number" value="9" />
    </fieldset>
  </form>
</body>
</html>