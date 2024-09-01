/*
1、excel表头定义
2、按钮逻辑天机
3、port数据处理
 */

const { SerialPort } = require("serialport");
const Clock = require("./clock");
const XLSX = require("xlsx");
const fs = require("fs");
const path = require("path");

// 创建一个 Clock 实例
const myClock = new Clock();
var port;

//------------------------------------------------excel表格 start------------------------------------------------

var outputData = [
  ["时间", "adc_x", "adc_y", "adc_z", "温度","acc_x", "acc_y", "acc_z", "mag_x", "mag_y", "mag_z"],
  ["年/月/日 时/分/秒:分秒", "单位", "单位", "单位", "℃","单位", "单位", "单位","单位", "单位", "单位"],
];

function createExcel(time) {
  console.log(time);

  // 创建data文件夹，如果不存在
  const dataFolder = path.join(__dirname, "..", "..", "..", "data");

  console.log(dataFolder);

  if (!fs.existsSync(dataFolder)) {
    fs.mkdirSync(dataFolder, { recursive: true });
  }

  console.log(outputData);
  //工作表创建处理
  var workbook = XLSX.utils.book_new();

  // 创建一个新的工作表
  var worksheet = XLSX.utils.aoa_to_sheet(outputData);
  XLSX.utils.book_append_sheet(workbook, worksheet, "Sheet1");

  // 将工作簿保存为 Excel 文件，在data文件夹里面
  const fileName = path.join(dataFolder, time.replace(/[^a-zA-Z0-9]/g, '_') + "-output.xlsx");
  XLSX.writeFile(workbook, fileName);

  console.log("Excel file created successfully!");
  
  outputData = [
    ["时间", "adc_x", "adc_y", "adc_z", "温度","acc_x", "acc_y", "acc_z", "mag_x","mag_y","mag_z"],
    ["年/月/日 时/分/秒:分秒", "单位", "单位", "单位", "℃", "单位", "单位", "单位", "单位", "单位", "单位"],
  ];
}

//------------------------------------------------excel表格 end------------------------------------------------

//----------------------------------按钮逻辑处理 start--------------------------------

// 获取开始和结束按钮
const startBtn = document.getElementById("start-btn");
const stopBtn = document.getElementById("stop-btn");

var formattedStartTime;

startBtn.addEventListener("click", () => {
  const comInput = document.getElementById("port").value;

  const startTime = new Date();
  const milliseconds = startTime.getMilliseconds();
  formattedStartTime = `${startTime.toLocaleString()}:${milliseconds}`;
  document.getElementById("start-time").textContent = formattedStartTime;

  myClock.start();
  console.log(comInput);

  // 生产环境
  getData(comInput);
  // 开发环境
  // testData();

  // 执行接下来的操作，比如与串口通信
});

// 点击结束按钮时停止计时，并显示总共经过的时间
stopBtn.addEventListener("click", () => {
  port.close(function (err) {
    if (err) {
      console.log("Error closing port: ", err.message);
    } else {
      console.log("Port closed");
    }
  });

  const totalTime = myClock.stop();
  document.getElementById("duration").textContent = ` ${totalTime} seconds`;

  const endTime = new Date();
  const milliseconds = endTime.getMilliseconds();
  const formattedTime = `${endTime.toLocaleString()}:${milliseconds}`;
  document.getElementById("end-time").textContent = formattedTime;

  document.getElementById("size").textContent = cnt;

  cnt = 0;

  //处理excel输出

  createExcel(formattedStartTime);
});

//----------------------------------按钮逻辑处理 end--------------------------------

//----------------------------------传感器数据处理str处理函数 start--------------------------------
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

//----------------------------------传感器数据处理str处理函数 end--------------------------------

// 以下为核心数据处理代码

let cnt = 0;
// --------------------------------------传感器数据处理 start------------------------------
function getData(portValue) {
  port = new SerialPort({
    path: portValue,
    baudRate: 9600,
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
        test.push(adc_x);

        let adc_y = processADC(adcValue_y);
        console.log("adc_y: " + adc_y);
        test.push(adc_y);

        let adc_z = processADC(adcValue_z);
        console.log("adc_z: " + adc_z);
        test.push(adc_z);
//-----------------------------------handle tmp events--------------------------------
        // 处理温度Tmp 54 6d 70
        for (let i = 0; i < srcData.length; i++) {
          if (srcData[i] === parseInt("54", 16)) {
            if (
              srcData[i + 1] === parseInt("6d", 16) &&
              srcData[i + 2] === parseInt("70", 16)
            ) {
              // temperature 缺少负数的情况
              // let tmp =
              //   srcData[i + 3].toString(2).padStart(4, "0") +
              //   srcData[i + 4].toString(2).padStart(4, "0") +
              //   srcData[i + 5].toString(2).padStart(4, "0") +
              //   srcData[i + 6].toString(2).padStart(4, "0");
              let tmp =
                (srcData[i + 3] || 0).toString(2).padStart(4, "0") +
                (srcData[i + 4] || 0).toString(2).padStart(4, "0") +
                (srcData[i + 5] || 0).toString(2).padStart(4, "0") +
                (srcData[i + 6] || 0).toString(2).padStart(4, "0");
              console.log(
                srcData[i + 3].toString() +
                  srcData[i + 4].toString() +
                  srcData[i + 5].toString() +
                  srcData[i + 6].toString()
              );
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
                test.push(temperature);
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
                test.push(temperature);
              }
            }
          }
        }
        //-----------------------------------handle mag events--------------------------------


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
        test.push(result_x);
        test.push(result_y);
        test.push(result_z);

        

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
        console.log("mag_x: " + processMagnetism(magValue_x));
        console.log("mag_y: " + processMagnetism(magValue_y));
        console.log("mag_z: " + processMagnetism(magValue_z));
        test.push( processMagnetism(magValue_x));
        test.push( processMagnetism(magValue_y));
        test.push( processMagnetism(magValue_z));

        outputData.push(test);
        // 清空srcData
        srcData = [];
      }
    }
  });
}
// --------------------------------------传感器数据处理 end------------------------------
