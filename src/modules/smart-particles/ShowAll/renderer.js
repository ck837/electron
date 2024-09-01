/*
1、侧边栏处理
2、图像处理
3、port数据处理
*/

// ----------------------侧边栏逻辑处理 start --------------------
const fs = require("fs");
const path = require("path");

const type_x = [];
const type_y = [];
const type_z = [];

document.addEventListener("DOMContentLoaded", function () {
  const changeTitle = document.getElementById("changeTitle");

  // Get the elements
  const comSelect = document.getElementById("com");
  const numSelect = document.getElementById("num");
  const typeSelect = document.getElementById("type");
  const cut0Select = document.getElementById("cut0");
  const cut1Select = document.getElementById("cut1");
  const cut2Select = document.getElementById("cut2");
  const cut3Select = document.getElementById("cut3");
  const cut4Select = document.getElementById("cut4");
  const cut5Select = document.getElementById("cut5");
  const cut6Select = document.getElementById("cut6");
  const cut7Select = document.getElementById("cut7");
  const cut8Select = document.getElementById("cut8");
  const cut9Select = document.getElementById("cut9");
  const cut10Select = document.getElementById("cut10");
  const cut11Select = document.getElementById("cut11");
  const cut12Select = document.getElementById("cut12");
  const cut13Select = document.getElementById("cut13");
  const cut14Select = document.getElementById("cut14");

  // x
  const cut0Value = document.getElementById("cut0_value");
  const cut00Value = document.getElementById("cut0_value_0");
  const cut1Value = document.getElementById("cut1_value");
  const cut2Value = document.getElementById("cut2_value");
  const cut3Value = document.getElementById("cut3_value");
  const cut4Value = document.getElementById("cut4_value");

  // y
  const cut5Value = document.getElementById("cut5_value");
  const cut50Value = document.getElementById("cut5_value_0");
  const cut6Value = document.getElementById("cut6_value");
  const cut7Value = document.getElementById("cut7_value");
  const cut8Value = document.getElementById("cut8_value");
  const cut9Value = document.getElementById("cut9_value");

  // z
  const cut10Value = document.getElementById("cut10_value");
  const cut100Value = document.getElementById("cut10_value_0");
  const cut11Value = document.getElementById("cut11_value");
  const cut12Value = document.getElementById("cut12_value");
  const cut13Value = document.getElementById("cut13_value");
  const cut14Value = document.getElementById("cut14_value");

  // Get the confirm button element
  const confirmButton = document.getElementById("confirm");

  // Add an event listener to the confirm button
  confirmButton.addEventListener("click", saveConfiguration);

  // 针对所有输入框内的数据进行保存操作，保证界面切换后的数据一致性
  function saveConfiguration() {
    //修改界面中函数里面的元素
    // x
    cut0Value.textContent = cut0Select.value;
    cut00Value.textContent = cut0Select.value;
    cut1Value.textContent = cut1Select.value;
    cut2Value.textContent = cut2Select.value;
    cut3Value.textContent = cut3Select.value;
    cut4Value.textContent = cut4Select.value;

    // y
    cut5Value.textContent = cut5Select.value;
    cut50Value.textContent = cut5Select.value;
    cut6Value.textContent = cut6Select.value;
    cut7Value.textContent = cut7Select.value;
    cut8Value.textContent = cut8Select.value;
    cut9Value.textContent = cut9Select.value;

    // z
    cut10Value.textContent = cut10Select.value;
    cut100Value.textContent = cut10Select.value;
    cut11Value.textContent = cut11Select.value;
    cut12Value.textContent = cut12Select.value;
    cut13Value.textContent = cut13Select.value;
    cut14Value.textContent = cut14Select.value;

    // Get the selected value
    const selectedCom = comSelect.value;
    const selectedType = typeSelect.value;
    const selectedNum = numSelect.value;

    if (selectedType === "normal") {
      changeTitle.textContent = "压力";
    } else {
      changeTitle.textContent = "环境温度";
      updateChartTitle();
    }
    type_x.push(
      ...[
        parseFloat(cut0Select.value),
        parseFloat(cut1Select.value),
        parseFloat(cut2Select.value),
        parseFloat(cut3Select.value),
        parseFloat(cut4Select.value),
      ]
    );
    type_y.push(
      ...[
        parseFloat(cut5Select.value),
        parseFloat(cut6Select.value),
        parseFloat(cut7Select.value),
        parseFloat(cut8Select.value),
        parseFloat(cut9Select.value),
      ]
    );
    type_z.push(
      ...[
        parseFloat(cut10Select.value),
        parseFloat(cut11Select.value),
        parseFloat(cut12Select.value),
        parseFloat(cut13Select.value),
        parseFloat(cut14Select.value),
      ]
    );

    // Create a JavaScript object with the configuration
    const configuration = {
      com: selectedCom,
      num: selectedNum,
      type: selectedType,
      cut0: cut0Select.value,
      cut1: cut1Select.value,
      cut2: cut2Select.value,
      cut3: cut3Select.value,
      cut4: cut4Select.value,
      cut5: cut5Select.value,
      cut6: cut6Select.value,
      cut7: cut7Select.value,
      cut8: cut8Select.value,
      cut9: cut9Select.value,
      cut10: cut10Select.value,
      cut11: cut11Select.value,
      cut12: cut12Select.value,
      cut13: cut13Select.value,
      cut14: cut14Select.value,
    };

    getData("COM" + selectedCom, Number(selectedNum));

    // Convert the object to a JSON string
    const jsonData = JSON.stringify(configuration, null, 2);

    // Get the path to the current directory
    const currentDir = process.cwd();

    // Construct the full file path
    const filePath = path.join(currentDir, "configuration.json");

    // Write the JSON data to the file
    fs.writeFile(filePath, jsonData, (err) => {
      if (err) {
        console.error("Error saving configuration:", err);
      } else {
        console.log("Configuration saved to:", filePath);
      }
    });
  }
});

