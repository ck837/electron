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


const temperatureBtn = document.getElementById("temperature-btn");
const pressureBtn = document.getElementById("pressure-btn");
const accelerationBtn = document.getElementById("acceleration-btn");
const magneticBtn = document.getElementById("magnetic-btn");

const temperatureChart = document.getElementById("temperature-chart");
const pressureChart = document.getElementById("pressure-chart");
const accelerationChart = document.getElementById("acceleration-chart");
const magneticChart = document.getElementById("magnetic-chart");

temperatureBtn.addEventListener("click", function () {
  showChart(temperatureChart);
});

pressureBtn.addEventListener("click", function () {
  showChart(pressureChart);
});

accelerationBtn.addEventListener("click", function () {
  showChart(accelerationChart);
});

magneticBtn.addEventListener("click", function () {
  showChart(magneticChart);
});

function showChart(chart) {
  const allCharts = document.querySelectorAll(".chart-container");
  allCharts.forEach((c) => {
    c.style.display = "none";
  });
  chart.style.display = "block";
}

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
          text: "Mag",
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

let isData1 = true;

setInterval(() => {
  if (isData1) {
    temperatureData.push(data1.temperature);
    adcx.push(data1.adc_x);
    adcy.push(data1.adc_y);
    adcz.push(data1.adc_z);
    accx.push(data1.acc_x);
    accy.push(data1.acc_y);
    accz.push(data1.acc_z);
    magx.push(data1.mag_x);
    magy.push(data1.mag_y);
    magz.push(data1.mag_z);
  } else {
    temperatureData.push(data2.temperature);
    adcx.push(data2.adc_x);
    adcy.push(data2.adc_y);
    adcz.push(data2.adc_z);
    accx.push(data2.acc_x);
    accy.push(data2.acc_y);
    accz.push(data2.acc_z);
    magx.push(data2.mag_x);
    magy.push(data2.mag_y);
    magz.push(data2.mag_z);
  }
  // 调用函数更新数据
  updateChartData();

  isData1 = !isData1;
}, 500);

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

  //------------------------------------chart3 展示-------------------------------------

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

// 以下为核心数据处理代码

// function generateNextArr(pattern) {
//   var i = 0;
//   var j = -1;
//   var next = [];
//   next[0] = -1;
//   while (i < pattern.length) {
//     if (j === -1 || pattern[i] === pattern[j]) {
//       i++;
//       j++;
//       next[i] = j;
//     } else {
//       j = next[j];
//     }
//   }
//   return next;
// }

// function kmp(pattern, str) {
//   //母串，子串
//   var next = generateNextArr(pattern);
//   var i = 0; // str 指针
//   var j = 0; // pattern指针
//   while (i < str.length && j < pattern.length) {
//     if (str[i] === pattern[j] || j === -1) {
//       i++;
//       j++;
//     } else {
//       j = next[j]; // 右移
//     }
//   }
//   if (j === pattern.length) {
//     return i - j;
//   } else {
//     return -1;
//   }
// }

// const port = new SerialPort({
//   path: "COM13",
//   baudRate: 9600,
// });

// let count = 0;
// let flag = [-1, -1, -1]; //第一个为温度54 6d 70,第二个为41 64 63 adc 压力,第三个为49 73 6d lsm 加速度 磁力

// const str_tmp = "84,109,112"; //54,6d,70
// const str_adc = "65,100,99"; //41 64 63
// const str_lsm = "73,115,109"; //49,73,6d

// let srcData = [];

// let cnt =0 ;
// port.on("data", function (data) {
//   srcData.push(data);

//   console.log(
//     "--------------------------------data start--------------------------------"
//   );
//   console.log(data);
//   console.log(
//     "--------------------------------data end--------------------------------"
//   );

//   if (flag.includes(-1)) {
//     const str = data.join(",");

//     console.log(str);

//     if (kmp(str_tmp, str) !== -1) flag[0] = count;

//     if (kmp(str_adc, str) !== -1) flag[1] = count;

//     if (kmp(str_lsm, str) !== -1) flag[2] = count;

//     function isAllNone(arr) {
//       return arr.every(function (element) {
//         return element === -1;
//       });
//     }

//     if (!isAllNone(flag)) count++;

//     console.log(flag, count);
//     srcData = [];
//   } else {
//     console.log(srcData);

//     if (!srcData[0].join(",").includes("84,109,112")) {
//       srcData = [];
//     }

