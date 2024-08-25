customElements.define(
    "custom-navbar",
    class CustomNavbar extends HTMLElement {
        constructor() {
            super();
            const template = document.createElement("template");
            template.innerHTML = `
            <style>
              .nav-ul {
                  position: fixed;
                  top: 0;
                  left: 0;
                  width: 100%; /* 让它占据整个宽度 */
                  z-index: 1000; /* 设置一个足够高的 z-index */
                  background-color: #213347; /* 背景色 */
                  display: flex; /* 使用 flex 布局 */
                  align-items: center; /* 垂直居中对齐 */
                  justify-content: space-between; /* 左右两边对齐，中间的元素要特别处理 */
                  padding: 0;
                  margin: 0;
              }
              ul {
                  list-style-type: none;
                  margin: 0;
                  padding: 0;
                  width: 100%; /* 让 ul 占据整个宽度 */
                  position: relative; /* 让中间的 li 可以绝对定位 */
                  display: flex; /* 使用 flex 布局 */
                  align-items: center; /* 垂直居中对齐 */
                  justify-content: space-between; /* 左右两边对齐，中间的元素要特别处理 */
              }
              li {
                  margin: 0 10px; /* 添加间距 */
              }
              li.center {
                  position: absolute; /* 绝对定位在中间 */
                  left: 50%;
                  transform: translateX(-50%); /* 使得元素完全居中 */
              }
              li a {
                  color: white;
                  padding: 14px 16px;
                  display: inline-block;
                  text-decoration: none;
              }
              li > a:hover:not(a.active),
              .dropbtn:hover {
                  background-color: #183449;
              }
              .dropdown-content {
                  display: none;
                  position: absolute;
                  background-color: #f9f9f9;
                  min-width: 160px; /* 调整为适合你的内容宽度 */
                  box-shadow: 0 8px 16px 0 rgba(0, 0, 0, .2);
                  z-index: 1001; /* 确保显示在其他元素之上 */
              }
              .dropdown {
                  position: relative;
                  display: inline-block;
              }
              .dropdown:hover .dropdown-content {
                  display: block;
              }
              .dropdown-content a {
                  color: black;
                  display: block;
                  padding: 12px 16px;
                  text-decoration: none;
              }
              .dropdown-content a:hover {
                  background-color: #f1f1f1;
                  color: deepskyblue;
              }
              .window-buttons {
                  display: flex;
                  align-items: center;
              }
              .window-buttons button {
                  background: none;
                  border: none;
                  color: white;
                  font-size: 30px;
                  cursor: pointer;
                  padding: 5px;
              }
              .window-buttons button:hover {
                  background-color: #183449;
              }
              .logo {
                  height: 40px; /* 根据需要调整 */
                  margin-right: 10px;
              }
          </style>
          <ul class="nav-ul">
              <li>
                  <img src="..\\img\\原配色.png" alt="Logo 1" class="logo">
                  <img src="..\\img\\11.png" alt="Logo 2" class="logo">
                  <img src="..\\img\\院徽.png" alt="Logo 2" class="logo">
              </li>
              <li class="center">
                  <span>面向道路多场景健康监测的监测系统</span>
              </li>
              <li class="window-buttons">
                  <button id="minimize-btn">-</button>
                  <button id="close-btn">X</button>
              </li>
          </ul>
          `;
            const shadowRoot = this.attachShadow({ mode: "open" });
            shadowRoot.appendChild(template.content);
        }

        connectedCallback() {
            const { ipcRenderer } = require("electron");

            // 最小化窗口
            this.shadowRoot
                .getElementById("minimize-btn")
                .addEventListener("click", () => {
                    ipcRenderer.send("minimizeWindow");
                });

            // 关闭窗口
            this.shadowRoot
                .getElementById("close-btn")
                .addEventListener("click", () => {
                    ipcRenderer.send("closeWindow");
                });
        }
    }
);
