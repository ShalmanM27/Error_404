// SPDX-License-Identifier: MIT
pragma solidity ^0.8.18;

/**
 * @title Health
 * @dev Decentralized health record management system with doctor functionalities.
 */
contract Ex {
    struct Doctor {
        uint256 id;
        string name;
        string specialization;
        uint256 experienceYears;
        bool exists;
    }

    struct Patient {
        uint256 id;
        string name;
        Record[] records;
        mapping(address => bool) approvedDoctors; // Track approved doctors for the patient
    }

    struct Record {
        string hash;  // IPFS hash or off-chain storage link
        uint256 timestamp;
        string description;
    }

    address public admin;

    mapping(address => Doctor) public doctors;
    address[] public doctorAddresses; // Store doctor addresses to list them later
    mapping(address => Patient) public patients;

    event DoctorAdded(uint256 id, string name);
    event DoctorDeleted(address doctorAddress, uint256 id);
    event PatientRegistered(uint256 id, string name);
    event RecordUploaded(address indexed patient, string recordHash, string description);
    event DoctorUpdated(address indexed doctorAddress, string name, string specialization);
    event DoctorAccessGranted(address indexed patient, address indexed doctor);
    event DoctorAccessRevoked(address indexed patient, address indexed doctor);

    modifier onlyAdmin() {
        require(msg.sender == admin, "Only admin can perform this action");
        _;
    }

    modifier onlyDoctor() {
        require(doctors[msg.sender].exists, "Only registered doctors can perform this action");
        _;
    }

    modifier onlyPatient() {
        require(patients[msg.sender].id != 0, "Only registered patients can perform this action");
        _;
    }

    constructor() {
        admin = msg.sender;
    }

    function addDoctor(
        address _doctorAddress,
        uint256 _id,
        string memory _name,
        string memory _specialization,
        uint256 _experienceYears
    ) external onlyAdmin {
        require(!doctors[_doctorAddress].exists, "Doctor already exists");

        doctors[_doctorAddress] = Doctor({
            id: _id,
            name: _name,
            specialization: _specialization,
            experienceYears: _experienceYears,
            exists: true
        });

        doctorAddresses.push(_doctorAddress); // Add the doctor address to the list

        emit DoctorAdded(_id, _name);
    }

    function deleteDoctor(address _doctorAddress) external onlyAdmin {
        require(doctors[_doctorAddress].exists, "Doctor does not exist");

        uint256 doctorId = doctors[_doctorAddress].id;

        // Delete the doctor from the mapping
        delete doctors[_doctorAddress];

        // Remove the doctor address from the array
        for (uint256 i = 0; i < doctorAddresses.length; i++) {
            if (doctorAddresses[i] == _doctorAddress) {
                doctorAddresses[i] = doctorAddresses[doctorAddresses.length - 1];
                doctorAddresses.pop();
                break;
            }
        }

        emit DoctorDeleted(_doctorAddress, doctorId);
    }

    function getAllDoctors() external view returns (address[] memory, Doctor[] memory) {
        Doctor[] memory allDoctors = new Doctor[](doctorAddresses.length);
        for (uint256 i = 0; i < doctorAddresses.length; i++) {
            allDoctors[i] = doctors[doctorAddresses[i]];
        }
        return (doctorAddresses, allDoctors);
    }

    function registerPatient(
        address _patientAddress,
        uint256 _id,
        string memory _name
    ) external onlyAdmin {
        require(patients[_patientAddress].id == 0, "Patient already registered");

        patients[_patientAddress].id = _id;
        patients[_patientAddress].name = _name;

        emit PatientRegistered(_id, _name);
    }

    function uploadPatientRecord(
        address _patientAddress,
        string memory _recordHash,
        string memory _description
    ) external onlyAdmin {
        require(patients[_patientAddress].id != 0, "Patient not found");

        patients[_patientAddress].records.push(Record({
            hash: _recordHash,
            timestamp: block.timestamp,
            description: _description
        }));

        emit RecordUploaded(_patientAddress, _recordHash, _description);
    }

    function viewMyRecords() external view returns (Record[] memory) {
        require(patients[msg.sender].id != 0, "Patient not found");
        return patients[msg.sender].records;
    }

    function grantDoctorAccess(address _doctorAddress) external onlyPatient {
        require(doctors[_doctorAddress].exists, "Doctor does not exist");
        require(!patients[msg.sender].approvedDoctors[_doctorAddress], "Doctor already has access");
        
        patients[msg.sender].approvedDoctors[_doctorAddress] = true;

        emit DoctorAccessGranted(msg.sender, _doctorAddress);
    }

    function revokeDoctorAccess(address _doctorAddress) external onlyPatient {
        require(doctors[_doctorAddress].exists, "Doctor does not exist");
        require(patients[msg.sender].approvedDoctors[_doctorAddress], "Doctor does not have access");
        
        patients[msg.sender].approvedDoctors[_doctorAddress] = false;

        emit DoctorAccessRevoked(msg.sender, _doctorAddress);
    }

    function viewPatientRecords(address _patientAddress) external view onlyDoctor returns (Record[] memory) {
        require(patients[_patientAddress].id != 0, "Patient not found");
        require(patients[_patientAddress].approvedDoctors[msg.sender], "Doctor access not granted");

        return patients[_patientAddress].records;
    }

    function updateDoctorInfo(
        string memory _name,
        string memory _specialization,
        uint256 _experienceYears
    ) external onlyDoctor {
        Doctor storage doctor = doctors[msg.sender];

        doctor.name = _name;
        doctor.specialization = _specialization;
        doctor.experienceYears = _experienceYears;

        emit DoctorUpdated(msg.sender, _name, _specialization);
    }
}
