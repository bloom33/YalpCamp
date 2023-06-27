// Example starter JavaScript for disabling form submissions if there are invalid fields
(() => {
  "use strict";

  //code necessary for script tag in boilerplate, (with 'bs-custom...' code) to get the script code to do its job in displaying the file names of multiple image files
  bsCustomFileInput.init();

  // Fetch all the forms we want to apply custom Bootstrap validation styles to
  const forms = document.querySelectorAll(".validated-form");

  // Loop over them and prevent submission
  //*Make an array from forms and for each form ...
  Array.from(forms).forEach((form) => {
    form.addEventListener(
      "submit",
      (event) => {
        if (!form.checkValidity()) {
          event.preventDefault();
          event.stopPropagation();
        }

        form.classList.add("was-validated");
      },
      false
    );
  });
})();
