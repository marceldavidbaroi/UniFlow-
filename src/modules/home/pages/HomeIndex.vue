<template>
  <q-page padding class="q-pa-md q-px-xl">
    <!-- banner section -->
    <section
      class="q-pa-md text-h1 row items-center"
      style="height: 90vh; font-family: 'Londrina Shadow', cursive"
    >
      <div class="row">
        <div class="col-12 brand">
          <span class="text-dark">Code.</span><span>&nbsp;With Joy</span>
        </div>
        <div class="col-12 brand">
          <span class="text-dark">Share.</span><span>&nbsp;Anytime</span>
        </div>
        <div class="col-12 brand">
          <span class="text-dark">Collaborate.</span><span>&nbsp;With Friends</span>
        </div>
        <div class="col-12 brand">
          <span class="text-dark">A Lab Experience</span><span>&nbsp;Won't Bore You</span>
        </div>
        <div class="col-12 brand">
          <span class="text-dark">Like Never Before!</span><span>&nbsp;With Fun & Joy!!!</span>
        </div>
      </div>
    </section>

    <!-- description section  -->
    <section
      class="row justify-center items-center q-pa-md text-dark text-body1 description-layout"
      style="height: 100vh"
    >
      <div class="q-ma-xl description-bg">
        <div>
          <div
            class="text-h2 text-bold text-center q-pb-md"
            style="font-family: 'Londrina Shadow', cursive"
          >
            Welcome to <span class="" style="font-family: 'Londrina Solid', cursive">UNIFLOW</span>
          </div>
          A real-time collaborative learning hub designed for university students and educators.
          Built with Quasar and Firebase, our platform revolutionizes lab-based coding classes by
          making them interactive, engaging, and efficient.
        </div>
        <div class="key-features q-mt-lg text-h4">Key Features:</div>
        <div style="font-family: 'Londrina Solid', cursive" class="q-ml-lg q-pa-md">
          <div style="">
            <i class="fa fa-check-circle"></i> Role-Based Authentication – Secure access for
            students, teachers, and admins.
          </div>
          <div>
            <i class="fa fa-check-circle"></i> Seamless Class Management – Easily create or join
            class sessions using unique IDs.
          </div>
          <div>
            <i class="fa fa-check-circle"></i> Smart Task Assignment – Upload, submit, and evaluate
            assignments effortlessly.
          </div>
          <div>
            <i class="fa fa-check-circle"></i> Live Code Collaboration – Work together in real-time
            with a shared online code editor.
          </div>
          <div>
            <i class="fa fa-check-circle"></i> Instant Chat & Feedback – Communicate and collaborate
            seamlessly.
          </div>
          <div>
            <i class="fa fa-check-circle"></i> Leaderboard & Performance Tracking – Stay motivated
            with rankings and task scores.
          </div>
          <div>
            <i class="fa fa-check-circle"></i> Admin Control Panel – Manage users, sessions, and
            activities efficiently.
          </div>
        </div>
        <div>
          Whether you’re a student looking to enhance your coding skills, a teacher simplifying lab
          management, or an admin ensuring smooth operations,
          <span style="font-family: 'Londrina Solid', cursives">UNIFLOW</span>
          provides the perfect environment for hands-on learning. Join now and elevate your lab
          experience with real-time collaboration!
        </div>
      </div>
    </section>

    <!-- user count -->
    <section class="q-pa-md text-dark text-body1">
      <div class="text-h1 text-center" style="font-family: 'Londrina Solid', cursive">11</div>
    </section>
    <section>Futer plans</section>
  </q-page>
</template>

<script setup></script>

<style lang="scss" scoped>
.brand {
  font-family: 'Londrina Shadow', cursive;
  color: #d7d8d3;
  transition:
    color 0.3s ease-in-out,
    transform 0.3s ease-in-out;
}

.brand:hover {
  color: #308c8c;
  transform: scale(1.05); /* Increases size on hover */
}

.description-bg {
  background: rgba(255, 255, 255, 0.164);
  backdrop-filter: blur(10px);
  border-radius: 10px;
  padding: 20px;
  box-shadow: 0 4px 10px rgba(0, 0, 0, 0.1);
}

.key-features {
  font-family: 'Londrina Solid', cursive;
  transition: text-shadow 0.3s ease-in-out;
}

.key-features:hover {
  font-family: 'Londrina Shadow', cursive;
}

.description-layout {
  background-color: #d7d8d3;
  background-image: url('/public/images/home-description-banner.png');
  background-size: cover;
  width: 100%; /* Adjust as needed */
  height: fit-content; /* Adjust as needed */
  background-position: center;
  background-repeat: no-repeat;
  // border-top: 3px dashed #272727;
}
</style>
