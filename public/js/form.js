document.querySelector(".contact-form").addEventListener("submit", async (event) => {
    event.preventDefault();
  
    const formData = {
      firstName: document.getElementById("firstName").value,
      lastName: document.getElementById("lastName").value,
      email: document.getElementById("email").value,
      message: document.getElementById("message").value,
    };
  
    const response = await fetch("/send-email", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(formData),
    });
  
    const result = await response.json();
    if (response.ok) {
      alert(result.success);
    } else {
      alert(result.error);
    }
  });
  