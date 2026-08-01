(function () {
  const form = document.getElementById("waitlist-form");
  const emailInput = document.getElementById("email");
  const submitBtn = document.getElementById("submit-btn");
  const btnLabel = submitBtn.querySelector(".btn-label");
  const btnSpinner = submitBtn.querySelector(".btn-spinner");
  const formMessage = document.getElementById("form-message");

  document.querySelectorAll(".scroll-to-form, .header-cta[href='#waitlist']").forEach((el) => {
    el.addEventListener("click", (e) => {
      if (el.classList.contains("scroll-to-form")) {
        e.preventDefault();
      }
      emailInput.focus({ preventScroll: false });
      emailInput.scrollIntoView({ behavior: "smooth", block: "center" });
    });
  });

  function setLoading(loading) {
    submitBtn.disabled = loading;
    btnLabel.hidden = loading;
    btnSpinner.hidden = !loading;
  }

  function showMessage(text, type) {
    formMessage.textContent = text;
    formMessage.className = "form-message " + (type || "");
  }

  function isValidEmail(email) {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  }

  form.addEventListener("submit", async (e) => {
    e.preventDefault();

    const email = emailInput.value.trim();
    formMessage.textContent = "";
    formMessage.className = "form-message";

    if (!email) {
      showMessage("Please enter your email address.", "error");
      emailInput.focus();
      return;
    }

    if (!isValidEmail(email)) {
      showMessage("Please enter a valid email address.", "error");
      emailInput.focus();
      return;
    }

    setLoading(true);

    try {
      const res = await fetch("/api/waitlist", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });

      const data = await res.json().catch(() => ({}));

      if (!res.ok) {
        throw new Error(data.error || "Something went wrong. Please try again.");
      }

      showMessage("You're on the list! We'll be in touch soon. 🍵", "success");
      form.reset();
    } catch (err) {
      showMessage(err.message || "Something went wrong. Please try again.", "error");
    } finally {
      setLoading(false);
    }
  });
})();
