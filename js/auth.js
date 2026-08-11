// Sign Up Function with Error Handling & Alerts
async function signUpUser(email, password, username, firstName, lastName, phone) {
  // Show Loading
  const submitBtn = document.querySelector('.signup-btn');
  if(submitBtn) {
    submitBtn.innerText = 'Creating Account...';
    submitBtn.disabled = true;
  }

  try {
    // Check Supabase Initialization
    if (typeof supabaseClient === 'undefined') {
      alert("Database connection error! Please refresh the page.");
      if(submitBtn) { submitBtn.innerText = 'Sign Up'; submitBtn.disabled = false; }
      return;
    }

    // 1. Create Auth User in Supabase
    const { data, error } = await supabaseClient.auth.signUp({
      email: email,
      password: password
    });

    if (error) {
      alert("Signup Failed: " + error.message);
      if(submitBtn) { submitBtn.innerText = 'Sign Up'; submitBtn.disabled = false; }
      return;
    }

    if (data.user) {
      // 2. Create Profile Entry in Database Table
      const { error: profileError } = await supabaseClient
        .from('profiles')
        .insert([
          {
            id: data.user.id,
            username: username,
            first_name: firstName,
            last_name: lastName,
            phone: phone,
            balance: 0.00
          }
        ]);

      if (profileError) {
        console.error("Profile Error:", profileError);
        alert("Account created, but profile setup failed: " + profileError.message);
      } else {
        alert("Account Created Successfully! Redirecting to login...");
        window.location.href = "index.html";
      }
    }
  } catch (err) {
    alert("Unexpected Error: " + err.message);
    if(submitBtn) { submitBtn.innerText = 'Sign Up'; submitBtn.disabled = false; }
  }
}

// Log In Logic
async function loginUser(email, password) {
  try {
    const { data, error } = await supabaseClient.auth.signInWithPassword({
      email: email,
      password: password
    });

    if (error) {
      alert("Login failed: " + error.message);
    } else {
      alert("Logged in successfully!");
      window.location.href = "index.html";
    }
  } catch(err) {
    alert("Error: " + err.message);
  }
}