//     if (srcData.length === count) {
//       //   const mergedBuffer = Buffer.concat(srcData);
//       //   const srcData = Array.from(mergedBuffer);

//       const mergedArray = [];

//       for (const buffer of srcData) {
//         for (const byte of buffer) {
//           mergedArray.push(byte);
//         }
//       }
//       srcData = mergedArray;

//       //-----------------------------------handle adc events--------------------------------
//       // adc_x
//       {
//         let tmp =
//           srcData[0].toString(2).padStart(8, "0") +
//           srcData[1].toString(2).padStart(8, "0") +
//           srcData[2].toString(2).padStart(8, "0") +
//           srcData[3].toString(2).padStart(8, "0");
//         adc_x = parseInt(tmp, 2);
//         console.log("adc_x: ", adc_x);

//         // adc_y
//         tmp =
//           srcData[4].toString(2).padStart(8, "0") +
//           srcData[5].toString(2).padStart(8, "0") +
//           srcData[6].toString(2).padStart(8, "0") +
//           srcData[7].toString(2).padStart(8, "0");
//         adc_y = parseInt(tmp, 2);
//         console.log("adc_y: ", adc_y);
//         // adc_z
//         tmp =
//           srcData[8].toString(2).padStart(8, "0") +
//           srcData[9].toString(2).padStart(8, "0") +
//           srcData[10].toString(2).padStart(8, "0") +
//           srcData[11].toString(2).padStart(8, "0");
//         adc_z = parseInt(tmp, 2);
//         console.log("adc_z: ", adc_z);

//         if (adc_x) {
//           adcx.push(adc_x);
//           adcy.push(adc_y);
//           adcz.push(adc_z);
//           // 更新x轴坐标标签
//           myChart2.data.labels.push(new Date().toLocaleTimeString());
//         }

//         // // 限制数据点数量，只显示最近的20个数据点
//         // if (temperatureData.length > 30) {
//         //   temperatureData.shift();
//         //   myChart.data.labels.shift();
//         // }

//         // 动态更新y轴的最小值和最大值
//         if (cnt >= 20) {
//           const min = Math.min(...myChart2.data.datasets[0].data);
//           const max = Math.max(...myChart2.data.datasets[0].data);
//           myChart2.options.scales.y.min = min - (max - min) / 3;
//           myChart2.options.scales.y.max = max + (max - min) / 3;
//         }
//       }
//         myChart2.update();
//       //-----------------------------------handle acc events--------------------------------
//       // acc_x
//       {
//         tmp_acc =
//           srcData[28].toString(2).padStart(8, "0") +
//           srcData[29].toString(2).padStart(8, "0") +
//           srcData[30].toString(2).padStart(8, "0") +
//           srcData[31].toString(2).padStart(8, "0");
//         if (tmp_acc[0] == 0) {
//           // 正数
//           acc_x = parseInt(tmp_acc.slice(1), 2) * 0.061;
//           console.log("acc_x: ", acc_x);
//         } else {
//           // 负数
//           for (let i = 1; i < tmp_acc.size(); i++) {
//             tmp_acc[i] = 1 - tmp_acc[i];
//           }
//           acc_x = -(parseInt(tmp_acc.slice(1), 2) + 1) * 0.061;
//           console.log("acc_x: ", acc_x);
//         }

//         // acc_y
//         tmp_acc =
//           srcData[0].toString(2).padStart(8, "0") +
//           srcData[1].toString(2).padStart(8, "0") +
//           srcData[2].toString(2).padStart(8, "0") +
//           srcData[3].toString(2).padStart(8, "0");
//         if (tmp_acc[0] == 0) {
//           // 正数
//           acc_y = parseInt(tmp_acc.slice(1), 2) * 0.061;
//           console.log("acc_y: ", acc_y);
//         } else {
//           // 负数
//           for (let i = 1; i < tmp_acc.size(); i++) {
//             tmp_acc[i] = 1 - tmp_acc[i];
//           }
//           acc_y = -(parseInt(tmp_acc.slice(1), 2) + 1) * 0.061;
//           console.log("acc_y: ", acc_y);
//         }
//         // acc_z
//         tmp_acc =
//           srcData[4].toString(2).padStart(8, "0") +
//           srcData[5].toString(2).padStart(8, "0") +
//           srcData[6].toString(2).padStart(8, "0") +
//           srcData[7].toString(2).padStart(8, "0");
//         if (tmp_acc[0] == 0) {
//           // 正数
//           acc_z = parseInt(tmp_acc.slice(1), 2) * 0.061;
//           console.log("acc_z: ", acc_z);
//         } else {
//           // 负数
//           for (let i = 1; i < tmp_acc.size(); i++) {
//             tmp_acc[i] = 1 - tmp_acc[i];
//           }
//           acc_z = -(parseInt(tmp_acc.slice(1), 2) + 1) * 0.061;
//           console.log("acc_z: ", acc_z);
//         }