// ----------------------侧边栏逻辑处理 end --------------------

// --------------------------------------传感器数据处理------------------------------
const { SerialPort } = require("serialport");
// 获取canvas元素
const canvas1 = document.getElementById("chart_tmp");
const ctx1 = canvas1.getContext("2d");

const canvas2 = document.getElementById("chart_adc");
const ctx2 = canvas2.getContext("2d");

const canvas3 = document.getElementById("chart_acc");
const ctx3 = canvas3.getContext("2d");

const canvas4 = document.getElementById("chart_mag");
const ctx4 = canvas4.getContext("2d");

const canvas5 = document.getElementById("chart_calculate");
const ctx5 = canvas5.getContext("2d");

const canvas6 = document.getElementById("chart_eulerAngles");
const ctx6 = canvas6.getContext("2d");

const temperatureData = [];
const adcx = [];
const adcy = [];
const adcz = [];
const accx = [];
const accy = [];
const accz = [];
const magx = [];
const magy = [];
const magz = [];
//压力或者环境温度
const calculatex = [];
const calculatey = [];
const calculatez = [];
//欧拉角
const EulerAnglesx = [];
const EulerAnglesy = [];
const EulerAnglesz = [];

const myChart1 = new Chart(ctx1, {
  type: "line",
  data: {
    labels: [], // x轴坐标标签
    datasets: [
      {
        label: "Temperature",
        data: temperatureData, // 温度数据数组
        fill: false,
        borderColor: "rgb(255, 99, 132)",
        tension: 0.1,
      },
    ],
  },
  options: {
    scales: {
      x: {
        display: true,
        title: {
          display: true,
          text: "Time",
        },
      },
      y: {
        display: true,
        title: {
          display: true,
          text: "Temperature (℃)",
        },
      },
    },
  },
});

