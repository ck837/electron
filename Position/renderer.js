const { SerialPort } = require("serialport");
// 创建场景、相机和渲染器
const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
const renderer = new THREE.WebGLRenderer({ antialias: true });



// 获取屏幕尺寸
const screenWidth = window.innerWidth;
const screenHeight = window.innerHeight;

// 设置渲染器的大小，并将其添加到容器元素中
const container = document.getElementById('canvas-container');
// 设置渲染器的大小为全屏
renderer.setSize(screenWidth, screenHeight);
renderer.setClearColor('#142233'); // 设置背景颜色为黑色
container.appendChild(renderer.domElement);

// 创建立方体
const geometry = new THREE.BoxGeometry(1, 1, 1);
const texturePath = 'imgs/';
const textures = [
    new THREE.TextureLoader().load(texturePath + 'right.png'),
    new THREE.TextureLoader().load(texturePath + 'left.png'),
    new THREE.TextureLoader().load(texturePath + 'top.png'),
    new THREE.TextureLoader().load(texturePath + 'bottom.png'),
    new THREE.TextureLoader().load(texturePath + 'front.png'),
    new THREE.TextureLoader().load(texturePath + 'back.png')
];
const materials = [
    new THREE.MeshBasicMaterial({ map: textures[0] }),
    new THREE.MeshBasicMaterial({ map: textures[1] }),
    new THREE.MeshBasicMaterial({ map: textures[2] }),
    new THREE.MeshBasicMaterial({ map: textures[3] }),
    new THREE.MeshBasicMaterial({ map: textures[4] }),
    new THREE.MeshBasicMaterial({ map: textures[5] })
];
const cube = new THREE.Mesh(geometry, materials);
scene.add(cube);

// 设置相机位置
camera.position.z = 3;
camera.position.x = 1;
camera.position.y = 1;
camera.lookAt(0, 0, 0);

// 添加鼠标控制器
const controls = new THREE.OrbitControls(camera, renderer.domElement);
controls.target.copy(cube.position);
controls.update();

// 创建固定坐标系并进行旋转
const axisLength = 10;
const axesHelper = new THREE.AxesHelper(axisLength);
const color1 = new THREE.Color('red');
const color2 = new THREE.Color('blue');
const color3 = new THREE.Color('green');
axesHelper.setColors(color1, color2, color3);
scene.add(axesHelper);

// 渲染循环
function animate() {
    requestAnimationFrame(animate);
    controls.update(); // 更新鼠标控制器
    renderer.render(scene, camera);
}
animate();

// 保存先前的滤波数据
let prevFilteredAcc = [0, 0, 0];
let prevFilteredMag = [0, 0, 0];

// 指定EMA参数
const alpha = 0.2;

// 函数：计算四元数
function KGetQuat(ax, ay, az, mx, my, mz) {
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

// 函数：返回符号与y相同的x值
function copysign(x, y) {
    return y < 0 ? -Math.abs(x) : Math.abs(x);
}

// 函数：将四元数转换为欧拉角
function quaternionToEuler(q) {
    const [qw, qx, qy, qz] = q;
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

    return [roll, pitch, yaw];
}

// 实时更新立方体姿态
function updateCube(ax, ay, az, mx, my, mz) {
    const quat = KGetQuat(ax, ay, az, mx, my, mz);
    const [roll, pitch, yaw] = quaternionToEuler(quat);
    cube.rotation.x = roll;
    cube.rotation.y = pitch;
    cube.rotation.z = yaw;
}


// 假设我们每秒钟获得新的加速度和磁场数据

getData("COM17", 9600); 





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
        let adc_y = processADC(adcValue_y);
        console.log("adc_y: " + adc_y);
        let adc_z = processADC(adcValue_z);
        console.log("adc_z: " + adc_z);
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

        updateCube(result_x, result_y, result_y, mag_result_x, mag_result_x, mag_result_x);
        // 清空srcData
        srcData = [];
      }
    }
  });
}
