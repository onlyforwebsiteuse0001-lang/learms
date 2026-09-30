const sidebar = document.querySelector('#sidebar');
const menuButton = document.querySelector('#menuButton');
const studyButton = document.querySelector('#studyButton');
const toast = document.querySelector('#toast');

menuButton.addEventListener('click', () => sidebar.classList.toggle('open'));

document.querySelectorAll('.nav-item').forEach((item) => {
  item.addEventListener('click', () => {
    document.querySelectorAll('.nav-item').forEach((link) => link.classList.remove('active'));
    item.classList.add('active');
    sidebar.classList.remove('open');
  });
});

studyButton.addEventListener('click', () => {
  toast.classList.add('show');
  setTimeout(() => toast.classList.remove('show'), 2800);
});

document.querySelector('.add-task').addEventListener('click', () => {
  toast.textContent = 'Demo mode: task creator will be added next!';
  toast.classList.add('show');
  setTimeout(() => {
    toast.classList.remove('show');
    setTimeout(() => { toast.textContent = "Focus session started — you've got this! 🚀"; }, 300);
  }, 2800);
});
