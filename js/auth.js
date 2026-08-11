// Sign Up Logic
async function signUpUser(email, password, username, firstName, lastName, phone) {
  const { data, error } = await supabaseClient.auth.signUp({
    email: email,
    password: password
  });

  if (error) {
    alert("Error: " + error.message);
    return;
  }

  if (data.user) {
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
      console.error("Profile Creation Error:", profileError);
    } else {
      alert("Registration successful!");
      window.location.href = "index.html";
    }
  }
}

// Log In Logic
async function loginUser(email, password) {
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
}

// Log Out Logic
async function logoutUser() {
  await supabaseClient.auth.signOut();
  window.location.href = "login.html";
}
