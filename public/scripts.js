let sidenav = document.querySelector(".sidenav");
M.Sidenav.init(sidenav, {});

let tooltip = document.querySelectorAll(".tooltipped");
M.Tooltip.init(tooltip, {});

document.getElementById("date").textContent = new Date().getFullYear();

let modal = document.querySelectorAll(".modal");
M.Modal.init(modal, {});
