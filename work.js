
document.addEventListener("DOMContentLoaded", () => {
  const authScreen = document.getElementById("authScreen");
  const authForm = document.getElementById("authForm");
  const authTitle = document.getElementById("authTitle");
  const authName = document.getElementById("authName");
  const authEmail = document.getElementById("authEmail");
  const authPassword = document.getElementById("authPassword");
  const nameField = document.getElementById("nameField");
  const authSwitch = document.getElementById("authSwitch");
  const authSwitchText = document.getElementById("authSwitchText");
  const authSubmit = document.getElementById("authSubmit");
  const loggedUser = document.getElementById("loggedUser");
  const logoutBtn = document.getElementById("logoutBtn");

  let isSignup = false;

  const USERS_KEY = "vw_demo_users";
  const SESSION_KEY = "vw_demo_session";

  function getUsers() {
    return JSON.parse(localStorage.getItem(USERS_KEY) || "[]");
  }

  function showWebsite(user) {
    authScreen.hidden = true;
    loggedUser.textContent = "Welcome, " + user.name;
    logoutBtn.hidden = false;
  }

  function showLogin() {
    authScreen.hidden = false;
    loggedUser.textContent = "";
    logoutBtn.hidden = true;
  }

  // Check existing demo session
  const session = JSON.parse(
    localStorage.getItem(SESSION_KEY) || "null"
  );

  if (session && session.name && session.email) {
    showWebsite(session);
  } else {
    showLogin();
  }

  // Switch between Login and Signup
  authSwitch.addEventListener("click", () => {
    isSignup = !isSignup;

    nameField.hidden = !isSignup;
    authName.required = isSignup;

    authTitle.textContent = isSignup
      ? "Create your account"
      : "Login to your account";

    authSubmit.textContent = isSignup
      ? "Create Account →"
      : "Login →";

    authSwitchText.textContent = isSignup
      ? "Already have an account?"
      : "Don't have an account?";

    authSwitch.textContent = isSignup
      ? "Login"
      : "Sign Up";

    authForm.reset();
  });

  // Login and Signup
  authForm.addEventListener("submit", (event) => {
    event.preventDefault();

    const email = authEmail.value.trim().toLowerCase();
    const password = authPassword.value;
    const name = authName.value.trim();

    if (!email || password.length < 6) {
      alert("Please enter a valid email and password of at least 6 characters.");
      return;
    }

    let users = getUsers();
    let user;

    if (isSignup) {
      if (!name) {
        alert("Please enter your full name.");
        return;
      }

      const existingUser = users.find(
        item => item.email === email
      );

      if (existingUser) {
        alert("This email is already registered. Please login.");
        return;
      }

      // Only name and email are stored.
      // Password is never saved.
      user = {
        name: name,
        email: email,
        joinedAt: new Date().toISOString()
      };

      users.push(user);

      localStorage.setItem(
        USERS_KEY,
        JSON.stringify(users)
      );

    } else {
      user = users.find(
        item => item.email === email
      );

      if (!user) {
        alert("Account not found. Please Sign Up first.");
        return;
      }

      // Demo only: password is not verified.
    }

    // Save current demo session
    localStorage.setItem(
      SESSION_KEY,
      JSON.stringify(user)
    );

    authPassword.value = "";

    showWebsite(user);

    alert("Welcome to Volkswagen Auto Hub, " + user.name + "!");
  });

  // Logout
  logoutBtn.addEventListener("click", () => {
    localStorage.removeItem(SESSION_KEY);

    authForm.reset();
    isSignup = false;

    nameField.hidden = true;
    authName.required = false;

    authTitle.textContent = "Login to your account";
    authSubmit.textContent = "Login →";
    authSwitchText.textContent = "Don't have an account?";
    authSwitch.textContent = "Sign Up";

    showLogin();

    alert("You have logged out successfully.");
  });
});
