/**
 * Formulario de contacto — validación y envío vía Formspree (fetch)
 */
(function () {
  "use strict";

  var form = document.getElementById("contact-form");
  if (!form) return;

  var feedback = document.getElementById("form-feedback");
  var submitBtn = document.getElementById("form-submit");
  var labelEl = submitBtn ? submitBtn.querySelector(".btn__label") : null;
  var loadingEl = submitBtn ? submitBtn.querySelector(".btn__loading") : null;

  var requiredFields = [
    { id: "fullName", name: "Nombre completo" },
    { id: "birthDate", name: "Fecha de nacimiento" },
    { id: "email", name: "Email" },
    { id: "phone", name: "Teléfono" },
  ];

  function setFeedback(type, message) {
    if (!feedback) return;
    feedback.textContent = message;
    feedback.classList.remove("is-success", "is-error");
    if (type === "success") {
      feedback.classList.add("is-success");
    } else if (type === "error") {
      feedback.classList.add("is-error");
    }
  }

  function clearFieldErrors() {
    requiredFields.forEach(function (f) {
      var input = document.getElementById(f.id);
      var err = document.getElementById(f.id + "-error");
      if (input) {
        input.classList.remove("is-invalid");
        input.removeAttribute("aria-invalid");
      }
      if (err) err.textContent = "";
    });
  }

  function showFieldError(fieldId, msg) {
    var input = document.getElementById(fieldId);
    var err = document.getElementById(fieldId + "-error");
    if (input) {
      input.classList.add("is-invalid");
      input.setAttribute("aria-invalid", "true");
    }
    if (err) err.textContent = msg;
  }

  function validateEmail(value) {
    var re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(String(value).trim());
  }

  function validate() {
    clearFieldErrors();
    var ok = true;

    requiredFields.forEach(function (f) {
      var input = document.getElementById(f.id);
      if (!input) return;
      var v = input.value.trim();
      if (!v) {
        showFieldError(f.id, "Completá " + f.name.toLowerCase() + ".");
        ok = false;
      }
    });

    var email = document.getElementById("email");
    if (email && email.value.trim() && !validateEmail(email.value)) {
      showFieldError("email", "Ingresá un email válido.");
      ok = false;
    }

    return ok;
  }

  function setLoading(loading) {
    if (!submitBtn) return;
    submitBtn.disabled = loading;
    if (labelEl && loadingEl) {
      if (loading) {
        labelEl.classList.add("visually-hidden");
        loadingEl.classList.remove("visually-hidden");
        loadingEl.setAttribute("aria-hidden", "false");
      } else {
        labelEl.classList.remove("visually-hidden");
        loadingEl.classList.add("visually-hidden");
        loadingEl.setAttribute("aria-hidden", "true");
      }
    }
  }

  form.addEventListener("submit", function (e) {
    e.preventDefault();
    setFeedback("", "");

    if (!validate()) {
      setFeedback("error", "Revisá los campos marcados e intentá de nuevo.");
      return;
    }

    var action = form.getAttribute("action") || "";
    if (action.indexOf("YOUR_FORM_ID") !== -1) {
      setFeedback(
        "error",
        "Falta configurar Formspree: en index.html reemplazá YOUR_FORM_ID en la URL del formulario por el ID de tu formulario."
      );
      return;
    }

    var formData = new FormData(form);

    /* Unificar checkboxes de días y horarios en texto legible para el email */
    var days = [];
    form.querySelectorAll('input[name="daysAvailable"]:checked').forEach(function (cb) {
      days.push(cb.value);
    });
    formData.delete("daysAvailable");
    if (days.length) {
      formData.append("daysAvailable", days.join(", "));
    }

    var slots = [];
    form.querySelectorAll('input[name="timeSlots"]:checked').forEach(function (cb) {
      slots.push(cb.value);
    });
    formData.delete("timeSlots");
    if (slots.length) {
      formData.append("timeSlots", slots.join(", "));
    }

    setLoading(true);

    fetch(action, {
      method: "POST",
      body: formData,
      headers: {
        Accept: "application/json",
      },
    })
      .then(function (response) {
        if (response.ok) {
          setFeedback(
            "success",
            "¡Gracias! Tu mensaje fue enviado. Te responderé a la brevedad."
          );
          form.reset();
          clearFieldErrors();
          return;
        }
        return response.json().then(function (data) {
          var msg =
            data && (data.error || (data.errors && data.errors[0] && data.errors[0].message))
              ? String(data.error || data.errors[0].message)
              : "No se pudo enviar. Probá de nuevo en unos minutos.";
          setFeedback("error", msg);
        });
      })
      .catch(function () {
        setFeedback(
          "error",
          "Hubo un error al enviar. Verificá tu conexión o intentá más tarde."
        );
      })
      .finally(function () {
        setLoading(false);
      });
  });
})();
