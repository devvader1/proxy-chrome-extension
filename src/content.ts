const formFields = document.querySelectorAll("input, textarea");

formFields.forEach((field) => {
  field.addEventListener("mouseover", function () {
    field.setAttribute(
      "title",
      "⚠️ Connection not encrypted, do not type anything sensitive."
    );
  });
  field.addEventListener("mouseout", function () {
    field.removeAttribute("title");
  });
});