//         if (acc_x) {
//           accx.push(acc_x);
//           accy.push(acc_y);
//           accz.push(acc_z);
//           // 更新x轴坐标标签
//           myChart3.data.labels.push(new Date().toLocaleTimeString());
//         }

//         // // 限制数据点数量，只显示最近的20个数据点
//         // if (temperatureData.length > 30) {
//         //   temperatureData.shift();
//         //   myChart.data.labels.shift();
//         // }

//         // 动态更新y轴的最小值和最大值
//         if (cnt >= 20) {
//           const min = Math.min(...myChart3.data.datasets[0].data);
//           const max = Math.max(...myChart3.data.datasets[0].data);
//           myChart3.options.scales.y.min = min - (max - min) / 3;
//           myChart3.options.scales.y.max = max + (max - min) / 3;
//         }

//         myChart3.update();

//       }

//       //-----------------------------------handle tmp events--------------------------------
//       // 处理温度Tmp 54 6d 70
//       for (let i = 0; i < srcData.length; i++) {
//         if (srcData[i] === parseInt("54", 16)) {
//           if (
//             srcData[i + 1] === parseInt("6d", 16) &&
//             srcData[i + 2] === parseInt("70", 16)
//           ) {
//             // temperature 缺少负数的情况
//             let tmp =
//               srcData[i + 3].toString(2).padStart(4, "0") +
//               srcData[i + 4].toString(2).padStart(4, "0") +
//               srcData[i + 5].toString(2).padStart(4, "0") +
//               srcData[i + 6].toString(2).padStart(4, "0");
//             tmp = tmp.slice(0, -2);
//             if (tmp[0] == 0) {
//               temperature = parseInt(tmp.slice(1), 2) * 0.03125;
//               console.log("temperature: ", temperature);
//             } else {
//               for (let i = 1; i < tmp.size(); i++) {
//                 tmp[i] = 1 - tmp[i];
//               }
//               temperature = (parseInt(tmp.slice(1), 2) + 1) * 0.03125;
//               console.log("temperature: ", temperature);
//             }

//             if (tmp) {
//               temperatureData.push(temperature);
//               // 更新x轴坐标标签
//               myChart1.data.labels.push(new Date().toLocaleTimeString());
//             }

//             // // 限制数据点数量，只显示最近的20个数据点
//             // if (temperatureData.length > 30) {
//             //   temperatureData.shift();
//             //   myChart.data.labels.shift();
//             // }

//             // 动态更新y轴的最小值和最大值
//             if (cnt >= 20) {
//               const min = Math.min(...myChart1.data.datasets[0].data);
//               const max = Math.max(...myChart1.data.datasets[0].data);
//               myChart1.options.scales.y.min = min - (max - min) / 3;
//               myChart1.options.scales.y.max = max + (max - min) / 3;
//             }

