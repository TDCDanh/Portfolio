import * as webllm from "https://esm.run/@mlc-ai/web-llm";

let activeIndex = 0;
let isCrossfading = false;
let isMenuOpen = false;
let engine = null;
let isGenerating = false;

const darkThemeColor = "#182C41";
// Mô hình nhỏ, phù hợp để chạy trực tiếp trong trình duyệt qua WebGPU.
const MODEL_ID = "Qwen2.5-0.5B-Instruct-q4f16_1-MLC";
const messages = [
  {
    role: "system",
    content:
      "Bạn là ioblanoisuled chat, một trợ lý thân thiện. Luôn trả lời bằng tiếng Việt trừ khi người dùng yêu cầu ngôn ngữ khác. Trả lời rõ ràng, ngắn gọn và trung thực.",
  },
];

const getElement = (id) => document.getElementById(id);

function setStatus(message) {
  const status = getElement("ai-status");
  if (status) status.textContent = message;
}

function scrollChatToBottom() {
  const log = getElement("chat-log");
  if (log) log.scrollTop = log.scrollHeight;
}

function appendMessage(role, content, pending = false) {
  const log = getElement("chat-log");
  const article = document.createElement("article");
  article.className = `chat-message chat-message--${role}${pending ? " chat-message--pending" : ""}`;

  const label = document.createElement("span");
  label.className = "chat-role";
  label.textContent = role === "user" ? "BẠN" : "AI";

  const text = document.createElement("p");
  text.textContent = content;
  article.append(label, text);
  log.appendChild(article);
  scrollChatToBottom();
  return { article, text };
}

async function createEngine() {
  if (engine) return engine;
  if (!navigator.gpu) {
    throw new Error("Trình duyệt này chưa hỗ trợ WebGPU. Hãy dùng Chrome hoặc Edge bản mới trên máy tính.");
  }

  setStatus("Đang tải AI cục bộ lần đầu. Việc này có thể mất vài phút tùy mạng...");
  engine = await webllm.CreateMLCEngine(MODEL_ID, {
    initProgressCallback: (progress) => {
      const percent = Number.isFinite(progress.progress)
        ? ` ${Math.round(progress.progress * 100)}%`
        : "";
      setStatus(`Đang chuẩn bị AI cục bộ:${percent} ${progress.text || ""}`.trim());
    },
  });
  setStatus("AI cục bộ đã sẵn sàng. Nội dung chat không được gửi tới API.");
  return engine;
}

async function submitQuestion(event) {
  event.preventDefault();
  const input = getElement("hero-input");
  const sendButton = getElement("send-button");
  const question = input.value.trim();
  if (!question || isGenerating) return;

  isGenerating = true;
  input.value = "";
  input.style.height = "auto";
  input.disabled = true;
  sendButton.disabled = true;
  sendButton.classList.add("opacity-60", "cursor-wait");
  appendMessage("user", question);
  const assistantMessage = appendMessage("assistant", "Đang suy nghĩ", true);
  messages.push({ role: "user", content: question });

  try {
    const localEngine = await createEngine();
    assistantMessage.article.classList.remove("chat-message--pending");
    let answer = "";
    const completion = await localEngine.chat.completions.create({
      messages,
      temperature: 0.7,
      max_tokens: 512,
      stream: true,
    });

    for await (const chunk of completion) {
      const token = chunk.choices[0]?.delta?.content || "";
      answer += token;
      assistantMessage.text.textContent = answer;
      scrollChatToBottom();
    }
    const finalAnswer = answer.trim() || "Mình chưa tạo được câu trả lời. Bạn hãy thử hỏi lại nhé.";
    assistantMessage.text.textContent = finalAnswer;
    messages.push({ role: "assistant", content: finalAnswer });
    setStatus("AI cục bộ sẵn sàng.");
  } catch (error) {
    assistantMessage.article.classList.remove("chat-message--pending");
    assistantMessage.text.textContent = `Không thể khởi động AI: ${error.message}`;
    messages.pop();
    setStatus("Chưa thể khởi động AI cục bộ.");
  } finally {
    isGenerating = false;
    input.disabled = false;
    sendButton.disabled = false;
    sendButton.classList.remove("opacity-60", "cursor-wait");
    input.focus();
  }
}

function handleVideoSelection(nextIndex) {
  if (isCrossfading || nextIndex === activeIndex) return;
  isCrossfading = true;
  const activeVideo = getElement(`video-${activeIndex}`);
  const targetVideo = getElement(`video-${nextIndex}`);
  const activeBtn = getElement(`switch-btn-${activeIndex}`);
  const targetBtn = getElement(`switch-btn-${nextIndex}`);
  activeVideo.classList.replace("opacity-100", "opacity-0");
  targetVideo.classList.replace("opacity-0", "opacity-100");
  activeBtn.classList.replace("font-semibold", "font-normal");
  activeBtn.classList.replace("opacity-100", "opacity-50");
  activeBtn.classList.add("hover:opacity-80");
  const activeLine = activeBtn.querySelector(".btn-active-line");
  activeLine.classList.replace("bg-current", "bg-transparent");
  activeLine.classList.replace("opacity-100", "opacity-0");
  targetBtn.classList.replace("font-normal", "font-semibold");
  targetBtn.classList.replace("opacity-50", "opacity-100");
  targetBtn.classList.remove("hover:opacity-80");
  const targetLine = targetBtn.querySelector(".btn-active-line");
  targetLine.classList.replace("bg-transparent", "bg-current");
  targetLine.classList.replace("opacity-0", "opacity-100");
  applyAlternativeDarkColor(nextIndex === 2);
  activeIndex = nextIndex;
  setTimeout(() => { isCrossfading = false; }, 1000);
}

