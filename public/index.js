const paymentBtn = document.getElementById("payment-button");

paymentBtn.addEventListener("click", async () => {
    try {
      const response = await fetch("/checkout", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(),
      });
  
      if (response.ok) {
        const session = await response.json();
        console.log(session)
        window.location = session;
      }
       
    } catch (error) {
      console.error(error);
    }
  });