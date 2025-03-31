<template>
  <div class="q-py-xl footer-layout">
    <div class="q-mx-xl q-pa-lg footer-card" style="border-radius: 8px">
      <div class="row text-center">
        <div class="col-2">
          <div class="text-h4 text-bold brand-shadow">Contact us</div>
          <div>+88 XXXX-XXXXXXX</div>
        </div>
        <div class="col-2">
          <div class="text-h4 text-bold brand-shadow">Telephone</div>
          <div>+88 XXXX-XXXXXXX</div>
        </div>
        <div class="col-3">
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
        <div class="col brand-shadow text-dark text-h3 text-dark text-bold" align="right">
          UNIFLOW
        </div>
      </div>
      <div class="row q-py-lg"></div>
      <!-- tagline -->
      <div class="row brand-shadow text-h1 justify-center cursor-none q-py-xl">
        <div>
          <span class="brand">Smart&nbsp;</span>
          <span class="brand">Coding<span class="text-primary">,&nbsp;</span></span>
          <span class="brand"> Smarter&nbsp;</span>
          <span class="brand">Learning&nbsp;</span>
        </div>
        <div>
          <span class="brand">Elevate&nbsp;</span> <span class="brand">Your&nbsp;</span>
          <span class="brand">Lab&nbsp;</span> <span class="brand">Experience</span
          ><span class="text-primary">!</span>
        </div>
      </div>

      <div class="row q-py-lg"></div>

      <div class="row justify-center text-center">
        <div class="col">
          <div>
            <div class="text-h4 text-bold brand-shadow">Made by</div>
          </div>
          Marcel David
        </div>
        <div class="col">
          <div class="text-h4 text-bold brand-shadow">Copy right</div>

          <div>All rights reserved2025</div>
        </div>
        <div class="col">
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
  color: #e97b2f;
  transform: scale(1.1);
}
</style>
