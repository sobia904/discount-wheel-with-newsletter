(function () {
    // Configuration
    const DISCOUNTS = [
      { label: "10% Off", code: "SAVE10", color: "#ff9999" },
      { label: "20% Off", code: "SAVE20", color: "#99ff99" },
      { label: "Free Shipping", code: "FREESHIP", color: "#9999ff" },
      { label: "5% Off", code: "SAVE5", color: "#ffff99" },
      { label: "15% Off", code: "SAVE15", color: "#ffcc99" },
      { label: "25% Off", code: "SAVE25", color: "#cc99ff" },
    ];
    const WHEEL_SIZE = 200; // Wheel diameter in pixels
  
    // Create or update popup
    function createOrUpdatePopup(discount = null) {
      let popup = document.getElementById("discount-wheel-popup");
      if (!popup) {
        popup = document.createElement("div");
        popup.id = "discount-wheel-popup";
        popup.style.cssText = `
          position: fixed; bottom: 20px; left: 20px; background: #fff;
          border: 1px solid #ddd; padding: 15px; box-shadow: 0 2px 10px rgba(0,0,0,0.1);
          z-index: 1000; max-width: 350px; font-family: Arial, sans-serif; border-radius: 5px;
          text-align: center;
        `;
        document.body.appendChild(popup);
      }
  
      popup.innerHTML = `
        <h3 style="margin: 0 0 10px; font-size: 18px; color: #333;">
          ${discount ? "Congratulations!" : "Spin to Win!"}
        </h3>
        <canvas id="wheel-canvas" width="${WHEEL_SIZE}" height="${WHEEL_SIZE}" style="margin: 0 auto 10px;"></canvas>
        ${
          discount
            ? `<p style="margin: 5px 0; font-size: 16px;"><strong>You Won:</strong> ${discount.label}</p>
               <p style="margin: 5px 0; font-size: 14px;"><strong>Code:</strong> ${discount.code}</p>`
            : `<p style="margin: 5px 0; font-size: 14px;">Enter your email to spin:</p>
               <input type="email" id="newsletter-email" style="width: 100%; padding: 6px; margin: 5px 0; border: 1px solid #ccc; border-radius: 3px;" placeholder="your@email.com">
               <button id="spin-btn" style="background: #007bff; color: #fff; border: none; padding: 8px 15px; cursor: pointer; border-radius: 3px; margin-top: 5px;">Spin</button>`
        }
        <button style="background: #ff4444; color: #fff; border: none; padding: 6px 12px; cursor: pointer; border-radius: 3px; margin-top: 10px;"
          onclick="this.parentElement.style.display='none'">Close</button>
      `;
  
      drawWheel(discount);
  
      if (!discount) {
        document.getElementById("spin-btn").addEventListener("click", () => {
          const email = document.getElementById("newsletter-email").value;
          if (email && email.includes("@")) {
            const wonDiscount = spinWheel();
            spinAnimation(wonDiscount);
            console.log(`Subscribed: ${email}, Won: ${wonDiscount.label}`);
          } else {
            alert("Please enter a valid email!");
          }
        });
      }
    }
  
    // Draw the wheel on canvas
    function drawWheel(selectedDiscount = null) {
      const canvas = document.getElementById("wheel-canvas");
      const ctx = canvas.getContext("2d");
      const arcSize = (2 * Math.PI) / DISCOUNTS.length;
      ctx.clearRect(0, 0, WHEEL_SIZE, WHEEL_SIZE);
  
      DISCOUNTS.forEach((discount, i) => {
        const angle = i * arcSize;
        ctx.beginPath();
        ctx.fillStyle = discount.color;
        ctx.moveTo(WHEEL_SIZE / 2, WHEEL_SIZE / 2);
        ctx.arc(WHEEL_SIZE / 2, WHEEL_SIZE / 2, WHEEL_SIZE / 2, angle, angle + arcSize);
        ctx.lineTo(WHEEL_SIZE / 2, WHEEL_SIZE / 2);
        ctx.fill();
  
        ctx.save();
        ctx.translate(WHEEL_SIZE / 2, WHEEL_SIZE / 2);
        ctx.rotate(angle + arcSize / 2);
        ctx.fillStyle = "#000";
        ctx.font = "12px Arial";
        ctx.textAlign = "right";
        ctx.fillText(discount.label, WHEEL_SIZE / 2 - 10, 0);
        ctx.restore();
      });
  
      ctx.beginPath();
      ctx.fillStyle = "#000";
      ctx.moveTo(WHEEL_SIZE / 2 - 10, 0);
      ctx.lineTo(WHEEL_SIZE / 2 + 10, 0);
      ctx.lineTo(WHEEL_SIZE / 2, 20);
      ctx.fill();
    }
  
    // Spin animation and result
    function spinAnimation(wonDiscount) {
      const canvas = document.getElementById("wheel-canvas");
      let rotation = 0;
      const spinTime = 2000; // 2 seconds
      const spinAngle = Math.floor(Math.random() * 360) + 720; // 2 full spins + random stop
      const steps = 60; // Animation frames
      let step = 0;
  
      const animate = setInterval(() => {
        step++;
        rotation = (spinAngle * step) / steps;
        canvas.style.transform = `rotate(${rotation}deg)`;
        if (step >= steps) {
          clearInterval(animate);
          const finalAngle = rotation % 360;
          const index = Math.floor(((360 - finalAngle) % 360) / (360 / DISCOUNTS.length));
          createOrUpdatePopup(wonDiscount || DISCOUNTS[index]);
        }
      }, spinTime / steps);
    }
  
    // Randomly select a discount
    function spinWheel() {
      const rand = Math.random();
      let cumulative = 0;
      for (const discount of DISCOUNTS) {
        cumulative += 1 / DISCOUNTS.length; // Equal chance for simplicity
        if (rand <= cumulative) return discount;
      }
      return DISCOUNTS[0];
    }
  
    // Initialize popup
    function initPopup() {
      createOrUpdatePopup();
    }
  
    if (document.readyState === "complete") {
      initPopup();
    } else {
      window.addEventListener("load", initPopup);
    }
  })();