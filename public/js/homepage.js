const counters = document.querySelectorAll(".count");
const speed = 100;

counters.forEach((counter) => {
  const updateCount = () => {
    const target = parseInt(counter.getAttribute("data-target"));
    const count = parseInt(counter.innerText);
    const increment = Math.trunc(target / speed);

    if (count < target) {
      counter.innerText = count + increment;
      setTimeout(updateCount, 15);
    } else {
      counter.innerText = target;
    }
  };
  updateCount();
});




var currentYear= new Date().getFullYear();
document.getElementById("currentYear").innerText = currentYear;
