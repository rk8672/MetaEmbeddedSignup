import TableWrapper from "../../layouts/TableWrapper";
import PageWrapper from "../../layouts/PageWrapper";
const columns = [
  { label: "S.No", render: (_row, index) => index + 1 },
  { label: "Name", key: "name" },
  { label: "Age", key: "age" },
  { label: "Status", key: "status" },
  { label: "Address", key: "address" },
  { label: "Last Visit", key: "lastVisit" },
  { label: "Total Visits", key: "totalVisits" },
  {
    label: "Action",
    render: () => (
      <button className="text-blue-600 hover:underline text-xs">View</button>
    ),
  },
];
const data = [
  {
    name: "Aarav Sharma",
    age: 30,
    status: "Active",
    address: "123 MG Road, Delhi",
    lastVisit: "2024-12-01",
    totalVisits: 5,
  },
  {
    name: "Vihaan Patel",
    age: 42,
    status: "Inactive",
    address: "22 Nehru Nagar, Ahmedabad",
    lastVisit: "2023-11-12",
    totalVisits: 2,
  },
  {
    name: "Vivaan Reddy",
    age: 27,
    status: "Pending",
    address: "15 Jubilee Hills, Hyderabad",
    lastVisit: "2025-01-25",
    totalVisits: 3,
  },
  {
    name: "Aditya Mehta",
    age: 35,
    status: "Active",
    address: "88 Marine Drive, Mumbai",
    lastVisit: "2025-04-12",
    totalVisits: 4,
  },
  {
    name: "Krishna Nair",
    age: 50,
    status: "Active",
    address: "7 Convent Road, Kochi",
    lastVisit: "2024-10-05",
    totalVisits: 6,
  },
  {
    name: "Aryan Singh",
    age: 31,
    status: "Pending",
    address: "9 Ashok Vihar, Kanpur",
    lastVisit: "2025-03-11",
    totalVisits: 1,
  },
  {
    name: "Kabir Joshi",
    age: 22,
    status: "Active",
    address: "45 Civil Lines, Bhopal",
    lastVisit: "2025-02-14",
    totalVisits: 2,
  },
  {
    name: "Arjun Deshmukh",
    age: 29,
    status: "Inactive",
    address: "63 Fergusson College Road, Pune",
    lastVisit: "2024-07-19",
    totalVisits: 3,
  },
  {
    name: "Rohan Iyer",
    age: 40,
    status: "Active",
    address: "11 Besant Nagar, Chennai",
    lastVisit: "2025-05-01",
    totalVisits: 7,
  },
  {
    name: "Dev Malhotra",
    age: 38,
    status: "Pending",
    address: "81 Sector 62, Noida",
    lastVisit: "2025-01-05",
    totalVisits: 4,
  },
  // ... Add 40 more like this
];


const Patients = () => {
 return (
  <PageWrapper
    title="Patient Directory"
    subtitle="View and manage all registered patients with real-time status tracking"
  >
    <TableWrapper
      title="Patient Overview"
    //   description="This table provides essential demographic and status information for each registered patient."
      columns={columns}
      data={data}
    />
  </PageWrapper>
);
};

export default Patients;
