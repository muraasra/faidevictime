<template>
  <div class="quote-page py-12 px-6 md:px-12">
    <!-- Notifications Toast -->
    <div
      v-if="toastMessage"
      :class="['toast fixed top-4 right-4 px-6 py-3 rounded-lg shadow-lg text-white z-50', toastClass]"
      @click="closeToast"
    >
      <p>{{ toastMessage }}</p>
    </div>

    <div class="main-content flex flex-col md:flex-row justify-between gap-12 mx-auto max-w-screen-xl mt-6">
      <!-- Left Section -->
      <div class="left-section flex-1 max-w-lg text-white">
        <h1 class="gradient-text text-4xl font-semibold mb-4">
          Request a Quote for Professional Services
        </h1>
        <p class="mb-6 ">
          Partner with our expert team to receive personalized services tailored to your needs.
        </p>
        <div class="contact-details bg-blue-950/80 p-6 rounded-md shadow-lg">
          
          <div class="mb-4">
            
            <h2 class="text-xl font-semibold mb-2">📍 Our Address</h2>
            <p class="ml-8">1234 city, Montreal, QC, Canada</p>
          </div>
          <div class="mb-4">
            <h2 class="text-xl font-semibold mb-2">📞 Contact</h2>
            <p class="ml-8"> Phone: +1 (123) 456-7890</p>
            <p class="ml-8"> Mail: contact@yourcompany.com</p>
          </div>
          <div>
            <h2 class="text-xl font-semibold mb-2">⏱ Working Hours</h2>
            <p class="ml-8">Monday - Friday: 9:00 AM - 6:00 PM</p>
            <p class="ml-8">Saturday: 10:00 AM - 4:00 PM</p>
            <p class="ml-8">Sunday: Closed</p>
          </div>
        </div>
      </div>



      <!-- Right Section (Form) -->
      <form
        class="quote-form flex-1 max-w-lg bg-blue-950/90 p-6 rounded-md shadow-lg text-white"
        @submit.prevent="submitForm"
      >
        <div class="form-group mb-4">
          <label for="email" class="block text-sm text-gray-300 mb-2">Email Address *</label>
          <input
            type="email"
            id="email"
            v-model="form.email"
            required
            placeholder="Enter your email"
            class="w-full p-3 border border-gray-300 rounded-md bg-white text-black focus:outline-none focus:ring-2 focus:ring-primary"
          />
        </div>

        <div class="form-group mb-4">
          <label for="service" class="block text-sm text-gray-300 mb-2">Select Service *</label>
          <select
            id="service"
            v-model="form.service"
            required
            class="w-full p-3 border border-gray-300 rounded-md bg-white text-black focus:outline-none focus:ring-2 focus:ring-primary"
          >
            <option value="" disabled>-- Choose a Service --</option>
            <option value="accounting">Accounting</option>
            <option value="taxation">Taxation</option>
            <option value="consulting">Consulting</option>
          </select>
        </div>

        <div class="form-group mb-4">
          <label for="content" class="block text-sm text-gray-300 mb-2 ">Your Request *</label>
          <textarea
            id="content"
            v-model="form.content"
            required
            placeholder="Describe your project or needs"
            class="w-full p-3 border border-gray-300 rounded-md bg-white text-black focus:outline-none focus:ring-2 focus:ring-primary"
          ></textarea>
        </div>
        <br>
        <br>
        <button
          type="submit"
          class="submit-button w-full bg-primary btn text-white py-3 px-6 rounded-md hover:bg-box transition duration-300 "
        >
          Submit Request
        </button>
      </form>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      form: {
        email: "",
        service: "",
        content: "",
      },
      toastMessage: "",
      toastClass: "",
    };
  },
  methods: {
    async submitForm() {
      try {
        const response = await fetch("/api/quote", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(this.form),
        });

        if (!response.ok) {
          throw new Error("An error occurred while submitting the form");
        }

        this.showToast("Your request has been sent successfully!", "bg-green-500");
        this.resetForm();
      } catch (error) {
        this.showToast("An error occurred: " + error.message, "bg-red-500");
      }
    },
    resetForm() {
      this.form = {
        email: "",
        service: "",
        content: "",
      };
    },
    showToast(message, toastClass) {
      this.toastMessage = message;
      this.toastClass = toastClass;
      setTimeout(() => {
        this.toastMessage = "";
      }, 5000);
    },
    closeToast() {
      this.toastMessage = "";
    },
  },
};
</script>

<style scoped>
.gradient-text {
  font-size: 2rem;
  font-weight: bold;
  background: linear-gradient(to right, #3697ed, #5cb85c);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
}

.text-primary {
  color: rgb(var(--color-primary));
}

.toast {
  cursor: pointer;
}

.submit-button {
  transition: background-color 0.3s ease;
}
.submit-button:hover {
  background-color: #5cb85c;
  box-shadow: 2px  2px black;

}
</style>