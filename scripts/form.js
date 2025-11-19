// scripts/form.js

const validation_config = {
  email: {
    pattern: "[a-zA-Z0-9._%+\\-]+@[a-zA-Z0-9.\\-]+\\.[a-zA-Z]{2,}",
  },
  web: {
    pattern: "https?://.+",
  },
  postcode: {
    pattern: "^[A-Z]{1,2}[0-9R][0-9A-Z]? ?[0-9][A-Z]{2}$",
  },
  tel: {
    pattern: "[\\+]?[0-9\\s\\-\\(\\)]{10,20}",
    min: 10,
  },
  fax: {
    pattern: "[\\+]?[0-9\\s\\-\\(\\)]{10,20}",
  },
  dd: {
    pattern: "^(0?[1-9]|[12][0-9]|3[01])$",
    min: 2,
    inputmode: "numeric",
    placeholder: "DD",
  },
  mm: {
    pattern: "^(0?[1-9]|1[012])$",
    min: 2,
    inputmode: "numeric",
    placeholder: "MM",
  },
  yyyy: {
    pattern: "^[0-9]{4}$",
    min: 4,
    inputmode: "numeric",
    placeholder: "YYYY",
  },
  bank_acc_no: {
    pattern: "[0-9]{8}",
    min: 8,
    max: 8,
    inputmode: "numeric",
    placeholder: "e.g. 12345678",
  },
  sortcode: {
    pattern: "[0-9]{2}-?[0-9]{2}-?[0-9]{2}",
    min: 6,
    max: 8,
    inputmode: "numeric",
    placeholder: "e.g. 12-34-56 or 123456",
  },
  company_reg_no: {
    pattern: "^[0-9]{8}$|^[A-Z]{2}[0-9]{6}$",
    min: 8,
    max: 8,
    placeholder: "e.g. 12345678 or SC123456",
  },
};

const formData = {
  stepOne: {
    label: "Company Information",
    data: {
      company_name: "",
      trading_name: "",
      vat: "",
      eori: "",
      web: "",
      invoice_address: "",
      postcode: "", // Fixed: was post_code
      tel: "",
      email: "",
      fax: "",
      contact_buying: {
        name: "",
        email: "",
      },
      contact_accounts: {
        name: "",
        email: "",
      },
      bb_login: {
        status: "not-required",
        name: "",
        email: "",
      },
    },
  },
  stepTwo: {
    label: "Ltd Company Details",
    data: {
      company_details: {
        reg_no: "",
        tel: "",
        email: "",
        registered_office_address: "",
        postcode: "", // Fixed: was post_code
        incorporation: {
          dd: "",
          mm: "",
          yyyy: "",
        },
      },
    },
  },
  stepThree: {
    label: "Company Interests",
    data: {
      business_type: {
        wholesaler: false,
        retailer: false,
        ecom: false,
        distributor: false,
        partnership: false,
        sole_trader: false,
      },
      product_of_interest: {
        dvd_bluray: false,
        music_cd: false,
        vinyl: false,
        merchandise: false,
        consumer_electronics: false,
        catalogue: false,
        campaigns: false,
        overstocks_deals: false,
        other: "",
      },
    },
  },
  stepFour: {
    label: "Bank Details",
    data: {
      bank_details: {
        name: "",
        account_no: "",
        sort_code: "",
        address: "",
        postcode: "", // Fixed: was post_code
        tel: "",
        member_since: {
          dd: "",
          mm: "",
          yyyy: "",
        },
      },
    },
  },
};

