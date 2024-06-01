// 创建场景、相机和渲染器
const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
const renderer = new THREE.WebGLRenderer({ antialias: true });

// 设置渲染器的大小，并将其添加到容器元素中
const container = document.getElementById('canvas-container');
renderer.setSize(600, 450);
renderer.setClearColor(0x000000, 1); // 设置背景颜色为黑色
container.appendChild(renderer.domElement);

// 创建立方体
const geometry = new THREE.BoxGeometry(1, 1, 1);

// 设置每个面的贴图
const texturePath = 'imgs/';
const textures = [
    new THREE.TextureLoader().load(texturePath + 'front.png'),
    new THREE.TextureLoader().load(texturePath + 'back.png'),
    new THREE.TextureLoader().load(texturePath + 'top.png'),
    new THREE.TextureLoader().load(texturePath + 'bottom.png'),
    new THREE.TextureLoader().load(texturePath + 'left.png'),
    new THREE.TextureLoader().load(texturePath + 'right.png')
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
camera.position.z = 5;

// 添加鼠标控制器
const controls = new THREE.OrbitControls(camera, renderer.domElement);

// 修改立方体的姿态和位置
function updateCube(rotationX, rotationY, rotationZ, positionX, positionY, positionZ) {
    cube.rotation.x = rotationX;
    cube.rotation.y = rotationY;
    cube.rotation.z = rotationZ;
    cube.position.x = positionX;
    cube.position.y = positionY;
    cube.position.z = positionZ;
}

// 渲染循环
function animate() {
    requestAnimationFrame(animate);
    controls.update(); // 更新鼠标控制器
    renderer.render(scene, camera);
}
animate();

// 创建按钮元素
const rotateXBtn = document.createElement('button');
rotateXBtn.textContent = '绕X轴旋转';
container.appendChild(rotateXBtn);

const rotateYBtn = document.createElement('button');
rotateYBtn.textContent = '绕Y轴旋转';
container.appendChild(rotateYBtn);

const rotateZBtn = document.createElement('button');
rotateZBtn.textContent = '绕Z轴旋转';
container.appendChild(rotateZBtn);

// 为按钮添加事件监听器
rotateXBtn.addEventListener('click', () => {
    const rotationSpeed = 0.01; // 旋转速度
    cube.rotation.z += rotationSpeed;
});

rotateYBtn.addEventListener('click', () => {
    const rotationSpeed = 0.01; // 旋转速度
    cube.rotation.x += rotationSpeed;
});

rotateZBtn.addEventListener('click', () => {
    const rotationSpeed = 0.01; // 旋转速度
    cube.rotation.y += rotationSpeed;
});