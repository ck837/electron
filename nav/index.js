customElements.define(
  "custom-navbar",
  class CustomNavbar extends HTMLElement {
    constructor() {
      super();
      const template = document.createElement("template");
      template.innerHTML = `
            <style>
                .nav-ul{
                 position: fixed;
                 top: 0;
                 left: 0;
                 width: 100%; /* 让它占据整个宽度 */
                 z-index: 1000; /* 设置一个足够高的 z-index */
                }
                ul {
                    list-style-type: none;
                    margin: 0;
                    padding: 0;
                    background-color: #213347;
                    overflow: hidden;
                    display: flex; /* 使用 flex 布局使得按钮右对齐 */
                    align-items: center; /* 垂直居中对齐 */
                }

                li {
                    float: left;
                }

                li a {
                    color: white;
                    padding: 14px 16px;
                    display: inline-block;
                    text-decoration: none;
                }

                li>a:hover:not(a.active),
                .dropbtn:hover {
                    background-color: #183449;
                }

                .dropdown-content {
                    display: none;
                    position: absolute;
                    background-color: #f9f9f9;
                    min-width: 100px;
                    box-shadow: 0 8px 16px 0 rgba(0, 0, 0, .2);
                    z-index: 1001; /* 确保比 .dropdown 更高 */
                }

                .dropdown-content a {
                    color: black;
                    display: block;
                }

                .dropdown-content a:hover {
                    background-color: #f1f1f1;
                    color: deepskyblue;
                }

                .dropdown:hover .dropdown-content {
                    display: block;
                }

                /* 新添加的样式 */

                .buttons{
                    margin-left: auto; /* 将按钮推向右侧 */
                }

                .window-buttons {
                    margin-left: auto; /* 将按钮推向右侧 */
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
            </style>
            <ul class="nav-ul">
                <li>
                    <div class="dropdown">
                        <a href="#" class="dropbtn">曲线图</a>
                        <div class="dropdown-content">
                            <a href="#" id="toShowAll">总览图</a>
                            <a href="#" id="toShowOne">详细图</a>
                        </div>
                    </div>
                </li>
                <li><a href="#show" id="toPostion">3D姿态</a></li>
                <li><a href="#about" id="toOutput">颗粒数据导出</a></li>
                <li class = "buttons">
                    <div class="window-buttons">
                        <button id="minimize-btn">-</button>
                        <button id="close-btn">x</button>
                    </div>
                </li>
            </ul>
        `;
      const shadowRoot = this.attachShadow({ mode: "open" });
      shadowRoot.appendChild(template.content);
    }

    connectedCallback() {
      const { ipcRenderer } = require("electron");

      this.shadowRoot
        .getElementById("toShowAll")
        .addEventListener("click", () => {
          ipcRenderer.send("gotoPageShowAll");
        });
      this.shadowRoot
        .getElementById("toShowOne")
        .addEventListener("click", () => {
          ipcRenderer.send("gotoPageShowOne");
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
