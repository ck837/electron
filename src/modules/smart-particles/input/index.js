customElements.define(
  "input-sider",
  class InputSider extends HTMLElement {
    constructor() {
      super();
      this.typeSelect = null;
      this.confirmButton = null;

      const template = document.createElement("template");
      template.innerHTML = `
             <style>
                  .sider-input {
                      width: 300px;
                      height: 100%;
                  }

                  .com-input {
                      width: 100%;
                  }

                  .title {
                      text-align: center;
                  }

                  .com-input-com {
                      width: 300px;
                      margin-top: 10px;
                      display: flex;
                      justify-content: center;
                      align-items: center;
                  }

                  .number-input {
                      width: 100px;
                      margin-right: 20px;
                  }
              </style>
            <div class="sider-input">
                  <div class="com-input">
                      <p class="title">导出端口：</p>
                      <div class="com-input-com">
                          <label for="com">COM&nbsp;&nbsp;:&nbsp;&nbsp;</label>
                          <select class="number-input" name="COM" id="com">
                              <option value="1">1</option>
                              <option value="2">2</option>
                              <option value="3">3</option>
                              <option value="4">4</option>
                              <option value="5">5</option>
                              <option value="6">6</option>
                              <option value="7">7</option>
                              <option value="8">8</option>
                              <option value="9">9</option>
                              <option value="10">10</option>
                              <option value="11">11</option>
                              <option value="12">12</option>
                              <option value="13">13</option>
                              <option value="14">14</option>
                              <option value="15">15</option>
                          </select>
                      </div>
                      <div class="com-input-com">
                          <label for="num">波特率&nbsp;&nbsp;:&nbsp;&nbsp;</label>
                          <select class="number-input" name="NUM" id="num">
                              <option value="7200">7200</option>
                              <option value="9600">9600</option>
                              <option value="10800">10800</option>
                          </select>
                      </div>
                  </div>
                  <div class="type-input">
                      <p class="title">参数配置：</p>
                      <div class="com-input-com">
                          <label for="type">输出类型&nbsp;&nbsp;:&nbsp;&nbsp;</label>
                          <select class="number-input" name="TYPE" id="type">
                              <option value="normal">普通型</option>
                              <option value="special">耐高温型</option>
                          </select>
                      </div>
                  </div>
                  <div class="params-input ">
                      <p class="title">参数配置：</p>
                      <div class="com-input-com">
                          <p>分段点：</p>
                          <input type="text" id="cut0" class="number-input" placeholder="输入数字" />
                      </div>
                      <div class="com-input-com">
                          <p>1：</p>
                          <input type="text" id="cut1" class="number-input" placeholder="输入数字" />
                          <p>2：</p>
                          <input type="text" id="cut2" class="number-input" placeholder="输入数字" />
                      </div>
                      <div class="com-input-com">
                          <p>3：</p>
                          <input type="text" id="cut3" class="number-input" placeholder="输入数字" />
                          <p>4：</p>
                          <input type="text" id="cut4" class="number-input" placeholder="输入数字" />
                      </div>
                  </div>
                  <div class="button-push">
                      <button type="button" id="confirm" class="title">确定</button>
                  </div>
                  <div class="func-show">
                      <p class="title">函数参数：</p>
                      <div class="com-input-com">
                          <p>当 V <= XXX , F=XX , V+XX </p>
                      </div>
                      <div class="com-input-com">
                          <p>当 V > XXX , F=XX , V+XX </p>
                      </div>
                  </div>
            </div>
        `;
      const shadowRoot = this.attachShadow({ mode: "open" });
      shadowRoot.appendChild(template.content);
    }

    connectedCallback() {
      // JavaScript event listeners can be added here
      const fs = require("fs");
      const path = require("path");

      this.typeSelect = this.shadowRoot.getElementById("type");
      this.confirmButton = this.shadowRoot.getElementById("confirm");
      this.confirmButton.addEventListener(
        "click",
        this.saveConfiguration.bind(this)
      );
    }

    saveConfiguration() {
      const selectedType = this.typeSelect.value;
      const configuration = {
        type: selectedType,
      };
      const jsonData = JSON.stringify(configuration, null, 2);
      const currentDir = process.cwd();
      const filePath = path.join(currentDir, "configuration.json");
      fs.writeFile(filePath, jsonData, (err) => {
        if (err) {
          console.error("Error saving configuration:", err);
        } else {
          console.log("Configuration saved to:", filePath);
        }
      });
    }

    disconnectedCallback() {
      // 移除事件监听器
      this.confirmButton.removeEventListener("click", this.saveConfiguration);
    }
  }
);
