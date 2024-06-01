const { ipcRenderer } = require('electron');

ipcRenderer.send('getSerialPorts');

ipcRenderer.on('serialPorts', (event, ports) => {
    console.log('Serial Ports:', ports);
    renderSerialPortsTable(ports);
});

function renderSerialPortsTable(ports) {
    const tableBody = document.querySelector('#serialPortTable tbody');

    ports.forEach(port => {
        const row = tableBody.insertRow();
        row.insertCell(0).textContent = port.path;
        row.insertCell(1).textContent = port.manufacturer || 'N/A';
        row.insertCell(2).textContent = port.friendlyName || 'N/A';
        row.insertCell(3).textContent = port.pnpId || 'N/A';

    });
}