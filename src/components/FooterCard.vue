<template>
  <div class="q-py-xl footer-layout">
    <div class="q-mx-xl q-pa-lg footer-card">
      <div class="row text-center footer-row-1">
        <div class="col-12 col-sm-4 col-md-2 q-mb-md q-mb-sm-0">
          <div class="text-h4 text-bold brand-shadow">Contact us</div>
          <div>+88 XXXX-XXXXXXX</div>
        </div>
        <div class="col-12 col-sm-4 col-md-2 q-mb-md q-mb-sm-0">
          <div class="text-h4 text-bold brand-shadow">Telephone</div>
          <div>+88 XXXX-XXXXXXX</div>
        </div>
        <div class="col-12 col-sm-4 col-md-3 q-mb-md q-mb-sm-0">
          <div class="text-h4 text-bold brand-shadow">Social Media</div>
          <div class="row q-gutter-md justify-center">
            <q-btn
              v-for="(link, index) in socialLinks"
              :key="index"
              round
              flat
              size="sm"
              padding="xs"
              color="dark"
              :icon="link.icon"
              :href="link.url"
              target="_blank"
              class="social-button"
            />
          </div>
        </div>
        <div
          class="col-12 col-md brand-shadow text-dark text-h3 text-dark text-bold q-mt-md q-mt-md-0 footer-logo-col"
          align="right"
          @click="router.push('/home')"
        >
          UNIFLOW
        </div>
      </div>
      <div class="row q-py-lg"></div>
      <!-- tagline -->
      <div class="row brand-shadow text-h1 justify-center cursor-none q-py-xl footer-tagline-row">
        <div class="col-12 col-md-auto">
          <span class="brand">Smart&nbsp;</span>
          <span class="brand">Coding<span class="text-primary">,&nbsp;</span></span>
          <span class="brand"> Smarter&nbsp;</span>
          <span class="brand">Learning&nbsp;</span>
        </div>
        <div class="col-12 col-md-auto">
          <span class="brand">Elevate&nbsp;</span> <span class="brand">Your&nbsp;</span>
          <span class="brand">Lab&nbsp;</span> <span class="brand">Experience</span>
          <span class="text-primary">!</span>
        </div>
      </div>
      <div class="row q-py-lg"></div>
      <div class="row justify-center text-center footer-row-2">
        <div class="col-12 col-sm-4 q-mb-md q-mb-sm-0">
          <div>
            <div class="text-h4 text-bold brand-shadow">Made by</div>
          </div>
          Marcel David
        </div>
        <div class="col-12 col-sm-4 q-mb-md q-mb-sm-0">
          <div class="text-h4 text-bold brand-shadow">Copy right</div>
          <div>All rights reserved2025</div>
        </div>
        <div class="col-12 col-sm-4">
          <div class="text-h4 text-bold brand-shadow">location</div>
          <div class="">
            house, <br />
            road, <br />city <br />country
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { useRouter } from 'vue-router'

const router = useRouter()

const socialLinks = [
  { icon: 'fa-brands fa-facebook-f', url: 'https://facebook.com', color: 'primary' },
  { icon: 'fa-brands fa-instagram', url: 'https://instagram.com', color: 'pink' },
  { icon: 'fa-brands fa-whatsapp', url: 'https://wa.me/your-number', color: 'green' },
  { icon: 'fa-brands fa-telegram', url: 'https://t.me/your-telegram', color: 'blue' },
  { icon: 'fa-brands fa-youtube', url: 'https://youtube.com', color: 'red' },
  { icon: 'fa-brands fa-github', url: 'https://github.com', color: 'black' },
  { icon: 'fa-brands fa-gitlab', url: 'https://gitlab.com', color: 'orange' },
]
</script>

<style lang="scss" scoped>
.footer-card {
  background: rgba(255, 255, 255, 0.164);
  backdrop-filter: blur(10px);
  border-radius: 10px;
  padding: 20px;
  box-shadow: 0 4px 10px rgba(0, 0, 0, 0.1);
}

.footer-layout {
  background-color: #d7d8d3;
  background-image: url('/public//images/auth-bg-blue-light.png');
  background-size: cover;
  width: 100%;
  height: fit-content;
  background-position: center;
  background-repeat: no-repeat;
}

.brand-shadow {
  font-family: 'Londrina Shadow', cursive;
}
.brand {
  color: #272727;
  display: inline-block;
  transition:
    color 0.3s ease-in-out,
    transform 0.3s ease-in-out;
}
.brand:hover {
  color: #134f7b;
  transform: scale(1.1);
}

// Responsive styles
.footer-row-1 > div,
.footer-row-2 > div {
  margin-bottom: 1.5rem;
}

@media (min-width: 600px) {
  .footer-row-1 > div,
  .footer-row-2 > div {
    margin-bottom: 0;
  }
}

.footer-tagline-row > div {
  margin-bottom: 1rem;
}

@media (max-width: 900px) {
  .footer-card {
    padding: 10px;
  }
  .footer-tagline-row {
    font-size: 2rem !important;
    flex-direction: column;
    align-items: center;
  }
}

@media (max-width: 600px) {
  .footer-card {
    padding: 4px;
  }
  .footer-row-1,
  .footer-row-2 {
    flex-direction: column !important;
    text-align: center;
  }
  .footer-logo-col {
    justify-content: center;
    align-items: center;
    text-align: center;
    margin-top: 1rem;
  }
  .footer-tagline-row {
    font-size: 1.2rem !important;
    flex-direction: column;
    align-items: center;
  }
}
</style>
