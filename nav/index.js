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
                display: flex; /* 使用 flex 布局使得按钮右对齐 */
                align-items: center; /* 垂直居中对齐 */
                padding: 0;
                margin: 0;
            }
            ul {
                list-style-type: none;
                margin: 0;
                padding: 0;
                display: flex; /* 使用 flex 布局使得按钮右对齐 */
                align-items: center; /* 垂直居中对齐 */
            }
            li {
                margin: 0 10px; /* 添加间距 */
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
                margin-left: auto; /* 自动靠右 */
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
                <img src="..\\img\\院徽.png" alt="Logo 3" class="logo">
            </li>
            <li>
                <a href="#" id="toIndex">首页</a>
            </li>
            <li>
                <a href="#" id="toShowAll">总览图</a>
            </li>
            <li><a href="#show" id="toPostion">3D姿态</a></li>
            <li><a href="#about" id="toOutput">颗粒数据导出</a></li>
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

      this.shadowRoot
        .getElementById("toIndex")
        .addEventListener("click", () => {
          ipcRenderer.send("gotoPageIndex");
        });
      this.shadowRoot
        .getElementById("toShowAll")
        .addEventListener("click", () => {
          ipcRenderer.send("gotoPageShowAll");
        });
      this.shadowRoot
        .getElementById("toPostion")
        .addEventListener("click", () => {
          ipcRenderer.send("gotoPagePosition");
        });
      this.shadowRoot
        .getElementById("toOutput")
        .addEventListener("click", () => {
          ipcRenderer.send("gotoPageOutput");
        });

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