function showNextScene() {
  handleVideoSelection((activeIndex + 1) % 4);
}

function applyAlternativeDarkColor(apply) {
  ["hero-heading", "hero-subtext", "hero-input-container", "hero-input", "switcher"].forEach((id) => {
    const element = getElement(id);
    if (!element) return;
    if (apply) {
      element.style.color = darkThemeColor;
      if (id === "hero-input") {
        element.classList.add("placeholder:text-[#182C41]/50");
        element.classList.remove("placeholder:text-white/40");
      }
    } else {
      element.style.color = "white";
      if (id === "hero-input") {
        element.classList.remove("placeholder:text-[#182C41]/50");
        element.classList.add("placeholder:text-white/40");
      }
    }
  });
}

function toggleMobileMenu() {
  const menuOverlay = getElement("mobile-menu-overlay");
  const iconMenu = getElement("icon-menu");
  const iconClose = getElement("icon-close");
  const links = document.querySelectorAll(".mobile-link");
  const ctaBtn = getElement("mobile-menu-cta");
  isMenuOpen = !isMenuOpen;
  menuOverlay.classList.toggle("opacity-0", !isMenuOpen);
  menuOverlay.classList.toggle("pointer-events-none", !isMenuOpen);
  menuOverlay.classList.toggle("opacity-100", isMenuOpen);
  menuOverlay.classList.toggle("pointer-events-auto", isMenuOpen);
  iconMenu.classList.toggle("rotate-90", isMenuOpen);
  iconMenu.classList.toggle("rotate-0", !isMenuOpen);
  iconMenu.classList.toggle("scale-75", isMenuOpen);
  iconMenu.classList.toggle("scale-100", !isMenuOpen);
  iconMenu.classList.toggle("opacity-0", isMenuOpen);
  iconMenu.classList.toggle("opacity-100", !isMenuOpen);
  iconClose.classList.toggle("rotate-0", isMenuOpen);
  iconClose.classList.toggle("-rotate-90", !isMenuOpen);
  iconClose.classList.toggle("scale-100", isMenuOpen);
  iconClose.classList.toggle("scale-75", !isMenuOpen);
  iconClose.classList.toggle("opacity-100", isMenuOpen);
  iconClose.classList.toggle("opacity-0", !isMenuOpen);
  links.forEach((link, index) => {
    setTimeout(() => {
      link.classList.toggle("opacity-100", isMenuOpen);
      link.classList.toggle("translate-y-0", isMenuOpen);
      link.classList.toggle("opacity-0", !isMenuOpen);
      link.classList.toggle("translate-y-4", !isMenuOpen);
    }, isMenuOpen ? 100 + index * 50 : 0);
  });
  ctaBtn.classList.toggle("opacity-100", isMenuOpen);
  ctaBtn.classList.toggle("scale-100", isMenuOpen);
  ctaBtn.classList.toggle("opacity-0", !isMenuOpen);
  ctaBtn.classList.toggle("scale-90", !isMenuOpen);
}

let toastTimeout;
function triggerToast(message) {
  const toast = getElement("custom-toast");
  getElement("toast-message").innerText = message;
  toast.classList.remove("opacity-0", "translate-y-12", "pointer-events-none");
  toast.classList.add("opacity-100", "translate-y-0", "pointer-events-auto");
  clearTimeout(toastTimeout);
  toastTimeout = setTimeout(() => {
    toast.classList.remove("opacity-100", "translate-y-0", "pointer-events-auto");
    toast.classList.add("opacity-0", "translate-y-12", "pointer-events-none");
  }, 3500);
}

getElement("hero-input-container").addEventListener("submit", submitQuestion);
getElement("hero-input").addEventListener("input", (event) => {
  event.target.style.height = "auto";
  event.target.style.height = `${Math.min(event.target.scrollHeight, 120)}px`;
});
getElement("hero-input").addEventListener("keydown", (event) => {
  if (event.key === "Enter" && !event.shiftKey) submitQuestion(event);
});

// Gắn trực tiếp sự kiện cho các nút cảnh: hoạt động ổn định cả khi script là ES module.
document.querySelectorAll("[data-video-index]").forEach((button) => {
  button.addEventListener("click", () => {
    handleVideoSelection(Number(button.dataset.videoIndex));
  });
});

getElement("next-scene-button")?.addEventListener("click", showNextScene);

// Các thuộc tính onclick trong HTML cần các hàm này nằm trên window.
Object.assign(window, { handleVideoSelection, showNextScene, toggleMobileMenu, triggerToast });