document.addEventListener("alpine:init", () => {
  Alpine.data("appForm", () => ({
    isDebug: true,
    step: 1,
    stepTracker: 1,
    maxSteps: 4,
    validation_config,
    formData,
    getSectionFormElements(section) {
      const formElements = section.querySelectorAll("input, textarea, select");
      const requiredElements = section.querySelectorAll("[required]");
      const invalidElements = section.querySelectorAll(":invalid");

      const visibleElements = Array.from(formElements).filter(
        (el) => el.offsetParent !== null && !el.disabled
      );

      return {
        all: formElements,
        required: requiredElements,
        visible: visibleElements,
        isValid: invalidElements.length === 0,
        requiredCount: requiredElements.length,
        invalidElements: Array.from(invalidElements),
      };
    },

    createError(formEl, msg) {
      if (formEl.nodeName === "FIELDSET") return;

      const row = formEl.closest(".form__row");
      if (!row) return;

      // Remove existing error first
      this.removeError(formEl);

      // Create new error element
      const el = document.createElement("div");
      el.classList.add("form__row__error");
      el.textContent = msg;

      // Append to form row
      row.appendChild(el);
      formEl.classList.add("invalid");
    },

    removeError(formEl) {
      const row = formEl.closest(".form__row");
      if (!row) return;

      const existingError = row.querySelector(".form__row__error");
      if (existingError) {
        existingError.remove();
      }
      formEl.classList.remove("invalid");
    },

    patternMsg(pattern) {
      // Fixed: Use if/else instead of invalid switch syntax
      if (pattern === this.validation_config.email.pattern) {
        return "Expecting a valid email address";
      } else if (pattern === this.validation_config.web.pattern) {
        return "Please enter a valid web address, including http(s)://";
      } else if (pattern === this.validation_config.postcode.pattern) {
        // Fixed typo
        return "Please enter a valid UK post code";
      } else if (pattern === this.validation_config.tel.pattern) {
        return "Please enter a valid UK phone number";
      } else if (pattern === this.validation_config.fax.pattern) {
        return "Please enter a valid fax number";
      } else if (pattern === this.validation_config.dd.pattern) {
        return "Please enter a valid day (DD)";
      } else if (pattern === this.validation_config.mm.pattern) {
        return "Please enter a valid month (MM)";
      } else if (pattern === this.validation_config.yyyy.pattern) {
        return "Please enter a valid year (YYYY)";
      } else if (pattern === this.validation_config.bank_acc_no.pattern) {
        return `Please enter a valid UK Bank Account number. ${this.validation_config.bank_acc_no.placeholder}`;
      } else if (pattern === this.validation_config.sortcode.pattern) {
        return `Please enter a valid UK Bank Account Sort code. ${this.validation_config.sortcode.placeholder}`;
      } else {
        return "Invalid value";
      }
    },

    setValidity(formEl, state) {
      const errorList = [];

      if (state.valueMissing) {
        errorList.push("This is a required field");
      }

      if (state.tooLong) {
        errorList.push("Too many characters");
      }

      if (state.tooShort) {
        errorList.push("Not enough characters");
      }

      if (state.patternMismatch) {
        errorList.push(this.patternMsg(formEl.getAttribute("pattern")));
      }

      if (state.typeMismatch) {
        errorList.push("Invalid format");
      }

      if (state.rangeOverflow) {
        errorList.push("Value too high");
      }

      if (state.rangeUnderflow) {
        errorList.push("Value too low");
      }

      return errorList;
    },

    addInputListener(formEl) {
      formEl.addEventListener("input", (e) => {
        // Check validity after user types
        if (!formEl.checkValidity()) {
          const errorMsg = this.setValidity(formEl, formEl.validity).join(", ");
          this.createError(formEl, errorMsg);
        } else {
          this.removeError(formEl);
        }
      });

      // Also listen for blur event for better UX
      formEl.addEventListener("blur", (e) => {
        if (!formEl.checkValidity()) {
          const errorMsg = this.setValidity(formEl, formEl.validity).join(", ");
          this.createError(formEl, errorMsg);
        }
      });
    },
    addInputListeners(allFormEls) {
      allFormEls.forEach((el) => this.addInputListener(el));
    },

    watchLoginStatusSelect() {
      // Watch the status and auto-populate
      this.$watch("formData.stepOne.data.bb_login.status", (value) => {
        if (value === "use-buying") {
          this.formData.stepOne.data.bb_login.name =
            this.formData.stepOne.data.contact_buying.name;
          this.formData.stepOne.data.bb_login.email =
            this.formData.stepOne.data.contact_buying.email;
        } else if (value === "use-accounts") {
          this.formData.stepOne.data.bb_login.name =
            this.formData.stepOne.data.contact_accounts.name;
          this.formData.stepOne.data.bb_login.email =
            this.formData.stepOne.data.contact_accounts.email;
        } else {
          this.formData.stepOne.data.bb_login.name = "";
          this.formData.stepOne.data.bb_login.email = "";
        }
      });

      // Watch buying contact changes and update BB login if selected
      this.$watch("formData.stepOne.data.contact_buying.name", (newName) => {
        if (this.formData.stepOne.data.bb_login.status === "use-buying") {
          this.formData.stepOne.data.bb_login.name = newName;
        }
      });

      this.$watch("formData.stepOne.data.contact_buying.email", (newEmail) => {
        if (this.formData.stepOne.data.bb_login.status === "use-buying") {
          this.formData.stepOne.data.bb_login.email = newEmail;
        }
      });

      // Watch accounts contact changes and update BB login if selected
      this.$watch("formData.stepOne.data.contact_accounts.name", (newName) => {
        if (this.formData.stepOne.data.bb_login.status === "use-accounts") {
          this.formData.stepOne.data.bb_login.name = newName;
        }
      });

      this.$watch(
        "formData.stepOne.data.contact_accounts.email",
        (newEmail) => {
          if (this.formData.stepOne.data.bb_login.status === "use-accounts") {
            this.formData.stepOne.data.bb_login.email = newEmail;
          }
        }
      );
    },

    init() {
      this.watchLoginStatusSelect();
      const sectionRef = this.$refs.sectionOne;
      if (sectionRef) {
        const { all } = this.getSectionFormElements(sectionRef);
        this.addInputListeners(all);
      }
    },

    getSection() {
      const alias = ["sectionOne", "sectionTwo", "sectionThree", "sectionFour"];
      return alias[this.step - 1];
    },

    prefillData() {
      // Prefill form data for testing
      const section = this.getSection();
      const sectionRef = this.$refs[section];

      if (!sectionRef) return;

      sectionRef.setAttribute("style", "--eager:true");
      const { all } = this.getSectionFormElements(sectionRef);
      all.forEach((el) => {
        const testValue = el.getAttribute("data-test");
        if (testValue) {
          el.value = testValue;
          el.dispatchEvent(new Event("input", { bubbles: true }));
          el.dispatchEvent(new Event("change", { bubbles: true }));
        }
      });
    },

    goto(direction) {
      if (direction === "next") {
        const section = this.getSection();
        const sectionRef = this.$refs[section];

        if (!sectionRef) {
          console.warn(`Section ${section} not found`);
          return;
        }

        const { invalidElements } = this.getSectionFormElements(sectionRef);

        if (invalidElements && invalidElements.length > 0) {
          invalidElements.forEach((el) => {
            const errorMsg = this.setValidity(el, el.validity).join(", ");
            this.createError(el, errorMsg); // Uncommented for error display
            if (this.isDebug) {
              console.log("Invalid element:", el, el.validity);
            }
          });
          // Focus on first invalid element
          invalidElements[0].focus();
        } else {
          if (this.step < this.maxSteps) {
            this.step++;
            if (this.step > this.stepTracker) {
              this.stepTracker++;
              const section = this.getSection();
              const { all } = this.getSectionFormElements(this.$refs[section]);
              this.addInputListeners(all);
            }
          }
        }
      } else if (direction === "prev") {
        // Fixed: changed from else if to else if
        if (this.step !== 1) {
          // Fixed: changed from 0 to 1
          this.step--;
        }
      } else {
        console.warn("param for form steps should be next or prev");
      }

      // Access formContainer through $refs when method is called
      if (this.$refs.formContainer) {
        this.$refs.formContainer.scrollIntoView({
          block: "start",
          behavior: "smooth",
        });
      }
    },
  }));
});
