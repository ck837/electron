customElements.define('custom-navbar', class CustomNavbar extends HTMLElement {
    constructor() {
        super();
        const template = document.createElement('template');
        template.innerHTML = `
            <style>
                ul {
                    list-style-type: none;
                    margin: 0;
                    padding: 0;
                    background-color: #999;
                    overflow: hidden;
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
                    background-color: #555;
                }

                .dropdown-content {
                    display: none;
                    position: absolute;
                    background-color: #f9f9f9;
                    min-width: 100px;
                    box-shadow: 0 8px 16px 0 rgba(0, 0, 0, .2);
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
            </style>
            <ul class="nav-ul">
                <li><a href="#port" id="toPort">串口选择</a></li>
                <li>
                    <div class="dropdown"> <a href="#" class="dropbtn">折线图</a>
                        <div class="dropdown-content">
                            <a href="#" id="toShowAll">总览图</a>
                            <a href="#" id="toShowOne">详细图</a>
                        </div>
                    </div>
                </li>
                <li><a href="#show" id="toPostion">位姿图</a></li>
                <li><a href="#about" id="toOutput">数据导出</a></li>
            </ul>
        `;
        const shadowRoot = this.attachShadow({ mode: 'open' });
        shadowRoot.appendChild(template.content);
    }
    
    connectedCallback() {
        // JavaScript event listeners can be added here
        const { ipcRenderer } = require('electron');
        this.shadowRoot.getElementById('toPort').addEventListener('click', () => {
            ipcRenderer.send('gotoPagePort');
        });
        this.shadowRoot.getElementById('toShowAll').addEventListener('click', () => {
            ipcRenderer.send('gotoPageShowAll');
        });
        this.shadowRoot.getElementById('toShowOne').addEventListener('click', () => {
            ipcRenderer.send('gotoPageShowOne');
        });
        this.shadowRoot.getElementById('toPostion').addEventListener('click', () => {
            ipcRenderer.send('gotoPagePosition');
        });
        this.shadowRoot.getElementById('toOutput').addEventListener('click', () => {
            ipcRenderer.send('gotoPageOutput');
        });
    }
});
