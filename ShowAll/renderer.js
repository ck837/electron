/*
1、侧边栏处理
2、图像处理
3、port数据处理
*/

// ----------------------侧边栏逻辑处理 start --------------------

const fs = require("fs");
const path = require("path");

document.addEventListener("DOMContentLoaded", function () {
  // Get the elements
  const comSelect = document.getElementById("com");
  const numSelect = document.getElementById("num");
  const typeSelect = document.getElementById("type");
  const cut0Select = document.getElementById("cut0");
  const cut1Select = document.getElementById("cut1");
  const cut2Select = document.getElementById("cut2");
  const cut3Select = document.getElementById("cut3");
  const cut4Select = document.getElementById("cut4");

  const cut0Value = document.getElementById("cut0_value");
  const cut00Value = document.getElementById("cut0_value_0");
  const cut1Value = document.getElementById("cut1_value");
  const cut2Value = document.getElementById("cut2_value");
  const cut3Value = document.getElementById("cut3_value");
  const cut4Value = document.getElementById("cut4_value");

  // Get the confirm button element
  const confirmButton = document.getElementById("confirm");

  // Add an event listener to the confirm button
  confirmButton.addEventListener("click", saveConfiguration);

  //页面加载好，后读取configuration文件进行相关数据的读取，将数据渲染进输入框内
  function insertData() {

  }

  // 针对所有输入框内的数据进行保存操作，保证界面切换后的数据一致性
  function saveConfiguration() {
    //修改界面中函数里面的元素
    cut0Value.textContent = cut0Select.value;
    cut00Value.textContent = cut0Select.value;
    cut1Value.textContent = cut1Select.value;
    cut2Value.textContent = cut2Select.value;
    cut3Value.textContent = cut3Select.value;
    cut4Value.textContent = cut4Select.value;

    // Get the selected value
    const selectedCom = comSelect.value;
    const selectedType = typeSelect.value;
    const selectedNum = numSelect.value;

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
    };

    getData("COM"+selectedCom,Number(selectedNum));

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
// const tableify = require('tableify')

// async function listSerialPorts() {
//   await SerialPort.list().then((ports, err) => {
//     if(err) {
//       document.getElementById('error').textContent = err.message
//       return
//     } else {
//       document.getElementById('error').textContent = ''
//     }
//     console.log('ports', ports);

//     if (ports.length === 0) {
//       document.getElementById('error').textContent = 'No ports discovered'
//     }

//     tableHTML = tableify(ports)
//     document.getElementById('ports').innerHTML = tableHTML
//   })
// }

// function listPorts() {
//   listSerialPorts();
//   setTimeout(listPorts, 2000);
// }

// // Set a timeout that will check for new serialPorts every 2 seconds.
// // This timeout reschedules itself.
// setTimeout(listPorts, 2000);

// listSerialPorts()

// const { Chart } = await import('chart.js');

// 获取canvas元素
const canvas1 = document.getElementById("chart_tmp");
const ctx1 = canvas1.getContext("2d");

const canvas2 = document.getElementById("chart_adc");
const ctx2 = canvas2.getContext("2d");

const canvas3 = document.getElementById("chart_acc");
const ctx3 = canvas3.getContext("2d");

const canvas4 = document.getElementById("chart_mag");
const ctx4 = canvas4.getContext("2d");

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

// 创建图表
const myChart1 = new Chart(ctx1, {
  type: "line",
  data: {
    labels: [], // x轴坐标标签
    datasets: [
      {
        label: "Temperature",
        data: temperatureData, // 温度数据数组
        fill: false,
        borderColor: "rgb(75, 192, 192)",
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
        // min: 0, // 设置y轴的最小值
        // max: 40, // 设置y轴的最大值
        // stepSize: 5 // 设置y轴刻度的步长
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
        borderColor: "rgb(75, 192, 192)",
        tension: 0.1,
      },
      {
        label: "adc_y",
        data: adcy, // 压力数据数组
        fill: false,
        borderColor: "rgb(255, 99, 132)",
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
          text: "Adc",
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
        borderColor: "rgb(75, 192, 192)",
        tension: 0.1,
      },
      {
        label: "acc_y",
        data: accy, // 压力数据数组
        fill: false,
        borderColor: "rgb(255, 99, 132)",
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
          text: "Acc",
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
        borderColor: "rgb(75, 192, 192)",
        tension: 0.1,
      },
      {
        label: "mag_y",
        data: magy, // 压力数据数组
        fill: false,
        borderColor: "rgb(255, 99, 132)",
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
          text: "Acc",
        },
        // min: 0, // 设置y轴的最小值
        // max: 40, // 设置y轴的最大值
        // stepSize: 5 // 设置y轴刻度的步长
      },
    },
  },
});

//---------------------------------test start----------------------------------------------

let data1 = {
  adc_x: 50726402,
  adc_y: 167838723,
  adc_z: 101255681,
  acc_x: 2058876.148,
  acc_y: 3094310.522,
  acc_z: 10238162.103,
  temperature: 24.84375,
  mag_x: 151883521.5,
  mag_y: 252250000.5,
  mag_z: 251788963.5,
};

let data2 = {
  adc_x: 252445958,
  adc_y: 167838222,
  adc_z: 235866383,
  acc_x: 2058907.624,
  acc_y: 15399203.438,
  acc_z: 10238131.542,
  temperature: 24.84375,
  mag_x: 353799574.5,
  mag_y: 352618390.5,
  mag_z: 251788963.5,
};

// setInterval(() => {
//   if (isData1) {
//     temperatureData.push(data1.temperature);
//     adcx.push(data1.adc_x);
//     adcy.push(data1.adc_y);
//     adcz.push(data1.adc_z);
//     accx.push(data1.acc_x);
//     accy.push(data1.acc_y);
//     accz.push(data1.acc_z);
//     magx.push(data1.mag_x);
//     magy.push(data1.mag_y);
//     magz.push(data1.mag_z);
//   } else {
//     temperatureData.push(data2.temperature);
//     adcx.push(data2.adc_x);
//     adcy.push(data2.adc_y);
//     adcz.push(data2.adc_z);
//     accx.push(data2.acc_x);
//     accy.push(data2.acc_y);
//     accz.push(data2.acc_z);
//     magx.push(data2.mag_x);
//     magy.push(data2.mag_y);
//     magz.push(data2.mag_z);
//   }
//   // 调用函数更新数据
//   updateChartData();

//   isData1 = !isData1;
// }, 500);

function updateChartData() {
  //------------------------------------chart1 展示-------------------------------------
  // 添加新数据
  myChart1.data.labels.push(new Date().toLocaleTimeString());
  // 其他数据集的添加操作，例如：myChart1.data.datasets[0].data.push(newValue);

  // 检查数据点数量是否超过阈值
  const maxDataPoints1 = 5; // 设置数据点的最大数量
  if (myChart1.data.labels.length > maxDataPoints1) {
    // 删除第一个数据节点
    myChart1.data.labels.shift();
    // 其他数据集的删除操作，例如：myChart1.data.datasets[0].data.shift();
  }

  // 更新图表
  myChart1.update();

  //------------------------------------chart2 展示-------------------------------------

  myChart2.data.labels.push(new Date().toLocaleTimeString());
  // 其他数据集的添加操作，例如：myChart1.data.datasets[0].data.push(newValue);

  // 检查数据点数量是否超过阈值
  const maxDataPoints2 = 20; // 设置数据点的最大数量
  if (myChart2.data.labels.length > maxDataPoints2) {
    // 删除第一个数据节点
    myChart2.data.labels.shift();
    // 其他数据集的删除操作，例如：myChart1.data.datasets[0].data.shift();
  }

  // 更新图表
  myChart2.update();

  //------------------------------------chart3 展示-------------------------------------

  myChart3.data.labels.push(new Date().toLocaleTimeString());
  // 其他数据集的添加操作，例如：myChart1.data.datasets[0].data.push(newValue);

  // 检查数据点数量是否超过阈值
  const maxDataPoints3 = 20; // 设置数据点的最大数量
  if (myChart3.data.labels.length > maxDataPoints3) {
    // 删除第一个数据节点
    myChart3.data.labels.shift();
    // 其他数据集的删除操作，例如：myChart1.data.datasets[0].data.shift();
  }

  // 更新图表
  myChart3.update();

  //------------------------------------chart4 展示-------------------------------------

  myChart4.data.labels.push(new Date().toLocaleTimeString());
  // 其他数据集的添加操作，例如：myChart1.data.datasets[0].data.push(newValue);

  // 检查数据点数量是否超过阈值
  const maxDataPoints4 = 20; // 设置数据点的最大数量
  if (myChart4.data.labels.length > maxDataPoints4) {
    // 删除第一个数据节点
    myChart4.data.labels.shift();
    // 其他数据集的删除操作，例如：myChart1.data.datasets[0].data.shift();
  }

  // 更新图表
  myChart4.update();
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
function getData(portValue,rate) {
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
        console.log(srcData);

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
        console.log("adc_x: " + adc_x);
        adcx.push(adc_x);

        let adc_y = processADC(adcValue_y);
        console.log("adc_y: " + adc_y);
        adcy.push(adc_y);

        let adc_z = processADC(adcValue_z);
        console.log("adc_z: " + adc_z);
        adcz.push(adc_z);


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
        console.log("acc_x: " + result_x);
        console.log("acc_y: " + result_y);
        console.log("acc_z: " + result_z);
        accx.push(result_x);
        accy.push(result_y);
        accz.push(result_z);

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
                console.log("temperature: ", temperature);
                temperatureData.push(temperature);
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
        console.log("mag_x: " + mag_result_x);
        console.log("mag_y: " + mag_result_y);
        console.log("mag_z: " + mag_result_z);
        magx.push(mag_result_x);
        magy.push(mag_result_y);
        magz.push(mag_result_z);

        //更新图表代码
        updateChartData();
        // 清空srcData
        srcData = [];
      }
    }
  });
}