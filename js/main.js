const addVehicle = document.querySelector('#addVehicle');
const noVehicles = document.querySelector('#noVehicles');
const VehiclesList = document.querySelector('#vehiclesList');
const parkedVehicles = document.querySelector('#parkedVehicles');

const removeVehicleModal = new bootstrap.Modal(document.querySelector('#removeVehicleModal'));
const removeVehicleModalContent = document.querySelector('#removeVehicleModalContent');
const alertModal = new bootstrap.Modal(document.querySelector('#alertModal'));
const alertModalContent = document.querySelector('#alertModalContent');

const printReceipt = document.querySelector('#printReceipt');
const added = document.querySelector('#added');
const loadingScreen = document.querySelector('#loadingScreen');

const Vehicles = {}

const parkingRateCar = 5; // 5 birr per 30 minutes
const parkingRateMotorcycle = 3; // 3 birr per 30 minutes

setTimeout(() => {
    loadingScreen.classList.add('d-none');
}, 1500);



addVehicle.onclick = () => {

    // get value of select element
    let vehicleType = document.querySelector('#vehicleType').value;
    let plateNumber = document.querySelector('#plateNumber').value;
    let ownerPhone = document.querySelector('#ownerPhone').value;
    let parkedHour = new Date().getHours()
    let parkedMinute = new Date().getMinutes()

    // check if the plate number already exist
    if(Vehicles[plateNumber]) {
        alertModal.show();
        return
    }

    added.classList.remove('d-none');
    added.classList.add('animate__animated', 'animate__slideInLeft')
    setTimeout(() => {
        added.classList.add('d-none');
        added.classList.remove('animate__animated', 'animate__slideInLeft')
    }, 1500);
    
    Vehicles[plateNumber] = {
        type: vehicleType,
        ownerPhone: ownerPhone,
        timeParked: [parkedHour, parkedMinute]
    };
    
    displayVehicles();
    
}

const displayVehicles = () => {
    parkedVehicles.innerHTML = Object.keys(Vehicles).length;

    if(Object.keys(Vehicles).length > 0) {
        noVehicles.classList.add('d-none');
    } else {
        noVehicles.classList.remove('d-none');
    }
    
    VehiclesList.innerHTML = '';
    for (let vehicle in Vehicles) {
        VehiclesList.innerHTML += `
            <tr>
                <td>${Object.keys(Vehicles).indexOf(vehicle) + 1}</td>
                <td>${Vehicles[vehicle].type}</td>
                <td>${vehicle}</td>
                <td>${(Vehicles[vehicle].ownerPhone)}</td>
                <td>${Vehicles[vehicle].timeParked[0]}:${Vehicles[vehicle].timeParked[1]}</td>
                <td>
                    <button class="btn btn-danger" alt="remove" onclick="removeVehicle('${vehicle}')">
                        <i class="bi bi-trash"></i>
                    </button>
                </td>
            </tr>
        `;
    }
}
    
const removeVehicle = (VehiclePlate) => {
    let date = new Date().toLocaleDateString();
    let exitHours = new Date().getHours();
    let exitMinutes = new Date().getMinutes();
    let timeSpent = (exitHours - Vehicles[VehiclePlate].timeParked[0]) * 60 + (exitMinutes - Vehicles[VehiclePlate].timeParked[1]);

    let amountDue = 0;
    if(Vehicles[VehiclePlate].type == 'Car') {
        (amountDue) = Math.floor(timeSpent * parkingRateCar / 30);
    } else {
        (amountDue) = Math.floor(timeSpent * parkingRateMotorcycle / 30);
    }
    
    removeVehicleModalContent.innerHTML = `
        <p class="lead mb-4 text-center">Parking System</p>
        <div class="text-end">
            <p>Date: ${date}</p>
            <p>Time Parked: ${Vehicles[VehiclePlate].timeParked[0] + ":" + Vehicles[VehiclePlate].timeParked[1]}</p>
        </div>
        <p class="fw-bold">Vehicle Details</p>
        <p>Type: ${Vehicles[VehiclePlate].type}</p>
        <p>Plate No: ${VehiclePlate}</p>
        <p>Phone: ${Vehicles[VehiclePlate].ownerPhone}</p>
        <p>Time Spent: ${timeSpent}</p>
        <p>5 Birr per 30 minutes</p>
        <p class="fw-bold">Total Fee: ${amountDue} Birr</p>

        <div class="text-center mt-5">
            <p>Thank you for parking with us</p>
            <p class="small">Parking &copy; 2023</p>
        </div>                             
     `;
    removeVehicleModal.show();
    
    delete Vehicles[VehiclePlate];

    displayVehicles();
}


printReceipt.onclick = function () {
    
    html2canvas(removeVehicleModalContent).then(function(canvas) {
        // Convert the canvas to a data URL
        const dataURL = canvas.toDataURL();

        // Create a link element and set its attributes
        const downloadLink = document.createElement('a');
        downloadLink.download = 'receipt.png';
        downloadLink.href = dataURL;
        
        // Click the link to download the image
        downloadLink.click();
    });
  };


// Demo data
Vehicles['AA 1234'] = {
    type: 'Car',
    ownerPhone: '0912345678',
    timeParked: [new Date().getHours() - 3, new Date().getMinutes()]
}
Vehicles['AA 1235'] = {
    type: 'Motorcycle',
    ownerPhone: '0912345678',
    timeParked: [new Date().getHours() - 3, new Date().getMinutes()]
}
displayVehicles();

