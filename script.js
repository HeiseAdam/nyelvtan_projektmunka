document.addEventListener("DOMContentLoaded", () => {
    const coords = { x: 0, y: 0 };
    const circles = [];
    // Enhanced blue color palette with brighter center
    const colors = ['#7df9ff', '#4fc3f7', '#00a8ff', '#0055ff'];
    const particleCount = 30; // Increased for smoother trail
    
    // Create particles with initial properties
    for (let i = 0; i < particleCount; i++) {
        const circle = document.createElement("div");
        circle.className = "circle";
        document.body.appendChild(circle);
        
        // Initialize physics properties
        circle.x = 0;
        circle.y = 0;
        circle.prevX = 0;
        circle.prevY = 0;
        circle.speed = 0;
        circle.size = 12 + Math.random() * 8;
        circle.friction = 0.88 + Math.random() * 0.04;
        circles.push(circle);
    }

    // Smooth mouse tracking with momentum
    let mouseX = 0, mouseY = 0;
    window.addEventListener("mousemove", (e) => {
        mouseX = e.clientX + window.scrollX;
        mouseY = e.clientY + window.scrollY;
    });

    // Handle scrolling smoothly
    let lastScrollY = window.scrollY;
    window.addEventListener("scroll", () => {
        const scrollDiff = window.scrollY - lastScrollY;
        coords.y += scrollDiff;
        lastScrollY = window.scrollY;
    });

    function animate() {
        // Smooth follow for the leader position
        coords.x += (mouseX - coords.x) * 0.2;
        coords.y += (mouseY - coords.y) * 0.2;
        
        let x = coords.x;
        let y = coords.y;
        
        circles.forEach((circle, index) => {
            // Calculate progress through trail (0 to 1)
            const progress = index / circles.length;
            
            // Calculate movement speed for dynamic effects
            const dx = x - circle.prevX;
            const dy = y - circle.prevY;
            circle.speed = Math.sqrt(dx * dx + dy * dy) * 0.15;
            
            // Store previous position
            circle.prevX = x;
            circle.prevY = y;
            
            // Dynamic properties based on position in trail
            const scale = 0.3 + (1 - progress) * 0.7; // More dramatic scaling
            const sizeVariation = Math.sin(Date.now() * 0.01 + index) * 2;
            const colorIndex = Math.min(Math.floor(progress * colors.length * 1.3), colors.length - 1);
            const opacity = 0.9 - progress * 0.85;
            
            // Organic movement with slight wave pattern
            const waveOffset = Math.sin(Date.now() * 0.005 + index * 0.3) * 10 * progress;
            
            // Apply transformations
            circle.style.cssText = `
                transform: 
                    translate(${x - circle.size/2 + waveOffset}px, ${y - circle.size/2}px) 
                    scale(${scale});
                width: ${circle.size}px;
                height: ${circle.size}px;
                background: ${colors[colorIndex]};
                opacity: ${opacity};
                filter: 
                    blur(${progress * 6}px) 
                    brightness(${1.1 + (1 - progress) * 0.5});
                transition: all ${0.05 + progress * 0.15}s ease-out;
            `;
            
            // Calculate next position with smooth following and physics
            const followSpeed = 0.15 + progress * 0.1;
            x += (circle.x - x) * followSpeed * circle.friction;
            y += (circle.y - y) * followSpeed * circle.friction;
            
            // Store current positions
            circle.x = x;
            circle.y = y;
        });
        
        requestAnimationFrame(animate);
    }
    
    animate();
});