const myChart2 = new Chart(ctx2, {
  type: "line",
  data: {
    labels: [], // x轴坐标标签
    datasets: [
      {
        label: "adc_x",
        data: adcx, // 压力数据数组
        fill: false,
        borderColor: "rgb(255, 99, 132)",
        tension: 0.1,
      },
      {
        label: "adc_y",
        data: adcy, // 压力数据数组
        fill: false,
        borderColor: "rgb(75, 192, 192)",
        tension: 0.1,
      },
      {
        label: "adc_z",
        data: adcz, // 压力数据数组
        fill: false,
        borderColor: "rgb(54, 162, 235)",
        tension: 0.1,
      },
    ],
  },
  options: {
    scales: {
      x: {
        display: true,
        title: {
          display: true,
          text: "Time",
        },
      },
      y: {
        display: true,
        title: {
          display: true,
          text: "Voltage(V)",
        },
        // min: 0, // 设置y轴的最小值
        // max: 40, // 设置y轴的最大值
        // stepSize: 5 // 设置y轴刻度的步长
      },
    },
  },
});

const myChart3 = new Chart(ctx3, {
  type: "line",
  data: {
    labels: [], // x轴坐标标签
    datasets: [
      {
        label: "acc_x",
        data: accx, // 压力数据数组
        fill: false,
        borderColor: "rgb(255, 99, 132)",
        tension: 0.1,
      },
      {
        label: "acc_y",
        data: accy, // 压力数据数组
        fill: false,
        borderColor: "rgb(75, 192, 192)",
        tension: 0.1,
      },
      {
        label: "acc_z",
        data: accz, // 压力数据数组
        fill: false,
        borderColor: "rgb(54, 162, 235)",
        tension: 0.1,
      },
    ],
  },
  options: {
    scales: {
      x: {
        display: true,
        title: {
          display: true,
          text: "Time",
        },
      },
      y: {
        display: true,
        title: {
          display: true,
          text: "Acceleration(g)",
        },
        // min: 0, // 设置y轴的最小值
        // max: 40, // 设置y轴的最大值
        // stepSize: 5 // 设置y轴刻度的步长
      },
    },
  },
});

const myChart4 = new Chart(ctx4, {
  type: "line",
  data: {
    labels: [], // x轴坐标标签
    datasets: [
      {
        label: "mag_x",
        data: magx, // 压力数据数组
        fill: false,
        borderColor: "rgb(255, 99, 132)",
        tension: 0.1,
      },
      {
        label: "mag_y",
        data: magy, // 压力数据数组
        fill: false,
        borderColor: "rgb(75, 192, 192)",
        tension: 0.1,
      },
      {
        label: "mag_z",
        data: magz, // 压力数据数组
        fill: false,
        borderColor: "rgb(54, 162, 235)",
        tension: 0.1,
      },
    ],
  },
  options: {
    scales: {
      x: {
        display: true,
        title: {
          display: true,
          text: "Time",
        },
      },
      y: {
        display: true,
        title: {
          display: true,
          text: "Magenetic Field Strength (mGauss)",
        },
        // min: 0, // 设置y轴的最小值
        // max: 40, // 设置y轴的最大值
        // stepSize: 5 // 设置y轴刻度的步长
      },
    },
  },
});

const myChart5 = new Chart(ctx5, {
  type: "line",
  data: {
    labels: [], // x轴坐标标签
    datasets: [
      {
        label: "x",
        data: calculatex, // 压力数据数组
        fill: false,
        borderColor: "rgb(75, 192, 192)",
        tension: 0.1,
      },
      {
        label: "y",
        data: calculatey, // 压力数据数组
        fill: false,
        borderColor: "rgb(255, 99, 132)",
        tension: 0.1,
      },
      {
        label: "z",
        data: calculatez, // 压力数据数组
        fill: false,
        borderColor: "rgb(54, 162, 235)",
        tension: 0.1,
      },
    ],
  },
  options: {
    scales: {
      x: {
        display: true,
        title: {
          display: true,
          text: "Time",
        },
      },
      y: {
        display: true,
        title: {
          display: true,
          text: "Force (N)",
        },
      },
    },
  },
});

