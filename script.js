const SERVER_URL = "https://share-server-va1d.onrender.com";

let device = 0;
let tunnel = "";
let password = "";

async function login(dev) {
  tunnel = document.getElementById("tunnel_name").value.trim();
  password = document.getElementById("password").value.trim();
  if (!tunnel || !password) return alert("املأ جميع الحقول");
  device = dev;

  const res = await fetch(`${SERVER_URL}/connect`, {  // هنا غيرت /login → /connect
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ tunnel, password, device })
  });
  const data = await res.json();
  if (data.success) {   // هنا استخدم success بدل status
    document.getElementById("login").style.display = "none";
    document.getElementById("chat").style.display = "block";
    updateChat();
  } else {
    alert(data.message);
  }
}

async function sendMessage() {
  const msg = document.getElementById("message_input").value.trim();
  if (!msg) return;
  document.getElementById("message_input").value = "";
  await fetch(`${SERVER_URL}/send`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ tunnel, device, message: msg }) // هنا استخدم message بدل msg
  });
  updateChat();
}

async function updateChat() {
  const res = await fetch(`${SERVER_URL}/messages?tunnel=${tunnel}`);
  const data = await res.json();
  const container = document.getElementById("messages");
  container.innerHTML = "";
  for (const m of data.messages) {
    const div = document.createElement("div");
    div.className = "message";
    div.innerHTML = `<b>جهاز ${m.device}:</b> ${m.text} <button class='copy-btn' onclick='copyText(this)'>نسخ</button>`;
    container.appendChild(div);
  }
}

function copyText(btn) {
  const text = btn.parentElement.innerText.replace("نسخ", "").trim();
  navigator.clipboard.writeText(text);
  btn.innerText = "تم النسخ!";
  setTimeout(() => btn.innerText = "نسخ", 1000);
}