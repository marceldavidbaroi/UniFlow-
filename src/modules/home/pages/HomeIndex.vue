<template>
  <q-page padding class="modern-bg q-pa-none">
    <!-- Hero Section -->
    <section class="hero-section flex flex-center column q-pa-xl">
      <div class="hero-title text-center q-mb-sm">
        <span class="gradient-text">UNIFLOW</span>
      </div>
      <div class="hero-subtitle text-center q-mb-lg">
        Modern Interactive Class Management<br />
        <span class="gradient-text-2">Groups • Sessions • Tasks • Notes</span>
      </div>
      <q-btn
        color="secondary"
        size="lg"
        class=""
        label="Get Started"
        @click="router.push('/auth/login')"
      />
    </section>

    <!-- Features Section -->
    <section class="features-section flex flex-center q-py-xl">
      <div class="features-grid">
        <div class="feature-card">
          <q-icon name="group" color="secondary" size="40px" />
          <div class="feature-title">Interactive Classes</div>
          <div class="feature-desc">
            Manage and participate in dynamic, real-time class sessions.
          </div>
        </div>
        <div class="feature-card">
          <q-icon name="groups" color="secondary" size="40px" />
          <div class="feature-title">Group Collaboration</div>
          <div class="feature-desc">Create and join groups for seamless teamwork and learning.</div>
        </div>
        <div class="feature-card">
          <q-icon name="event_note" color="secondary" size="40px" />
          <div class="feature-title">Session Management</div>
          <div class="feature-desc">Organize group-based sessions with ease and flexibility.</div>
        </div>
        <div class="feature-card">
          <q-icon name="edit_note" color="secondary" size="40px" />
          <div class="feature-title">Smart Notes</div>
          <div class="feature-desc">Take, organize, and share notes during sessions.</div>
        </div>
        <div class="feature-card">
          <q-icon name="checklist" color="secondary" size="40px" />
          <div class="feature-title">To-Do & Tasks</div>
          <div class="feature-desc">Track your to-dos and submit tasks efficiently.</div>
        </div>
        <div class="feature-card">
          <q-icon name="assignment_turned_in" color="secondary" size="40px" />
          <div class="feature-title">Easy Submission</div>
          <div class="feature-desc">Create, assign, and submit tasks in a few clicks.</div>
        </div>
      </div>
    </section>
  </q-page>
</template>

<script setup>
import { useRouter } from 'vue-router'

const router = useRouter()
</script>

<style lang="scss" scoped>
.modern-bg {
  min-height: 100vh;
  background: #ffffff;
}

.hero-section {
  min-height: 60vh;
  background: #ffffff;
  border-bottom: 2px solid #e0e0e0;
  position: relative;
  z-index: 2;
  padding-top: 4rem;
  padding-bottom: 4rem;
}

.hero-title {
  font-family: 'Londrina Solid', cursive;
  font-size: 3.5rem;
  font-weight: bold;
  letter-spacing: 2px;
  color: #134f7b;
}

.hero-subtitle {
  font-family: 'Londrina Solid', cursive;
  font-size: 1.5rem;
  color: #333;
  margin-bottom: 1.5rem;
  line-height: 1.4;
}

.gradient-text,
.gradient-text-2 {
  color: #134f7b;
  background: none;
  -webkit-text-fill-color: initial;
}

.hero-btn {
  margin-top: 1.5rem;
  font-size: 1.1rem;
  border-radius: 24px;
  background-color: #134f7b;
  color: #fff;
  padding: 12px 24px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
  transition: all 0.2s ease-in-out;
}

.hero-btn:hover {
  background-color: #0e3d61;
}

.features-section {
  background: #ffffff;
  position: relative;
  padding-top: 3rem;
  padding-bottom: 5rem;
}

.features-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(260px, 1fr));
  gap: 2rem;
  width: 100%;
  max-width: 1100px;
}

.feature-card {
  background: #ffffff;
  border-radius: 16px;
  border: 1px solid #e0e0e0;
  padding: 2rem 1.5rem;
  display: flex;
  flex-direction: column;
  align-items: center;
  transition: all 0.2s ease-in-out;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.05);
  min-height: 240px;
}

.feature-card:hover {
  transform: translateY(-4px);
  box-shadow: 0 6px 16px rgba(0, 0, 0, 0.08);
}

.feature-title {
  font-family: 'Londrina Solid', cursive;
  font-size: 1.25rem;
  color: #134f7b;
  margin-top: 1rem;
  margin-bottom: 0.5rem;
  text-align: center;
}

.feature-desc {
  font-size: 1rem;
  color: #444;
  text-align: center;
  font-family: 'Londrina Solid', cursive;
}

.q-icon {
  color: #134f7b !important;
  background: #ffffff;
  border-radius: 50%;
  box-shadow: 0 2px 6px rgba(0, 0, 0, 0.1);
  padding: 6px;
}
</style>