function updateChartTitle() {
  myChart5.options.scales.y.title.text = "Temperature (℃)";
  myChart5.update();
}
const myChart6 = new Chart(ctx6, {
  type: "line",
  data: {
    labels: [], // x轴坐标标签
    datasets: [
      {
        label: "x",
        data: EulerAnglesx, 
        fill: false,
        borderColor: "rgb(255, 99, 132)",
        tension: 0.1,
      },
      {
        label: "y",
        data: EulerAnglesy,
        fill: false,
        borderColor: "rgb(75, 192, 192)",
        tension: 0.1,
      },
      {
        label: "z",
        data: EulerAnglesz, 
        fill: false,
        borderColor: "rgb(54, 162, 235)",
        tension: 0.1,
      },
    ],
  },
  options: {
    scales: {
      x: {
        display: true,
        title: {
          display: true,
          text: "Time",
        },
      },
      y: {
        display: true,
        title: {
          display: true,
          text: "Euler Angles (degree)",
        },
      },
    },
  },
});

function updateChartData() {
  //------------------------------------chart1 展示-------------------------------------
  // 添加新数据
  let startTime = new Date();
  let formattedStartTime = `${startTime.toLocaleTimeString()}:${startTime.getMilliseconds()}`;
  // 检查数据点数量是否超过阈值
  const maxDataPoint = 20; // 设置数据点的最大数量

  myChart1.data.labels.push(formattedStartTime);
  // 检查数据点数量是否超过阈值
  if (myChart1.data.labels.length > maxDataPoint + 1) {
    // 删除第一个数据节点的标签
    myChart1.data.labels.shift();

    // 删除第一个数据点
    myChart1.data.datasets[0].data.shift();

    console.log("删除数据一");
    console.log(myChart1.data.datasets);
  }
  myChart1.update();

  //------------------------------------chart2 展示-------------------------------------

  myChart2.data.labels.push(formattedStartTime);

  if (myChart2.data.labels.length > maxDataPoint + 1) {
    // 删除第一个数据节点的标签
    myChart2.data.labels.shift();

    // 删除每个数据集（datasets）中对应的第一个数据点
    myChart2.data.datasets.forEach(function (dataset) {
      dataset.data.shift();
    });
  }
  // 更新图表
  myChart2.update();

  //------------------------------------chart3 展示-------------------------------------

  myChart3.data.labels.push(formattedStartTime);
  // 其他数据集的添加操作，例如：myChart1.data.datasets[0].data.push(newValue);

  if (myChart3.data.labels.length > maxDataPoint + 1) {
    // 删除第一个数据节点的标签
    myChart3.data.labels.shift();

    // 删除每个数据集（datasets）中对应的第一个数据点
    myChart3.data.datasets.forEach(function (dataset) {
      dataset.data.shift();
    });
  }

  // 更新图表
  myChart3.update();

  //------------------------------------chart4 展示-------------------------------------

  myChart4.data.labels.push(formattedStartTime);
  // 其他数据集的添加操作，例如：myChart1.data.datasets[0].data.push(newValue);

  if (myChart4.data.labels.length > maxDataPoint + 1) {
    // 删除第一个数据节点的标签
    myChart4.data.labels.shift();

    // 删除每个数据集（datasets）中对应的第一个数据点
    myChart4.data.datasets.forEach(function (dataset) {
      dataset.data.shift();
    });
  }
  myChart4.update();

  myChart5.data.labels.push(formattedStartTime);

  if (myChart5.data.labels.length > maxDataPoint + 1) {
    // 删除第一个数据节点的标签
    myChart5.data.labels.shift();

    // 删除每个数据集（datasets）中对应的第一个数据点
    myChart5.data.datasets.forEach(function (dataset) {
      dataset.data.shift();
    });
  }
  myChart5.update();

  myChart6.data.labels.push(formattedStartTime);

  if (myChart6.data.labels.length > maxDataPoint + 1) {
    // 删除第一个数据节点的标签
    myChart6.data.labels.shift();

    // 删除每个数据集（datasets）中对应的第一个数据点
    myChart6.data.datasets.forEach(function (dataset) {
      dataset.data.shift();
    });
  }

  // 更新图表
  myChart6.update();
}

//----------------------------------test end----------------------------------------------

// ------------------------以下为port数据处理 start------------------------