//             // 更新图表
//             myChart1.update();
//           }
//         }
//       }
//       //-----------------------------------handle mag events--------------------------------
//       for (let i = 0; i < srcData.length; i++) {
//         if (srcData[i] === parseInt("41", 16)) {
//           if (
//             srcData[i + 1] === parseInt("64", 16) &&
//             srcData[i + 2] === parseInt("63", 16)
//           ) {
//             // mag_x
//             tmp =
//               srcData[8].toString(2).padStart(8, "0") +
//               srcData[9].toString(2).padStart(8, "0") +
//               srcData[10].toString(2).padStart(8, "0") +
//               srcData[11].toString(2).padStart(8, "0");
//             if (tmp[0] == 0) {
//               // 正数
//               mag_x = parseInt(tmp.slice(1), 2) * 1.5;
//               console.log("mag_x: ", mag_x);
//             } else {
//               // 负数
//               for (let i = 1; i < tmp.size(); i++) {
//                 tmp[i] = 1 - tmp[i];
//               }
//               mag_x = -(parseInt(tmp.slice(1), 2) + 1) * 1.5;
//               console.log("mag_x: ", mag_x);
//             }
//             // mag_y
//             tmp =
//               srcData[12].toString(2).padStart(8, "0") +
//               srcData[13].toString(2).padStart(8, "0") +
//               srcData[14].toString(2).padStart(8, "0") +
//               srcData[15].toString(2).padStart(8, "0");
//             if (tmp[0] == 0) {
//               // 正数
//               mag_y = parseInt(tmp.slice(1), 2) * 1.5;
//               console.log("mag_y: ", mag_y);
//             } else {
//               // 负数
//               for (let i = 1; i < tmp.size(); i++) {
//                 tmp[i] = 1 - tmp[i];
//               }
//               mag_y = -(parseInt(tmp.slice(1), 2) + 1) * 1.5;
//               console.log("mag_y: ", mag_y);
//             }
//             // mag_z
//             tmp =
//               srcData[16].toString(2).padStart(8, "0") +
//               srcData[17].toString(2).padStart(8, "0") +
//               srcData[18].toString(2).padStart(8, "0") +
//               srcData[19].toString(2).padStart(8, "0");
//             if (tmp[0] == 0) {
//               // 正数
//               mag_z = parseInt(tmp.slice(1), 2) * 1.5;
//               console.log("mag_z: ", mag_z);
//             } else {
//               // 负数
//               for (let i = 1; i < tmp.size(); i++) {
//                 tmp[i] = 1 - tmp[i];
//               }
//               mag_z = -(parseInt(tmp.slice(1), 2) + 1) * 1.5;
//               console.log("mag_z: ", mag_z);
//             }

//             //chart
//             if (mag_x) {
//               magx.push(mag_x);
//               magy.push(mag_y);
//               magz.push(mag_z);
//               // 更新x轴坐标标签
//               myChart4.data.labels.push(new Date().toLocaleTimeString());
//             }

//             // // 限制数据点数量，只显示最近的20个数据点
//             // if (temperatureData.length > 30) {
//             //   temperatureData.shift();
//             //   myChart.data.labels.shift();
//             // }

//             // 动态更新y轴的最小值和最大值
//             if (cnt >= 20) {
//               const min = Math.min(...myChart4.data.datasets[0].data);
//               const max = Math.max(...myChart4.data.datasets[0].data);
//               myChart4.options.scales.y.min = min - (max - min) / 3;
//               myChart4.options.scales.y.max = max + (max - min) / 3;
//             }

//             myChart4.update();

//           }
//         }
//       }

//       // 清空srcData
//       srcData = [];
//     }
//   }
// });

// --------------------------------------传感器数据处理------------------------------

// // port.on('data', function (data) {
// //   cnt++;
// //   if (cnt % 3 !== 0) return;
// //   console.log("----------");
// //   console.log(data);
// //   // console.log(data.length);
// //   for (let i = 0; i < data.length; i++) {
// //     if (data[i] === parseInt('54', 16)) {
// //       if (data[i + 1] === parseInt('6d', 16) && data[i + 2] === parseInt('70', 16)) {
// //         let tmp = data[i + 3].toString(2).padStart(4, '0') + data[i + 4].toString(2).padStart(4, '0')
// //           + data[i + 5].toString(2).padStart(4, '0') + data[i + 6].toString(2).padStart(4, '0');
// //         tmp = parseInt(tmp.slice(0, -2), 2) * 0.03125;
// //         // document.getElementById('ports').innerHTML = parseInt(tmp.slice(0, -2), 2) * 0.03125 + "℃";
// //         // 添加新的温度数据到数组
// //         if (tmp) {
// //           temperatureData.push(tmp);
// //           // 更新x轴坐标标签
// //           myChart.data.labels.push(new Date().toLocaleTimeString());
// //         }

// //         // // 限制数据点数量，只显示最近的20个数据点
// //         // if (temperatureData.length > 30) {
// //         //   temperatureData.shift();
// //         //   myChart.data.labels.shift();
// //         // }

// //         // 动态更新y轴的最小值和最大值
// //         if (cnt >= 20) {
// //           const min = Math.min(...myChart.data.datasets[0].data);
// //           const max = Math.max(...myChart.data.datasets[0].data);
// //           myChart.options.scales.y.min = min - (max - min) / 3;
// //           myChart.options.scales.y.max = max + (max - min) / 3;
// //         }

// //         // 更新图表
// //         myChart.update();
// //       }
// //     }
// //   }
// // })
