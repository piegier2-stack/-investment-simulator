(function () {
  "use strict";

  const integerPattern = /^\d+$/;

  function normalizeNumber(value) {
    return String(value).replace(/[，,\s]/g, "");
  }

  function validatePositiveInteger(value, label) {
    const normalized = normalizeNumber(value);
    if (!normalized) return `${label}を入力してください。`;
    if (!integerPattern.test(normalized)) return `${label}は1以上の整数で入力してください。`;
    const number = Number(normalized);
    if (!Number.isSafeInteger(number) || number < 1) return `${label}は1以上の整数で入力してください。`;
    return "";
  }

  function calculatePrincipal(monthlyAmount, years) {
    const result = Number(normalizeNumber(monthlyAmount)) * 12 * Number(normalizeNumber(years));
    if (!Number.isSafeInteger(result)) throw new RangeError("計算結果が大きすぎます。");
    return result;
  }

  function formatYen(number) {
    return `${new Intl.NumberFormat("ja-JP").format(number)}円`;
  }

  if (typeof document !== "undefined") {
    const form = document.querySelector("#calculator");
    const monthlyInput = document.querySelector("#monthly-amount");
    const yearsInput = document.querySelector("#years");
    const result = document.querySelector("#result");

    function showError(input, message) {
      input.setAttribute("aria-invalid", String(Boolean(message)));
      document.querySelector(`#${input.getAttribute("aria-describedby")}`).textContent = message;
    }

    form.addEventListener("submit", function (event) {
      event.preventDefault();
      const monthlyError = validatePositiveInteger(monthlyInput.value, "毎月の積立額");
      const yearsError = validatePositiveInteger(yearsInput.value, "積立年数");
      showError(monthlyInput, monthlyError);
      showError(yearsInput, yearsError);

      if (monthlyError || yearsError) {
        result.hidden = true;
        (monthlyError ? monthlyInput : yearsInput).focus();
        return;
      }

      try {
        const principal = calculatePrincipal(monthlyInput.value, yearsInput.value);
        document.querySelector("#principal").textContent = formatYen(principal);
        document.querySelector("#calculation").textContent = `${formatYen(Number(normalizeNumber(monthlyInput.value)))} × 12か月 × ${Number(normalizeNumber(yearsInput.value))}年`;
        result.hidden = false;
      } catch (error) {
        showError(monthlyInput, error.message);
        result.hidden = true;
      }
    });

    [monthlyInput, yearsInput].forEach(function (input) {
      input.addEventListener("input", function () {
        if (input.getAttribute("aria-invalid") === "true") showError(input, "");
      });
    });
  }

  if (typeof module !== "undefined") {
    module.exports = { normalizeNumber, validatePositiveInteger, calculatePrincipal, formatYen };
  }
})();