function generateNextArr(pattern) {
  var i = 0;
  var j = -1;
  var next = [];
  next[0] = -1;
  while (i < pattern.length) {
    if (j === -1 || pattern[i] === pattern[j]) {
      i++;
      j++;
      next[i] = j;
    } else {
      j = next[j];
    }
  }
  return next;
}

function kmp(pattern, str) {
  //母串，子串
  var next = generateNextArr(pattern);
  var i = 0; // str 指针
  var j = 0; // pattern指针
  while (i < str.length && j < pattern.length) {
    if (str[i] === pattern[j] || j === -1) {
      i++;
      j++;
    } else {
      j = next[j]; // 右移
    }
  }
  if (j === pattern.length) {
    return i - j;
  } else {
    return -1;
  }
}

// 以下为核心数据处理代码

let cnt = 0;
// --------------------------------------传感器数据处理 start------------------------------
function getData(portValue, rate) {
  port = new SerialPort({
    path: portValue,
    baudRate: rate,
  });

  let count = 0;
  let flag = [-1, -1, -1]; //第一个为温度54 6d 70,第二个为41 64 63 adc 压力,第三个为49 73 6d lsm 加速度 磁力

  const str_tmp = "84,109,112"; //54,6d,70
  const str_adc = "65,100,99"; //41 64 63
  const str_lsm = "73,115,109"; //49,73,6d

  let srcData = [];

  port.on("data", function (data) {
    srcData.push(data);

    //统计一组数据需要多少个buffer
    if (flag.includes(-1)) {
      const str = data.join(",");

      if (kmp(str_tmp, str) !== -1) flag[0] = count;

      if (kmp(str_adc, str) !== -1) flag[1] = count;

      if (kmp(str_lsm, str) !== -1) flag[2] = count;

      function isAllNone(arr) {
        return arr.every(function (element) {
          return element === -1;
        });
      }

      if (!isAllNone(flag)) count++;

      srcData = [];
    } else {
      //当获取一次的数据buffer大小后，要将温度所在的buffer处于最前面，这样后续数据处理顺序有保证
      if (!srcData[0].join(",").includes("84,109,112")) {
        srcData = [];
      }

      if (srcData.length === count) {
        //更新图表代码
        updateChartData();

        let test = [];

        //表格填入当前时间
        let time = new Date();
        const milliseconds = time.getMilliseconds();
        const formattedTime = `${time.toLocaleString()}:${milliseconds}`;

        test.push(formattedTime);

        cnt++;

        const mergedArray = [];

        for (const buffer of srcData) {
          for (const byte of buffer) {
            mergedArray.push(byte);
          }
        }

        srcData = mergedArray;
        // console.log(srcData);

        //-----------------------------------handle adc events--------------------------------

        // 处理加速度值的函数
        function processADC(hexArray) {
          let q1 =
            Math.pow(16, 5) * parseInt(hexArray[4], 16) +
            Math.pow(16, 4) * parseInt(hexArray[5], 16) +
            Math.pow(16, 3) * parseInt(hexArray[2], 16) +
            Math.pow(16, 2) * parseInt(hexArray[3], 16) +
            16 * parseInt(hexArray[0], 16) +
            parseInt(hexArray[1], 16);
          let AIN1 =
            q1 *
            ((2 * 210 * Math.pow(10, -4) * 10 * Math.pow(10, 3)) /
              Math.pow(2, 24));
          let r1 = (AIN1 / 210) * Math.pow(10, 3);
          let F1 = 351.92 / (r1 - 0.9994);

          if (F1 < 0) F1 = -F1;

          return F1;
        }

        // adc_x
        let adcValue_x = [
          srcData[0].toString(16),
          srcData[1].toString(16),
          srcData[2].toString(16),
          srcData[3].toString(16),
          srcData[4].toString(16),
          srcData[5].toString(16),
        ];
        // adc_y
        let adcValue_y = [
          srcData[6].toString(16),
          srcData[7].toString(16),
          srcData[8].toString(16),
          srcData[9].toString(16),
          srcData[10].toString(16),
          srcData[11].toString(16),
        ];
        // adc_z
        let adcValue_z = [
          srcData[12].toString(16),
          srcData[13].toString(16),
          srcData[14].toString(16),
          srcData[15].toString(16),
          srcData[16].toString(16),
          srcData[17].toString(16),
        ];
        let adc_x = processADC(adcValue_x);
        // console.log("adc_x: " + adc_x);
        adcx.push(adc_x);

        let adc_y = processADC(adcValue_y);
        // console.log("adc_y: " + adc_y);
        adcy.push(adc_y);

        let adc_z = processADC(adcValue_z);
        // console.log("adc_z: " + adc_z);
        adcz.push(adc_z);
        typeCalculate(adc_x,adc_y, adc_z)


        //-----------------------------------handle acc events--------------------------------

        // 处理加速度值的函数
        function processAcceleration(hexArray) {
          let acc_x_decimal =
            parseInt(hexArray[0], 16) * Math.pow(16, 3) +
            parseInt(hexArray[1], 16) * Math.pow(16, 2) +
            parseInt(hexArray[2], 16) * 16 +
            parseInt(hexArray[3], 16);

          let acc_x_binary = acc_x_decimal.toString(2).padStart(16, "0");

          let ACC_X;
          if (acc_x_binary[0] === "0") {
            ACC_X = 0.061 * acc_x_decimal;
          } else {
            let acc_x_binary_tmp = "1";
            for (let i = 1; i < acc_x_binary.length; i++) {
              if (acc_x_binary[i] === "0") acc_x_binary_tmp += "1";
              else acc_x_binary_tmp += "0";
            }
            ACC_X = -0.061 * (parseInt(acc_x_binary_tmp.slice(1), 2) + 1);
          }

          return ACC_X;
        }
        let accValue_x = [
          srcData[28].toString(16),
          srcData[29].toString(16),
          srcData[30].toString(16),
          srcData[31].toString(16),
        ];
        let accValue_y = [
          srcData[32].toString(16),
          srcData[33].toString(16),
          srcData[34].toString(16),
          srcData[35].toString(16),
        ];
        let accValue_z = [
          srcData[36].toString(16),
          srcData[37].toString(16),
          srcData[38].toString(16),
          srcData[39].toString(16),
        ];
        // 调用函数并输出结果
        let result_x = processAcceleration(accValue_x);
        let result_y = processAcceleration(accValue_y);
        let result_z = processAcceleration(accValue_z);
        // console.log("acc_x: " + result_x);
        // console.log("acc_y: " + result_y);
        // console.log("acc_z: " + result_z);
        accx.push(result_x/1000);
        accy.push(result_y/1000);
        accz.push(result_z/1000);


        //-----------------------------------handle tmp events--------------------------------
        // 处理温度Tmp 54 6d 70
        for (let i = 0; i < srcData.length; i++) {
          if (srcData[i] === parseInt("54", 16)) {
            if (
              srcData[i + 1] === parseInt("6d", 16) &&
              srcData[i + 2] === parseInt("70", 16)
            ) {
              // temperature 缺少负数的情况
              let tmp =
                (srcData[i + 3] || 0).toString(2).padStart(4, "0") +
                (srcData[i + 4] || 0).toString(2).padStart(4, "0") +
                (srcData[i + 5] || 0).toString(2).padStart(4, "0") +
                (srcData[i + 6] || 0).toString(2).padStart(4, "0");
              tmp = tmp.slice(0, -2);
              if (tmp[0] == 0) {
                let s1 =
                  parseInt(tmp[1]) * 128 +
                  parseInt(tmp[2]) * 64 +
                  parseInt(tmp[3]) * 32 +
                  parseInt(tmp[4]) * 16 +
                  parseInt(tmp[5]) * 8 +
                  parseInt(tmp[6]) * 4 +
                  parseInt(tmp[7]) * 2 +
                  parseInt(tmp[8]);
                let s2 =
                  0.03125 *
                  (16 * parseInt(tmp[9]) +
                    8 * parseInt(tmp[10]) +
                    4 * parseInt(tmp[11]) +
                    2 * parseInt(tmp[12]) +
                    parseInt(tmp[13]));
                temperature = s1 + s2;
                // console.log("temperature: ", temperature);
                temperatureData.push(temperature);
                console.log(temperatureData);
              } else {
                for (let i = 1; i < tmp.size(); i++) {
                  if (tmp[i] === "0") tmp[i] = "1";
                  else tmp[i] = "0";
                }
                d1 =
                  tmp[1] * (2 ^ 7) +
                  tmp[2] * (2 ^ 6) +
                  tmp[3] * (2 ^ 5) +
                  tmp[4] * (2 ^ 4) +
                  tmp[5] * (2 ^ 3) +
                  tmp[6] * (2 ^ 2) +
                  tmp[7] * 2 +
                  tmp[8];
                d2 =
                  0.03125 *
                  (16 * tmp[9] +
                    8 * tmp[10] +
                    4 * tmp[11] +
                    2 * tmp[12] +
                    tmp[13]);
                temperature = (d1 + d2) * -1;
                console.log("temperature: ", temperature);
                temperatureData.push(temperature);
              }
              if (temperatureData.length > 21) {
                temperatureData.splice(0, 1);
              }
            }
          }
        }
        //-----------------------------------handle mag events--------------------------------

        function processMagnetism(hexArray) {
          let mag_decimal =
            parseInt(hexArray[0], 16) * Math.pow(16, 3) +
            parseInt(hexArray[1], 16) * Math.pow(16, 2) +
            parseInt(hexArray[2], 16) * 16 +
            parseInt(hexArray[3], 16);

          let mag_binary = mag_decimal.toString(2).padStart(16, "0");

          let Mag;
          if (mag_binary[0] === "0") {
            Mag = 1.5 * mag_decimal;
          } else {
            let mag_binary_tmp = "1";
            for (let i = 1; i < mag_binary.length; i++) {
              if (mag_binary[i] === "0") mag_binary_tmp += "1";
              else mag_binary_tmp += "0";
            }
            Mag = -1.5 * parseInt(parseInt(mag_binary_tmp.slice(1), 2) + 1);
          }
          return Mag;
        }

        // mag
        let magValue_x = [
          srcData[40].toString(16),
          srcData[41].toString(16),
          srcData[42].toString(16),
          srcData[43].toString(16),
        ];
        let magValue_y = [
          srcData[44].toString(16),
          srcData[45].toString(16),
          srcData[46].toString(16),
          srcData[47].toString(16),
        ];
        let magValue_z = [
          srcData[48].toString(16),
          srcData[49].toString(16),
          srcData[50].toString(16),
          srcData[51].toString(16),
        ];
        let mag_result_x = processMagnetism(magValue_x);
        let mag_result_y = processMagnetism(magValue_y);
        let mag_result_z = processMagnetism(magValue_z);
        // console.log("mag_x: " + mag_result_x);
        // console.log("mag_y: " + mag_result_y);
        // console.log("mag_z: " + mag_result_z);
        magx.push(mag_result_x);
        magy.push(mag_result_y);
        magz.push(mag_result_z);

        //计算欧拉角
        // 保存先前的滤波数据
        let prevFilteredAcc = [0, 0, 0];
        let prevFilteredMag = [0, 0, 0];

        // 指定EMA参数
        const alpha = 0.2;

        function KGetQuat(ax, ay, az, mx, my, mz) {
          // 函数：返回符号与y相同的x值
          function copysign(x, y) {
            return y < 0 ? -Math.abs(x) : Math.abs(x);
          }

          // 先前滤波数据为空时初始化
          if (!prevFilteredAcc) prevFilteredAcc = [ax, ay, az];
          if (!prevFilteredMag) prevFilteredMag = [mx, my, mz];

          // 对加速度和磁力计数据进行EMA滤波
          ax = alpha * ax + (1 - alpha) * prevFilteredAcc[0];
          ay = alpha * ay + (1 - alpha) * prevFilteredAcc[1];
          az = alpha * az + (1 - alpha) * prevFilteredAcc[2];
          prevFilteredAcc = [ax, ay, az];

          mx = alpha * mx + (1 - alpha) * prevFilteredMag[0];
          my = alpha * my + (1 - alpha) * prevFilteredMag[1];
          mz = alpha * mz + (1 - alpha) * prevFilteredMag[2];
          prevFilteredMag = [mx, my, mz];

          // 数据归一化
          const accNorm = Math.sqrt(ax * ax + ay * ay + az * az);
          ax /= accNorm;
          ay /= accNorm;
          az /= accNorm;

          const magNorm = Math.sqrt(mx * mx + my * my + mz * mz);
          mx /= magNorm;
          my /= magNorm;
          mz /= magNorm;

          // 计算改进的四元数
          const gx = 2 * ax;
          const gy = 2 * ay;
          const gz = 2 * (az - 0.5);

          const hx = mx * Math.sqrt(1.0 - az * az) - mz * ay;
          const hy = my * Math.sqrt(1.0 - az * az) - mz * ax;
          const hz = mx * ay - my * ax;

          let qw = Math.sqrt(Math.max(0, 1 + gx + hy + hz)) / 2;
          let qx = Math.sqrt(Math.max(0, 1 + gx - hy - hz)) / 2;
          let qy = Math.sqrt(Math.max(0, 1 - gx + hy - hz)) / 2;
          let qz = Math.sqrt(Math.max(0, 1 - gx - hy + hz)) / 2;
          qx = copysign(qx, gy - hz);
          qy = copysign(qy, hx - gz);
          qz = copysign(qz, hx + gy);

          // 四元数归一化
          const qNorm = Math.sqrt(qw * qw + qx * qx + qy * qy + qz * qz);
          qw /= qNorm;
          qx /= qNorm;
          qy /= qNorm;
          qz /= qNorm;

          return [qw, qx, qy, qz];
        }

        function quaternionToEuler(qw, qx, qy, qz) {
          const ysqr = qy * qy;

          // roll (x-axis rotation)
          const t0 = 2 * (qw * qx + qy * qz);
          const t1 = 1 - 2 * (qx * qx + ysqr);
          const roll = Math.atan2(t0, t1);

          // pitch (y-axis rotation)
          let t2 = 2 * (qw * qy - qz * qx);
          t2 = t2 > 1 ? 1 : t2;
          t2 = t2 < -1 ? -1 : t2;
          const pitch = Math.asin(t2);

          // yaw (z-axis rotation)
          const t3 = 2 * (qw * qz + qx * qy);
          const t4 = 1 - 2 * (ysqr + qz * qz);
          const yaw = Math.atan2(t3, t4);
          // console.log(roll, pitch, yaw);

          EulerAnglesx.push(roll * (180 / Math.PI));
          EulerAnglesy.push(pitch * (180 / Math.PI));
          EulerAnglesz.push(yaw * (180 / Math.PI));
        }
        let tmp = KGetQuat(
          result_x,
          result_y,
          result_z,
          mag_result_x,
          mag_result_y,
          mag_result_z
        );
        // console.log(tmp);
        quaternionToEuler(tmp[0], tmp[1], tmp[2], tmp[3]);

        // 清空srcData
        srcData = [];
      }
    }
  });
}

//根据不同类型，选择不同的计算函数
function typeCalculate(x, y, z) {
  console.log("当前的adx：",x,y,z);
  if (x < type_x[0]) 
    {
      calculatex.push(type_x[1] * x + type_x[2]);
      console.log("当前的计算的x值",type_x[0],type_x[1],type_x[2],x)
    }
  else{
    calculatex.push(type_x[3] * x + type_x[4]);
    console.log("当前的计算的x值",type_x[0],type_x[1],type_x[2],x)
  }
  if (y < type_y[0]) calculatey.push(type_y[1] * y + type_y[2]);
  else calculatey.push(type_y[3] * y + type_y[4]);
  if (z < type_z[0]) calculatez.push(type_z[1] * z + type_z[2]);
  else calculatez.push(type_z[3] * z + type_z[4]);
}
